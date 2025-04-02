import { z } from 'zod';

const passwordSchema = z
	.string()
	.min(8, { message: 'Password must be at least 8 characters long' })
	.max(20, { message: 'Password must not exceed 20 characters' });
// .regex(/[A-Z]/, { message: 'Password must include at least one uppercase letter' })
// .regex(/[a-z]/, { message: 'Password must include at least one lowercase letter' })
// .regex(/[0-9]/, { message: 'Password must include at least one number' })
// .regex(/[!@#$%^&*]/, {
// 	message: 'Password must include at least one special character (!@#$%^&*)'
// });

export const SignInSchema = z.object({
	email: z
		.string()
		.min(1, { message: 'Email is required' })
		.email({ message: 'Invalid email format' }),
	password: passwordSchema
});
