import jsonminify from 'jsonminify';

export const APP_NAME = 'Promptspree';
export const APP_EMAIL = 'support@promptspree.com';

export const isTestEnvironment = process.env.NODE_ENV == 'test';

export enum Sentiment {
	NEUTRAL = 'neutral',
	POSITIVE = 'positive',
	NEGATIVE = 'negative',
	WARNING = 'warning'
}

export const UNKNOWN_ERROR_MESSAGE = 'An error occurred on our end, please try again later';

// Converts object to string and minifies it
export const miniStringify = (obj: object | string): string => {
	const jsonString = JSON.stringify(obj);
	return jsonminify(jsonString);
};
