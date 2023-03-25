import type { UserCollection } from '$/lib/pocketbase.schema';
import PocketBase from 'pocketbase';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			pb: PocketBase;
			pbAdmin: PocketBase;
			user: UserCollection;
		} // interface PageData {}
		// interface Platform {}
	}
}

export {};
