import PocketBase from 'pocketbase';
import type { UserCollection } from '$/lib/pocketbase.schema';

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
