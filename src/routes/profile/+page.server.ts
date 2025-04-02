import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	// If the user is not logged in, redirect to the sign-in page.
	if (!locals.user || !locals.session) {
		throw redirect(303, '/sign-in');
	}

	// Return the user object to the page.
	return { user: locals.user, session: locals.session };
};
