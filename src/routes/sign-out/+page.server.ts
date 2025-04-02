import { redirect } from '@sveltejs/kit';
import { redis } from '$lib/server/db';
import type { Actions } from './$types';

export const actions = {
	default: async (event) => {
		const sessionId = event.cookies.get('session');

		if (sessionId) {
			// Delete the cookie with security options
			await event.cookies.delete('session', {
				path: '/',
				secure: process.env.NODE_ENV === 'production',
				httpOnly: true,
				sameSite: 'lax'
			});
			// Remove the session from Redis
			await redis.del(`session:${sessionId}`);
			// Clear the local user reference
			event.locals.user = undefined;
			event.locals.session = undefined;
			throw redirect(303, `/sign-in`);
		}

		// Throwing redirect ensures SvelteKit handles this as a normal redirect rather than an error
		throw redirect(303, `/sign-in`);
	}
} satisfies Actions;
