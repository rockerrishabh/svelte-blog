import { zod, type Infer } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';
import { message } from 'sveltekit-superforms/server';
import crypto from 'node:crypto';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { SignUpSchema } from './schema';
import { createAccount, hashPassword } from '../../lib/server/utils/authCore';
import { createUser, findUserByEmail } from '../../lib/server/utils/user';
import { redis } from '$lib/server/db';

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
		// Rate limiting: check the number of recent login attempts from the IP address.
		const rateKey = `login_attempts:${ip}`;
		const attempts = Number(await redis.get(rateKey)) || 0;
		const MAX_ATTEMPTS = 5;
		const RATE_LIMIT_WINDOW = 60; // in seconds

		if (attempts >= MAX_ATTEMPTS) {
			return message(form, 'Too many login attempts. Please try again later.', { status: 429 });
		}
		// Increment the attempt count and set expiration if it's the first attempt.
		await redis.incr(rateKey);
		await redis.expire(rateKey, RATE_LIMIT_WINDOW);

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

			const newAccount = await createAccount({ userId: newUser.id });

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
