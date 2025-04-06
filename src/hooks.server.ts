import type { Handle } from '@sveltejs/kit';
import crypto from 'crypto';
import { getSession, getUserBySession } from '$lib/server/utils/authCore'; // Adjust path as needed
import type { User } from '$lib/server/db/schemas/users';

export type ShortUser = Pick<User, 'name' | 'email' | 'image' | 'age' | 'country' | 'bio'>;

export const handle: Handle = async ({ event, resolve }) => {
	const sessionCookie = event.cookies.get('session');
	let csrfToken = event.cookies.get('csrf_token');

	// Generate a new CSRF token if not present
	if (!csrfToken) {
		csrfToken = crypto.randomBytes(32).toString('hex');
		event.cookies.set('csrf_token', csrfToken, {
			path: '/',
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict'
		});
	}

	// Get session and user
	const sessionData = await getSession({ sessionCookie });
	const user = await getUserBySession({ sessionData });

	if (user) {
		event.locals.session = sessionData;
		event.locals.user = user as ShortUser;
	} else {
		event.locals.session = undefined;
		await event.cookies.delete('session', {
			path: '/',
			secure: process.env.NODE_ENV === 'production',
			httpOnly: true,
			sameSite: 'lax'
		});
	}

	// Inject CSRF token into the response headers
	const response = await resolve(event);
	response.headers.set('x-csrf-token', csrfToken);
	return response;
};
