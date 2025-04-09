import { redirect } from '@sveltejs/kit';
import crypto from 'node:crypto';
import { GOOGLE_ID, GOOGLE_SECRET, APP_ENDPOINT } from '$env/static/private';
import { createAccount, createSession } from '../../../../lib/server/utils/authCore';
import { createUser, findUserByEmail, updateUser } from '../../../../lib/server/utils/user';
import { redis } from '$lib/server/db';

type GoogleUser = {
	id: string;
	email: string;
	verified_email: boolean;
	name: string | null;
	given_name: string | null;
	family_name: string | null;
	picture: string | null;
};

export const GET = async (event) => {
	// Rate limiting: check the number of recent login attempts from the IP address.
	const ip = event.getClientAddress();
	// Rate limiting: check the number of recent login attempts from the IP address.
	const rateKey = `login_attempts:${ip}`;
	const attempts = Number(await redis.get(rateKey)) || 0;
	const MAX_ATTEMPTS = 5;
	const RATE_LIMIT_WINDOW = 60; // in seconds

	if (attempts >= MAX_ATTEMPTS) {
		return redirect(303, '/');
	}
	// Increment the attempt count and set expiration if it's the first attempt.
	await redis.incr(rateKey);
	await redis.expire(rateKey, RATE_LIMIT_WINDOW);

	const code = event.url.searchParams.get('code');
	if (!code) throw redirect(303, '/');

	const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			code,
			client_id: GOOGLE_ID,
			client_secret: GOOGLE_SECRET,
			redirect_uri: `${APP_ENDPOINT}/auth/callback/google`,
			grant_type: 'authorization_code'
		})
	});
	const { access_token } = await tokenRes.json();

	if (!access_token) throw redirect(303, '/');

	const userRes = await fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
		headers: { Authorization: `Bearer ${access_token}` }
	});

	if (!userRes.ok) {
		throw redirect(303, '/');
	}

	const user: GoogleUser = await userRes.json();
	const sessionId = crypto.randomBytes(512).toString('hex').normalize();
	const existingUser = await findUserByEmail(user.email);

	if (!existingUser) {
		const newUser = await createUser({
			name: user.name || user.given_name || user.family_name || 'Unknown User',
			email: user.email,
			image: user.picture || undefined,
			emailVerified: new Date()
		});

		if (!newUser) {
			throw redirect(303, '/');
		}

		const newAccount = await createAccount({
			userId: newUser.id,
			provider: 'Google',
			providerId: user.id
		});

		if (!newAccount) {
			throw redirect(303, '/');
		}

		await createSession({ sessionId, id: newUser.id, role: newUser?.role });
		event.cookies.set('session', sessionId, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production',
			expires: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000), // 7 days expiration
			priority: 'high'
		});
		throw redirect(303, `/dashboard`);
	}

	if (!existingUser.image || !existingUser.emailVerified) {
		await updateUser({
			userId: existingUser.id,
			image: user.picture || undefined,
			emailVerified: new Date()
		});
	}

	await createSession({ sessionId, id: existingUser.id, role: existingUser.role });

	event.cookies.set('session', sessionId, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		expires: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000), // 7 days expiration
		priority: 'high'
	});

	// Store user info in session or database as needed
	// Redirect to dashboard or desired page
	throw redirect(303, `/dashboard`);
};
