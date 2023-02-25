import { env } from '$env/dynamic/private';
import { error, fail } from '@sveltejs/kit';
import { BaseAuthStore, ClientResponseError } from 'pocketbase';

export const pocketbaseUrl = env.TEST_POCKETBASE_URL || env.POCKETBASE_URL;

export const getImageURL = (article: BaseAuthStore['model']) => {
	if (article === null) return undefined;
	if (article?.image.length === 0) return undefined;
	return `${pocketbaseUrl}/api/files/${article.collectionId}/${article.id}/${article.image[0]}`;
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
		if (err.status === 0)
			throw error(500, 'Server is undergoing maintenance, please try again later');

		// Return the field validation errors
		return fail(err.data.code, { ...err.data });
	} else {
		throw error(500);
	}
};
