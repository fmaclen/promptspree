import type { Article,Article2 } from '$lib/article';
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
		prompt: articleCollection.prompt,
		headline: articleCollection.headline,
		category: articleCollection.category,
		body: JSON.parse(articleCollection.body),
		imageURL: getImageURL(articleCollection),
		reactions: null,
		userReaction: null
	};

	return article;
};

export const generateArticle2 = (articleCollection: BaseAuthStore['model']) => {
	if (!articleCollection) return null;

	const article: Article2 = {
		id: articleCollection.id,
		updated: articleCollection.updated,
		user: {
			id: articleCollection.expand.user?.id,
			nickname: articleCollection.expand.user?.nickname
		},
		prompt: articleCollection.prompt,
		headline: articleCollection.headline,
		category: articleCollection.category,
		body: JSON.parse(articleCollection.body),
		reactions: {
			total: 0,
		},
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
	if (!fields.headline || !fields.category || !fields.body) return null;

	return {
		headline: fields.headline,
		// FIXME: Should check that the AI picked a valid `ArticleCategory` in `getCompletionFromAI`
		category: fields.category, 
		// We store the paragraphs in the body as string arrays
		body: JSON.stringify(fields.body) 
	};
};
