import { type Article, ArticleStatus } from '$lib/article';
import { getMessages } from '$lib/message';
import { CURRENT_MODEL } from '$lib/openai.server';
import type { ArticleCollection } from '$lib/pocketbase.schema';
import { getAudioSrc, handlePocketbaseError, pbClient } from '$lib/pocketbase.server';
import { getReactions } from '$lib/reaction';
import { logEventToSlack } from '$lib/slack.server';
import { getUser } from '$lib/user';
import { fail } from '@sveltejs/kit';
import type { BaseAuthStore, Record } from 'pocketbase';

export async function getArticle(
	articleId?: string,
	currentUserId?: string
): Promise<Article | null> {
	if (!articleId) return null;

	let collection: ArticleCollection | null = null;

	try {
		const pb = await pbClient();
		collection = await pb.collection('articles').getOne(articleId, {
			expand: 'messages(article),reactions(article),user'
		});
	} catch (error) {
		return null;
	}

	if (!collection) return null;

	const isCreatedByCurrentUser = currentUserId === collection.expand?.['user']?.id;
	if (collection.status === ArticleStatus.DRAFT && !isCreatedByCurrentUser) return null;

	return {
		id: collection.id,
		created: collection.created.toString(),
		updated: collection.updated.toString(),
		headline: collection.headline,
		status: collection.status,
		body: collection.body,
		category: collection.category,
		model: collection.model,
		audioSrc: collection.audio?.[0],
		imageSrc: collection.image?.[0],
		user: getUser(collection.expand['user']),
		messages: getMessages(collection.expand?.['messages(article)']),
		reactions: getReactions(collection.expand?.['reactions(article)'], currentUserId),
		isCreatedByCurrentUser
	};
}

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
