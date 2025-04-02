// See https://svelte.dev/docs/kit/types#app.d.ts

import type { SessionSchema, ShortUser } from './hooks.server';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: ShortUser;
			session?: SessionSchema;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
