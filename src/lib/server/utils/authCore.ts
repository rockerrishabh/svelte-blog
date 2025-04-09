import { eq, type Placeholder, type SQL } from 'drizzle-orm';
import { z } from 'zod';
import crypto from 'node:crypto';
import { db, redis } from '$lib/server/db';
import { accounts } from '$lib/server/db/schemas/accounts';
import { users } from '$lib/server/db/schemas/users';

const sessionSchema = z.object({
	id: z.string(),
	role: z.string()
});

export type SessionSchema = z.infer<typeof sessionSchema>;

export const hashPassword = ({ password, salt }: { password: string; salt: string }): string => {
	const hashedPassword = crypto
		.pbkdf2Sync(password.normalize(), salt, 1000, 64, 'sha512')
		.toString('hex')
		.normalize();

	return hashedPassword;
};

export const verifyPassword = ({
	plainPassword,
	userSalt,
	userPassword
}: {
	plainPassword: string;
	userSalt: string;
	userPassword: string;
}) => {
	const hashedPassword = crypto
		.pbkdf2Sync(plainPassword.normalize(), userSalt, 1000, 64, `sha512`)
		.toString(`hex`)
		.normalize();

	// Use constant-time comparison to prevent timing attacks.
	const hashBuffer = Buffer.from(hashedPassword, 'hex');
	const storedBuffer = Buffer.from(userPassword, 'hex');

	return {
		isValid:
			hashBuffer.length === storedBuffer.length && crypto.timingSafeEqual(hashBuffer, storedBuffer)
	};
};

export const createSession = async ({
	sessionId,
	id,
	role
}: {
	sessionId: string;
	id: string;
	role: string;
}) => {
	return await redis.set(
		`session:${sessionId}`,
		{ id, role },
		{
			ex: 60 * 60 * 24 * 7 // 7 days
		}
	);
};

export const createAccount = async ({
	providerId,
	userId,
	provider
}: {
	providerId?: string;
	userId: string;
	provider?:
		| SQL<unknown>
		| 'Github'
		| 'Google'
		| 'Credentials'
		| Placeholder<string, unknown>
		| undefined;
}) => {
	const [newAccount] = await db
		.insert(accounts)
		.values({
			id: providerId,
			provider,
			userId
		})
		.returning();

	return newAccount;
};

export const getSession = async ({ sessionCookie }: { sessionCookie: string | undefined }) => {
	if (!sessionCookie) return null;
	try {
		const rawSessionData = await redis.get(`session:${sessionCookie}`);
		if (rawSessionData) {
			return sessionSchema.parse(rawSessionData);
		} else {
			await redis.del(`session:${sessionCookie}`);
			return null;
		}
	} catch (error) {
		console.error('Error parsing session data:', error);
		await redis.del(`session:${sessionCookie}`);
		return null;
	}
};

export const getUserBySession = async ({ sessionData }: { sessionData: SessionSchema | null }) => {
	if (!sessionData) return null;
	const user = await db.query.users.findFirst({
		where: eq(users.id, sessionData.id)
	});

	if (!user) return null;

	return {
		name: user.name,
		email: user.email,
		image: user.image,
		age: user.age,
		country: user.country,
		bio: user.bio
	};
};
