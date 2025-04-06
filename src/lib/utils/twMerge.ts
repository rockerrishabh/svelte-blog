import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const ssr = false;

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
