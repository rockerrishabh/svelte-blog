import { db } from '$lib/server/db';
import { posts } from '$lib/server/db/schemas/posts';
import type { Actions, PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	// If the user is not logged in, redirect to the sign-in page.
	if (!locals.user || !locals.session) {
		throw redirect(303, '/sign-in');
	}

	// Return the user object to the page.
	return { user: locals.user, session: locals.session };
};

export const actions = {
	default: async ({ request, locals }) => {
		const data = await request.formData();

		const title = String(data.get('title'));
		const content = String(data.get('content'));

		if (!title || !content) {
			return { success: false };
		}

		const [newPost] = await db
			.insert(posts)
			.values({
				title,
				content,
				authorId: locals.session?.id
			})
			.returning();

		if (!newPost) {
			return { success: false };
		}

		return { success: true };
	}
} satisfies Actions;
