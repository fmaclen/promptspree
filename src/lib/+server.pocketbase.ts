import PocketBase from 'pocketbase';
import { env } from '$env/dynamic/private';

export const pocketbaseURL = env.POCKETBASE_URL || 'http://127.0.0.1:8090';

export const pb = new PocketBase(pocketbaseURL);

export const serializeNonPOJOs = (obj: any) => {
	return structuredClone(obj);
};
