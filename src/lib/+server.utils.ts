import PocketBase from 'pocketbase';

export const pb = new PocketBase('http://127.0.0.1:8090');

export const serializeNonPOJOs = (obj: any) => {
	return structuredClone(obj);
};

export const getImageURL = (collectionId: string, recordId: string, fileName: string) => {
	return `http://localhost:8090/api/files/${collectionId}/${recordId}/${fileName}`;
};
