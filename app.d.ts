import PocketBase, { BaseAuthStore } from 'pocketbase';

declare global {
	namespace App {
		interface Locals {
			pb: PocketBase;
			user: BaseAuthStore['model'] | undefined;
		}
	}
}

export {};
