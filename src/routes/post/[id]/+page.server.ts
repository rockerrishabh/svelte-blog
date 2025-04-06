import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { posts } from '$lib/server/db/schemas/posts';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
	const post = await db.query.posts.findFirst({ where: eq(posts.id, params.id) });

	if (post) {
		return { post };
	}

	error(404, 'Not found');
};
