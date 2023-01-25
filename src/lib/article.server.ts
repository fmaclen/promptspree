import type { BaseAuthStore } from 'pocketbase';
import type { Article } from '$lib/article';
import { getImageURL } from '$lib/pocketbase.server';

// Creates an `Article` from a database collection so we don't expose the database schema to the client
export const generateArticle = (articleCollection: BaseAuthStore['model']) => {
	if (!articleCollection) return null;

	const article: Article = {
		id: articleCollection.id,
		updated: articleCollection.updated,
		author: articleCollection.expand.user.nickname,
		headline: articleCollection.headline,
		summary: articleCollection.summary,
		body: articleCollection.body.split('\n'),
		prompt: articleCollection.prompt,
		imageURL: getImageURL(articleCollection)
	};

	return article;
};

export const getFieldsFromCompletion = (completion: string | undefined) => {
	if (!completion) return null;

	// Check the AI completion had the correct fields
	const fields = JSON.parse(completion);
	if (!fields.headline || !fields.summary || !fields.body) return null;

	return {
		headline: fields.headline,
		summary: fields.summary,
		body: fields.body.join('\n')
	};
};
