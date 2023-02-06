import {
	type Article,
	type ArticleAuthor,
	type ArticleReactionByType,
	type ArticleReactions,
	Reaction
} from '$lib/article';
import { logEventToSlack } from '$lib/slack.server';
import type { BaseAuthStore, Record } from 'pocketbase';

import type { ArticlePromptShape } from './openai.server';
import { handlePocketbaseError } from './pocketbase.server';

export const generateArticle = async (
	articleCollection: BaseAuthStore['model'],
	author: ArticleAuthor,
	locals: App.Locals
): Promise<Article | null> => {
	if (!articleCollection) return null;

	const reactions = await getArticleReactions(articleCollection.id, locals);

	const article: Article = {
		id: articleCollection.id,
		updated: articleCollection.updated,
		author,
		prompt: articleCollection.prompt,
		headline: articleCollection.headline,
		category: articleCollection.category,
		body: JSON.parse(articleCollection.body),
		reactions
	};

	return article;
};

// Calculates the sum of all reactions in an article by reaction type
const getArticleReactions = async (
	articleId: string,
	locals: App.Locals
): Promise<ArticleReactions> => {
	let reactionCollection: Record[];

	try {
		reactionCollection = await locals.pb
			.collection('reactions')
			.getFullList(200, { filter: `article="${articleId}"` });
	} catch (err) {
		logEventToSlack('/article/[slug]/+page.server.ts', err);
		return handlePocketbaseError(err);
	}

	let total = 0;

	// Initialise the array of reaction types with a total of 0 for each
	const byType: ArticleReactionByType[] = Object.entries(Reaction).map((reaction, index) => ({
		index,
		reaction: reaction[1], // e.g. '🤯'
		total: 0
	}));

	// Count the total number of reactions and the number of reactions by type
	reactionCollection.forEach((item) => {
		const reaction = parseInt(item.reaction);
		byType[reaction].total++;
		total++;
	});

	// Sort the reactions by type by the total number of reactions
	byType.sort((a, b) => b.total - a.total);

	// Find if the current user has reacted to this article
	const currentUserReaction = reactionCollection.find((item) => item.user === locals?.user?.id);
	const byCurrentUser = currentUserReaction ? parseInt(currentUserReaction.reaction) : undefined;

	return { total, byType, byCurrentUser };
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
