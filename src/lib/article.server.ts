import type { Article } from '$lib/article';
import { getImageURL } from '$lib/pocketbase.server';
import { logEventToSlack } from '$lib/slack.server';
import type { BaseAuthStore } from 'pocketbase';

import type { ArticlePromptShape } from './openai.server';

// Creates an `Article` from a database collection so we don't expose the database schema to the client
export const generateArticle = (articleCollection: BaseAuthStore['model']) => {
	if (!articleCollection) return null;

	const article: Article = {
		id: articleCollection.id,
		updated: articleCollection.updated,
		author: articleCollection.expand.user?.nickname,
		headline: articleCollection.headline,
		keywords: JSON.parse(articleCollection.keywords),
		body: JSON.parse(articleCollection.body),
		prompt: articleCollection.prompt,
		imageURL: getImageURL(articleCollection),
		reactions: null,
		userReaction: null
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
		logEventToSlack('article.server.ts: getFieldsFromCompletion', err);
		return null;
	}
	if (!fields.headline || !fields.keywords || !fields.body) return null;

	return {
		headline: fields.headline,
		// We store these values as string arrays in the database
		keywords: JSON.stringify(fields.keywords),
		body: JSON.stringify(fields.body)
	};
};
