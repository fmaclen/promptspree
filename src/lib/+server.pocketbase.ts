import PocketBase from 'pocketbase';
import { env } from '$env/dynamic/private';

const pocketbaseUrl = env.POCKETBASE_URL || 'http://127.0.0.1:8090';

export const pb = new PocketBase(pocketbaseUrl);

export const serializeNonPOJOs = (obj: any) => {
	return structuredClone(obj);
};
