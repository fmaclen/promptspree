import type { BaseAuthStore } from 'pocketbase';
import type { Article } from '$lib/article';
import { getImageURL } from '$lib/pocketbase.server';
import type { ArticlePromptShape } from './openai.server';
import { logErrorToSlack } from '$lib/slack.server';

// Creates an `Article` from a database collection so we don't expose the database schema to the client
export const generateArticle = (articleCollection: BaseAuthStore['model']) => {
	if (!articleCollection) return null;

	const article: Article = {
		id: articleCollection.id,
		updated: articleCollection.updated,
		author: articleCollection.expand.user?.nickname,
		headline: articleCollection.headline,
		summary: articleCollection.summary,
		body: articleCollection.body.split('\n'),
		prompt: articleCollection.prompt,
		imageURL: getImageURL(articleCollection)
	};

	return article;
};

// Parses the completion from OpenAI and checks the format of the fields is correct
export const getFieldsFromCompletion = (completion: string | undefined) => {
	if (!completion) return null;

	// Check the AI completion had the correct fields
	let fields: ArticlePromptShape;
	try {
		fields = JSON.parse(completion);
	} catch (err) {
		logErrorToSlack(err);
		return null;
	}
	if (!fields.headline || !fields.summary || !fields.body) return null;

	return {
		headline: fields.headline,
		summary: fields.summary,
		body: fields.body.join('\n')
	};
};
