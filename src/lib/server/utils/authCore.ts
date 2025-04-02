import { message, type SuperValidated } from 'sveltekit-superforms';
import { redirect } from '@sveltejs/kit';
import { eq, type Placeholder, type SQL } from 'drizzle-orm';
import { z } from 'zod';
import crypto from 'crypto';
import { db, redis } from '$lib/server/db';
import { accounts } from '$lib/server/db/schemas/accounts';
import { users } from '$lib/server/db/schemas/users';

const sessionSchema = z.object({
	id: z.string(),
	role: z.string()
});

export type SessionSchema = z.infer<typeof sessionSchema>;

type Form = SuperValidated<
	{
		name?: string;
		email: string;
		password: string;
		confirmPassword?: string;
	},
	string,
	{
		name?: string;
		email: string;
		password: string;
		confirmPassword?: string;
	}
>;

export const rateLimit = async ({ ip, form }: { ip: string; form?: Form }) => {
	// Rate limiting: check the number of recent login attempts from the IP address.
	const rateKey = `login_attempts:${ip}`;
	const attempts = Number(await redis.get(rateKey)) || 0;
	const MAX_ATTEMPTS = 5;
	const RATE_LIMIT_WINDOW = 60; // in seconds

	if (attempts >= MAX_ATTEMPTS) {
		if (form) {
			return message(form, 'Too many login attempts. Please try again later.', { status: 429 });
		} else {
			return redirect(303, '/');
		}
	}
	// Increment the attempt count and set expiration if it's the first attempt.
	await redis.incr(rateKey);
	await redis.expire(rateKey, RATE_LIMIT_WINDOW);
};

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
	userPassword,
	form
}: {
	plainPassword: string;
	userSalt: string;
	userPassword: string;
	form: Form;
}) => {
	const hashedPassword = crypto
		.pbkdf2Sync(plainPassword.normalize(), userSalt, 1000, 64, `sha512`)
		.toString(`hex`)
		.normalize();

	// Use constant-time comparison to prevent timing attacks.
	const hashBuffer = Buffer.from(hashedPassword, 'hex');
	const storedBuffer = Buffer.from(userPassword, 'hex');

	if (
		hashBuffer.length !== storedBuffer.length ||
		!crypto.timingSafeEqual(hashBuffer, storedBuffer)
	) {
		return message(form, 'Invalid credentials', { status: 400 });
	}
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
	await redis.set(
		`session:${sessionId}`,
		{ id, role },
		{
			ex: 60 * 60 * 24 * 7 // 7 days
		}
	);
};

export const createAccount = async ({
	provider,
	providerId,
	userId
}: {
	provider:
		| SQL<unknown>
		| 'Github'
		| 'Google'
		| 'Credentials'
		| Placeholder<string, unknown>
		| undefined;
	providerId: string;
	userId: string;
}) => {
	const [newAccount] = await db
		.insert(accounts)
		.values({
			provider,
			id: providerId,
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
		image: user.image
	};
};
