import { type Article, ArticleStatus } from '$lib/articles';
import { getMessages } from '$lib/messages';
import { CURRENT_MODEL } from '$lib/openai';
import type { ArticleCollection } from '$lib/pocketbase.schema';
import { getFileSrc, pbAdmin } from '$lib/pocketbase.server';
import { calculateReactionsFromCollection } from '$lib/reactions';
import { getUser } from '$lib/users';
import { type HttpError, error } from '@sveltejs/kit';
import type { BaseModel, ListResult } from 'pocketbase';

import { UNKNOWN_ERROR_MESSAGE } from './utils';

const EXPAND_RECORD_RELATIONS = 'messages(article),reactions(article),user';

export async function getArticle(
	articleId?: string,
	currentUserId?: string
): Promise<Article | null> {
	if (!articleId) return null;

	try {
		const pb = await pbAdmin();
		const collection: ArticleCollection = await pb.collection('articles').getOne(articleId, {
			expand: EXPAND_RECORD_RELATIONS
		});

		const article = generateArticleFromCollection(collection, currentUserId);

		// Don't return a DRAFT article if the user is not the author
		if (collection.status === ArticleStatus.DRAFT && !article?.isCreatedByCurrentUser) return null;

		return article;
	} catch (_) {
		return null;
	}
}

export async function getArticles(filter: string, currentUserId?: string): Promise<Article[]> {
	try {
		const pb = await pbAdmin();
		const collection: ArticleCollection[] = await pb.collection('articles').getFullList(undefined, {
			sort: '-updated',
			filter: filter,
			expand: EXPAND_RECORD_RELATIONS
		});
		return generateArticlesFromCollection(collection, currentUserId);
	} catch (_) {
		return [];
	}
}

export async function createArticleCollection(
	currentUserId: string,
	status: ArticleStatus
): Promise<ArticleCollection | null> {
	try {
		const pb = await pbAdmin();
		return await pb.collection('articles').create(
			{
				user: currentUserId,
				model: CURRENT_MODEL,
				status
			},
			{ expand: 'user' }
		);
	} catch (_) {
		return null;
	}
}

export async function getArticlesList(filter?: string): Promise<ListResult<BaseModel> | null> {
	try {
		const pb = await pbAdmin();
		return await pb.collection('articles').getList(1, 1, { filter });
	} catch (_) {
		return null;
	}
}

export async function updateArticleCollection(
	articleId: string,
	currentUserId: string,
	articleCollection: ArticleCollection
): Promise<Article | null> {
	await authorizeCurrentUser(articleId, currentUserId);

	try {
		const pb = await pbAdmin();
		const collection: ArticleCollection = await pb.collection('articles').update(
			articleId,
			{ ...articleCollection },
			{
				expand: EXPAND_RECORD_RELATIONS
			}
		);
		return generateArticleFromCollection(collection, currentUserId);
	} catch (_) {
		return null;
	}
}

export async function publishArticle(
	articleId: string,
	currentUserId: string
): Promise<void | HttpError> {
	await updateArticleCollection(articleId, currentUserId, { status: ArticleStatus.PUBLISHED });
}

export async function deleteArticle(
	articleId: string,
	currentUserId: string
): Promise<void | HttpError> {
	await authorizeCurrentUser(articleId, currentUserId);
	try {
		const pb = await pbAdmin();
		articleId && (await pb.collection('articles').delete(articleId));
	} catch (_) {
		throw error(500, UNKNOWN_ERROR_MESSAGE);
	}
}

export function generateArticleFromCollection(
	collection?: ArticleCollection,
	currentUserId?: string
): Article | null {
	// `Article` required fields
	if (
		!collection?.id ||
		!collection?.created ||
		!collection?.updated ||
		!collection?.created ||
		!collection?.updated ||
		!collection?.headline ||
		!collection?.status ||
		!collection?.body ||
		!collection?.category ||
		!collection?.model ||
		!collection?.expand?.user
	)
		return null;

	const userCollection = collection.expand['user'];

	const article: Article = {
		id: collection.id,
		created: collection.created.toString(),
		updated: collection.updated.toString(),
		headline: collection.headline,
		status: collection.status,
		body: collection.body,
		category: collection.category,
		model: collection.model,
		user: getUser(userCollection),
		audioSrc: getFileSrc(collection, 'audio'),
		imageSrc: getFileSrc(collection, 'image'),
		messages: getMessages(collection.expand?.['messages(article)']),
		reactions: calculateReactionsFromCollection(
			collection.expand?.['reactions(article)'],
			currentUserId
		),
		isCreatedByCurrentUser: currentUserId === userCollection?.id
	};

	return article;
}

export function generateArticlesFromCollection(
	collections: ArticleCollection[],
	currentUserId?: string
): Article[] {
	const articles: Article[] = [];

	for (const collection of collections) {
		const generatedArticle = generateArticleFromCollection(collection, currentUserId);
		if (generatedArticle) articles.push(generatedArticle);
	}

	return articles;
}

// Check if the user is the creator of the article before allowing them to edit it
export async function authorizeCurrentUser(
	articleId?: string,
	currentUserId?: string
): Promise<void> {
	let articleCollection: ArticleCollection | null = null;
	if (articleId) {
		const pb = await pbAdmin();
		articleCollection = await pb.collection('articles').getOne(articleId, {
			expand: 'user'
		});
	}

	if (articleCollection?.expand?.user.id !== currentUserId) throw error(401, 'Unauthorized');
}
