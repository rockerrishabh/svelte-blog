import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';

export const providerEnum = pgEnum('provider', ['Github', 'Google', 'Credentials']);

export const accounts = pgTable('accounts', {
	id: text('id')
		.primaryKey()
		.notNull()
		.$defaultFn(() => crypto.randomUUID()),
	provider: providerEnum('provider').notNull().default('Credentials'),
	userId: text('user_id'),
	createdAt: timestamp('createdAt', { mode: 'date' })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: timestamp('updatedAt', { mode: 'date' })
});

export type Account = typeof accounts.$inferSelect;

export const accountsRelations = relations(accounts, ({ one }) => ({
	user: one(users, {
		fields: [accounts.userId],
		references: [users.id]
	})
}));
