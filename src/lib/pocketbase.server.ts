import { env } from '$env/dynamic/private';
import type { ArticleCollection } from '$lib/pocketbase.schema';
import { UNKNOWN_ERROR_MESSAGE, isTestEnvironment } from '$lib/utils';
import { error, fail } from '@sveltejs/kit';
import Pocketbase, { ClientResponseError } from 'pocketbase';

export const pocketbaseUrl = isTestEnvironment ? env.TEST_POCKETBASE_URL : env.POCKETBASE_URL;

export async function pbAdmin(): Promise<Pocketbase> {
	const adminEmail = isTestEnvironment
		? env.TEST_POCKETBASE_ADMIN_EMAIL
		: env.POCKETBASE_ADMIN_EMAIL;

	const adminPassword = isTestEnvironment
		? env.TEST_POCKETBASE_ADMIN_PASSWORD
		: env.POCKETBASE_ADMIN_PASSWORD;

	if (!adminEmail || !adminPassword) throw new Error('Missing Pocketbase admin credentials');

	const pb = new Pocketbase(pocketbaseUrl);
	await pb.admins.authWithPassword(adminEmail, adminPassword);
	return pb;
}

export const handlePocketbaseError = (err: unknown) => {
	const clientError = err as ClientResponseError;
	throw error(
		clientError.data.code || 500,
		JSON.stringify(clientError.data.data) || 'Unknown error'
	);
};

export const handlePocketbaseErrors = (err: unknown) => {
	// Check if the error is a Pocketbase error
	if (typeof err === 'object' && err !== null && err instanceof ClientResponseError) {
		// Check if the Pocketbase server is online
		if (err.status === 0) throw error(500, UNKNOWN_ERROR_MESSAGE);

		// Return the field validation errors
		return fail(err.data.code, { ...err.data });
	} else {
		throw error(500, UNKNOWN_ERROR_MESSAGE);
	}
};

export const getFileSrc = (
	collection: ArticleCollection,
	fileType: 'audio' | 'image'
): string | undefined => {
	if (collection === null) return undefined;
	if (collection[fileType]?.length === 0) return undefined;

	const pocketbaseCdnUrl = isTestEnvironment ? env.TEST_POCKETBASE_CDN_URL : env.POCKETBASE_CDN_URL;
	return `${pocketbaseCdnUrl}/${collection.collectionId}/${collection.id}/${collection[fileType]}`;
};
