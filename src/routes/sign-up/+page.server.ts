import { zod, type Infer } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';
import { message } from 'sveltekit-superforms/server';
import crypto from 'crypto';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { SignUpSchema } from './schema';
import { createAccount, hashPassword, rateLimit } from '../../lib/server/utils/authCore';
import { createUser, findUserByEmail } from '../../lib/server/utils/user';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		return redirect(302, `/dashboard`);
	}
	return { form: await superValidate(zod(SignUpSchema)) };
};

export const actions = {
	default: async (event) => {
		const form = await superValidate<Infer<typeof SignUpSchema>, string>(
			event.request,
			zod(SignUpSchema)
		);

		const ip = event.getClientAddress();
		await rateLimit({ ip, form });

		if (!form.valid) return message(form, 'Invalid form data', { status: 400 });

		try {
			const existingUser = await findUserByEmail(form.data.email);

			// Return a generic error message to avoid email enumeration.
			if (existingUser) {
				return message(form, 'Email Adress already exists. Please Sign In', { status: 409 });
			}

			const salt = crypto.randomBytes(16).toString('hex').normalize();

			const hashedPassword = hashPassword({ password: form.data.password, salt });

			const newUser = await createUser({
				name: form.data.name,
				email: form.data.email,
				salt,
				hashedPassword
			});

			if (!newUser) {
				return message(form, 'User not created', { status: 500 });
			}

			const newAccount = await createAccount({ provider: 'Credentials', userId: newUser.id });

			if (!newAccount) {
				return message(form, 'Error while creating account', { status: 500 });
			}
			return message(
				form,
				'Signed Up successfully! Please Verify your email adress before sign in'
			);
		} catch (error) {
			return message(form, `Internal Server Error: ${JSON.stringify(error, null, 2)}`, {
				status: 500
			});
		}
	}
} satisfies Actions;
