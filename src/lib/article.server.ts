import {
	type Article,
	type ArticleReactionByType,
	type ArticleReactions,
	ArticleStatus,
	Reaction
} from '$lib/article';
import { logEventToSlack } from '$lib/slack.server';
import { fail } from '@sveltejs/kit';
import type { BaseAuthStore, Record } from 'pocketbase';

import { CURRENT_MODEL } from './openai.server';
import { getAudioSrc, handlePocketbaseError } from './pocketbase.server';

export async function createArticleCollection(
	pb: App.Locals['pb'],
	formData: FormData
): Promise<BaseAuthStore['model']> {
	try {
		return await pb.collection('articles').create(formData);
	} catch (err) {
		logEventToSlack('/lib/+article.server.ts (createArticleCollection)', err);
		handlePocketbaseError(err);
	}
	return null;
}

export async function updateArticleCollection(
	pb: App.Locals['pb'],
	articleId: string,
	bodyParams: object
): Promise<BaseAuthStore['model']> {
	try {
		return await pb.collection('articles').update(articleId, bodyParams, { expand: 'user' });
	} catch (err) {
		logEventToSlack('/lib/+article.server.ts (updateArticleCollection)', err);
		handlePocketbaseError(err);
	}
	return null;
}

export const generateArticles = async (
	articlesCollection: BaseAuthStore['model'][],
	locals: App.Locals
): Promise<Article[]> => {
	const articles: Article[] = [];

	for (const articleCollection of articlesCollection) {
		const generatedArticle = await generateArticle(articleCollection, locals);
		if (generatedArticle) articles.push(generatedArticle);
	}

	return articles;
};

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

	const audioSrc = getAudioSrc(articleCollection);
	const reactions = await getArticleReactions(articleCollection.id, locals);

	const article: Article = {
		id: articleCollection.id,
		updated: articleCollection.updated,
		status: articleCollection.status,
		category: articleCollection.category,
		headline: articleCollection.headline,
		body: JSON.parse(articleCollection.body),
		messages: articleCollection.messages,
		model: CURRENT_MODEL,
		author,
		audioSrc,
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

export const deleteArticle = async (request: Request, locals: App.Locals) => {
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
	locals: App.Locals
): Promise<Article | null> => {
	const formData = await request.formData();
	const articleId = formData.get('articleId')?.toString();

	if (!locals?.user || !articleId) return null;

	let articleCollection: BaseAuthStore['model'] = null;

	try {
		articleCollection = await locals.pb
			.collection('articles')
			.update(articleId, { status: ArticleStatus.PUBLISHED }, { expand: 'user' });
	} catch (err) {
		logEventToSlack('/lib/article.server.ts (publishArticle)', err);
		handlePocketbaseError(err);
	}

	if (!articleCollection) null;

	return await generateArticle(articleCollection, locals);
};
