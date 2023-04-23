import { type Article, ArticleStatus, EXPAND_RECORD_RELATIONS } from '$lib/articles';
import { getMessages } from '$lib/messages';
import { CURRENT_MODEL } from '$lib/openai';
import type { ArticleCollection } from '$lib/pocketbase.schema';
import { getFileSrc } from '$lib/pocketbase.server';
import { calculateReactionsFromCollection } from '$lib/reactions';
import { getUser } from '$lib/users';
import { UNKNOWN_ERROR_MESSAGE } from '$lib/utils';
import { type HttpError, error } from '@sveltejs/kit';
import type { BaseModel, ListResult } from 'pocketbase';

export async function getArticle(locals: App.Locals, articleId?: string): Promise<Article | null> {
	if (!articleId) return null;

	try {
		const collection: ArticleCollection = await locals.pbAdmin
			.collection('articles')
			.getOne(articleId, {
				expand: EXPAND_RECORD_RELATIONS
			});

		const article = generateArticleFromCollection(collection, locals.user?.id);

		// Don't return a DRAFT article if the user is not the author
		if (collection.status === ArticleStatus.DRAFT && !article?.isCreatedByCurrentUser) return null;

		return article;
	} catch (_) {
		return null;
	}
}

export async function getArticles(locals: App.Locals, filter: string): Promise<Article[]> {
	try {
		const listCollection = await locals.pbAdmin.collection('articles').getList(1, 30, {
			sort: '-updated',
			filter: filter,
			expand: EXPAND_RECORD_RELATIONS
		});
		
		// NOTE:
		// We need an ArticleCollection[] to generate the articles but `listCollection.items`
		// has a type Record[]. I can't remember how I set it up initially but 
		// `getFullList()` does return the correct type and `getList()` doesn't.
		const collection: ArticleCollection[] = listCollection.items;

		return generateArticlesFromCollection(collection, locals.user?.id);
	} catch (_) {
		return [];
	}
}

export async function createArticleCollection(
	locals: App.Locals,
	status: ArticleStatus
): Promise<ArticleCollection | null> {
	try {
		return await locals.pbAdmin.collection('articles').create(
			{
				user: locals.user?.id,
				model: CURRENT_MODEL,
				status
			},
			{ expand: 'user' }
		);
	} catch (_) {
		return null;
	}
}

export async function getArticlesList(
	locals: App.Locals,
	filter?: string
): Promise<ListResult<BaseModel> | null> {
	try {
		return await locals.pbAdmin.collection('articles').getList(1, 1, { filter });
	} catch (_) {
		return null;
	}
}

export async function updateArticleCollection(
	locals: App.Locals,
	articleId: string,
	articleCollection: ArticleCollection
): Promise<Article | null> {
	await authorizeCurrentUser(locals, articleId);

	try {
		const collection: ArticleCollection = await locals.pbAdmin.collection('articles').update(
			articleId,
			{ ...articleCollection },
			{
				expand: EXPAND_RECORD_RELATIONS
			}
		);
		return generateArticleFromCollection(collection, locals.user?.id);
	} catch (_) {
		return null;
	}
}

export async function publishArticle(
	locals: App.Locals,
	articleId: string
): Promise<void | HttpError> {
	await updateArticleCollection(locals, articleId, { status: ArticleStatus.PUBLISHED });
}

export async function deleteArticle(
	locals: App.Locals,
	articleId: string
): Promise<void | HttpError> {
	await authorizeCurrentUser(locals, articleId);

	try {
		articleId && (await locals.pbAdmin.collection('articles').delete(articleId));
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
export async function authorizeCurrentUser(locals: App.Locals, articleId?: string): Promise<void> {
	let articleCollection: ArticleCollection | null = null;
	if (articleId) {
		articleCollection = await locals.pbAdmin.collection('articles').getOne(articleId, {
			expand: 'user'
		});
	}

	if (articleCollection?.expand?.user.id !== locals.user?.id) throw error(401, 'Unauthorized');
}
