import { relations } from 'drizzle-orm';
import { timestamp, pgTable, text, pgEnum, integer } from 'drizzle-orm/pg-core';
import { accounts } from './accounts';
import { posts } from './posts';

export const roleEnum = pgEnum('role', ['Admin', 'Author', 'User']);

export const users = pgTable('users', {
	id: text('id')
		.primaryKey()
		.notNull()
		.$defaultFn(() => crypto.randomUUID()),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: timestamp('emailVerified', { mode: 'date' }),
	image: text('image'),
	role: roleEnum('role').notNull().default('User'),
	salt: text('salt'),
	hashedPassword: text('hashedPassword'),
	age: integer('age'),
	country: text('country'),
	bio: text('bio'),
	createdAt: timestamp('createdAt', { mode: 'date' })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: timestamp('updatedAt', { mode: 'date' })
});

export type User = typeof users.$inferSelect;

export const usersRelations = relations(users, ({ many }) => ({
	posts: many(posts),
	accounts: many(accounts)
}));
