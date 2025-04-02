import { message, superValidate, type Infer } from 'sveltekit-superforms';
import { redirect } from '@sveltejs/kit';
import crypto from 'crypto';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { SignInSchema } from './schema';
import { createSession, rateLimit, verifyPassword } from '../../lib/server/utils/authCore';
import { findUserByEmail } from '../../lib/server/utils/user';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		return redirect(303, `/dashboard`);
	}
	return { form: await superValidate(zod(SignInSchema)) };
};

export const actions = {
	default: async (event) => {
		const form = await superValidate<Infer<typeof SignInSchema>, string>(
			event.request,
			zod(SignInSchema)
		);

		const ip = event.getClientAddress();
		await rateLimit({ ip, form });

		if (!form.valid) return message(form, 'Invalid form data', { status: 400 });
		try {
			const existingUser = await findUserByEmail(form.data.email);

			if (!existingUser) {
				return message(form, 'Email Adress Not Found', { status: 400 });
			}

			// Use a generic error message to avoid account enumeration
			if (!existingUser.hashedPassword || !existingUser.salt) {
				return message(
					form,
					'You used a different provider to sign up. Please set your password in profile settings by signing in with that provider',
					{ status: 400 }
				);
			}

			verifyPassword({
				plainPassword: form.data.password,
				userSalt: existingUser.salt,
				userPassword: existingUser.hashedPassword,
				form
			});

			const sessionId = crypto.randomBytes(512).toString('hex').normalize();

			await createSession({ sessionId, id: existingUser.id, role: existingUser.role });

			event.cookies.set('session', sessionId, {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				secure: process.env.NODE_ENV === 'production',
				expires: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000), // 7 days expiration
				priority: 'high'
			});

			return message(form, 'Signed In successfully!');
		} catch (error) {
			return message(form, `Internal Server Error: ${JSON.stringify(error, null, 2)}`, {
				status: 500
			});
		}
	}
} satisfies Actions;
