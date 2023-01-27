import PocketBase, { BaseAuthStore, ClientResponseError } from 'pocketbase';
import { env } from '$env/dynamic/private';
import { error, fail } from '@sveltejs/kit';

export const pocketbaseURL = env.POCKETBASE_URL || 'http://127.0.0.1:8090';

export const pb = new PocketBase(pocketbaseURL);

export const serializeNonPOJOs = (model: BaseAuthStore['model']) => {
	return structuredClone(model);
};

export const getImageURL = (article: BaseAuthStore['model']) => {
	if (article === null) return undefined;
	if (article?.image.length === 0) return undefined;
	return `${pocketbaseURL}/api/files/${article.collectionId}/${article.id}/${article.image[0]}`;
};

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
		if (err.status === 0) throw error(500, 'Server is under maintenance, please try again later');

		// Return the field validation errors
		return fail(err.data.code, {
			errors: {
				...err.data.data
			}
		});
	} else {
		throw error(500);
	}
};
