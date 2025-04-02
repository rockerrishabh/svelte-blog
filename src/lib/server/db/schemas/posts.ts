import { relations } from 'drizzle-orm';
import { pgTable, text, boolean, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';
import { comments } from './comments';

export const posts = pgTable('posts', {
	id: text('id')
		.primaryKey()
		.notNull()
		.$defaultFn(() => crypto.randomUUID()),
	title: text('title').notNull().unique(),
	content: text('content').notNull(),
	image: text('image'),
	published: boolean('published').notNull().default(false),
	authorId: text('author_id').notNull(),
	createdAt: timestamp('createdAt', { mode: 'date' })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: timestamp('updatedAt', { mode: 'date' })
});
export const postsRelations = relations(posts, ({ one, many }) => ({
	author: one(users, {
		fields: [posts.authorId],
		references: [users.id]
	}),
	comments: many(comments)
}));
