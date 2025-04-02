import { drizzle } from 'drizzle-orm/neon-http';
import { Redis } from '@upstash/redis';
import { env } from '$env/dynamic/private';
import * as userSchema from './schemas/users';
import * as postSchema from './schemas/posts';
import * as accountsSchema from './schemas/accounts';
import * as commentsSchema from './schemas/comments';

if (!env.REDIS_ENDPOINT || !env.REDIS_TOKEN) throw new Error('Redis client is not set');

export const redis = new Redis({
	url: env.REDIS_ENDPOINT,
	token: env.REDIS_TOKEN
});

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

export const db = drizzle(env.DATABASE_URL, {
	schema: {
		...userSchema,
		...postSchema,
		...accountsSchema,
		...commentsSchema
	}
});
