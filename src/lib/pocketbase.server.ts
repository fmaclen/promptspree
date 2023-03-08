import { env } from '$env/dynamic/private';
import { UNKNOWN_ERROR_MESSAGE, isTestEnvironment } from '$lib/utils';
import { error, fail } from '@sveltejs/kit';
import jsonminify from 'jsonminify';
import { type BaseAuthStore, ClientResponseError } from 'pocketbase';

export const pocketbaseUrl = isTestEnvironment ? env.TEST_POCKETBASE_URL : env.POCKETBASE_URL;

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

export const getAudioSrc = (article: BaseAuthStore['model']): string | undefined => {
	if (article === null) return undefined;
	if (article?.audio.length === 0) return undefined;

	const pocketbaseCdnUrl = isTestEnvironment ? env.TEST_POCKETBASE_CDN_URL : env.POCKETBASE_CDN_URL;
	return `${pocketbaseCdnUrl}/${article.collectionId}/${article.id}/${article.audio}`;
};

// Converts object to string and minifies it
export const miniStringify = (obj: object): string => {
	const jsonString = JSON.stringify(obj);
	return jsonminify(jsonString);
};
