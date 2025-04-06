import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schemas/users';

export const findUserByEmail = async (email: string) => {
	return await db.query.users.findFirst({
		where: eq(users.email, email)
	});
};

export const createUser = async ({
	name,
	email,
	image,
	salt,
	hashedPassword,
	emailVerified
}: {
	name: string;
	email: string;
	image?: string;
	salt?: string;
	hashedPassword?: string;
	emailVerified?: Date;
}) => {
	const [newUser] = await db
		.insert(users)
		.values({
			name,
			email,
			image,
			salt,
			hashedPassword,
			emailVerified
		})
		.returning();

	return newUser;
};

export const updateUser = async ({
	userId,
	name,
	image,
	emailVerified
}: {
	userId: string;
	name?: string;
	image?: string;
	emailVerified?: Date;
	age?: number;
	country?: string;
	bio?: string;
}) => {
	const updatedUser = await db
		.update(users)
		.set({ name, image, emailVerified, updatedAt: new Date() })
		.where(eq(users.id, userId));

	return updatedUser;
};
