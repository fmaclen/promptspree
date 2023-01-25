import PocketBase, { BaseAuthStore, ClientResponseError } from 'pocketbase';
import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';

export const pocketbaseURL = env.POCKETBASE_URL || 'http://127.0.0.1:8090';

export const pb = new PocketBase(pocketbaseURL);

export const serializeNonPOJOs = (model: BaseAuthStore['model']) => {
	return structuredClone(model);
};

export const getImageURL = (article: BaseAuthStore['model']) => {
	if (article?.type !== 'Record') return undefined;
	if (article?.image.length === 0) return undefined;
	return `${pocketbaseURL}/api/files/${article.collectionId}/${article.id}/${article.image[0]}`;
};

export const handlePocketbaseError = (err: unknown) => {
	const clientError = err as ClientResponseError;
	throw error(clientError.data.code || 500, clientError.data.data || 'Unknown error');
};
