export const APP_NAME = 'Promptspree';
export const APP_EMAIL = 'support@promptspree.com';

export const isTestEnvironment = process.env.NODE_ENV == 'test';

export enum Sentiment {
	NEUTRAL = 'neutral',
	POSITIVE = 'positive',
	NEGATIVE = 'negative',
	WARNING = 'warning'
}
