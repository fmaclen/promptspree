// HACK: This enum lives in it's own file so it can be imported from the app
// and the tests, shouldn't have any implementation-specific imports because it
// creates conflicts with the paths.

export enum MockPrompt {
	GENERATE_ARTICLE = 'GENERATE_ARTICLE',
	RETRY_ARTICLE = 'RETRY_ARTICLE',
	WRONG_FORMAT = 'WRONG_FORMAT',
	TOO_SHORT = 'TOO_SHORT', // Prompt too short
	THROW_ERROR_429 = 'THROW_ERROR_429', // Rate limit
	THROW_ERROR_500 = 'THROW_ERROR_500' // Server error
}
