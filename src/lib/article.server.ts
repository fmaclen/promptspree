import {
	type Article,
	type ArticleReactionByType,
	type ArticleReactions,
	Reaction,
	ArticleStatus
} from '$lib/article';
import { logEventToSlack } from '$lib/slack.server';
import { fail, redirect } from '@sveltejs/kit';
import type { BaseAuthStore, Record } from 'pocketbase';

import type { ArticlePromptShape } from './openai.server';
import { handlePocketbaseError } from './pocketbase.server';

export const generateArticle = async (
	articleCollection: BaseAuthStore['model'],
	locals: App.Locals
): Promise<Article | null> => {
	if (!articleCollection || !articleCollection.expand.user) return null;

	// Get author details from the expanded user collection
	const author = {
		id: articleCollection?.expand.user.id,
		nickname: articleCollection?.expand.user.nickname
	};

	const reactions = await getArticleReactions(articleCollection.id, locals);

	const article: Article = {
		id: articleCollection.id,
		updated: articleCollection.updated,
		author,
		status: articleCollection.status,
		category: articleCollection.category,
		headline: articleCollection.headline,
		body: JSON.parse(articleCollection.body),
		prompt: articleCollection.prompt,
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

	let total = 0;

	// Initialise the array of reaction types with a total of 0 for each
	const byType: ArticleReactionByType[] = Object.entries(Reaction).map((reaction, index) => ({
		index,
		reaction: reaction[1], // e.g. '🤯'
		total: 0
	}));

	try {
		reactionCollection = await locals.pb
			.collection('reactions')
			.getFullList(200, { filter: `article="${articleId}"` });
	} catch (err) {
		logEventToSlack('/article/[slug]/+page.server.ts', err);
		return handlePocketbaseError(err);
	}

	// Count the total number of reactions and the number of reactions by type
	reactionCollection.forEach((item) => {
		const reaction = parseInt(item.reaction);
		byType[reaction].total++;
		total++;
	});

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
		logEventToSlack('/lib/article.server.ts: getFieldsFromCompletion', err);
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

export const deleteArticle = async (
	request: Request,
	locals: App.Locals,
) => {
	const formData = await request.formData();
	const articleId = formData.get('articleId')?.toString();

	if (!locals?.user || !articleId) return fail(400, { error: "Couldn't delete the article" });

	try {
		await locals.pb.collection('articles').delete(articleId);
	} catch (err) {
		logEventToSlack('/lib/article.server.ts (deleteArticle)', err);
		handlePocketbaseError(err);
	}
};

export const publishArticle = async (
	request: Request,
	locals: App.Locals,
) => {
	//
	//
	// FIXME: add a return type `Article | null` and double check every use of `publishArticle()`
	//
	//

	const formData = await request.formData();
	const articleId = formData.get('articleId')?.toString();

	if (!locals?.user || !articleId) return fail(400, { error: "Couldn't publish the article" });

	try {
		//
		//
		//
		//
		// FIXME: this should return `Article`
		return await locals.pb.collection('articles').update(articleId, { status: ArticleStatus.PUBLISHED });
		//
		//
		//
		//
	} catch (err) {
		logEventToSlack('/lib/article.server.ts (deleteArticle)', err);
		handlePocketbaseError(err);
	}
};
