import { type Article, ArticleStatus } from '$lib/articles';
import { getMessages } from '$lib/messages';
import type { ArticleCollection } from '$lib/pocketbase.schema';
import { getFileSrc, pbAdmin } from '$lib/pocketbase.server';
import { calculateReactionsFromCollection } from '$lib/reactions';
import { getUser } from '$lib/users';
import type { BaseModel, ListResult } from 'pocketbase';

const EXPAND_RECORD_RELATIONS = 'messages(article),reactions(article),user';

export async function getArticle(
	articleId?: string,
	currentUserId?: string
): Promise<Article | null> {
	if (!articleId) return null;

	let collection: ArticleCollection | null = null;

	try {
		const pb = await pbAdmin();
		collection = await pb.collection('articles').getOne(articleId, {
			expand: EXPAND_RECORD_RELATIONS
		});
	} catch (_) {
		return null;
	}

	if (!collection) return null;

	const article = generateArticleFromCollection(collection, currentUserId);

	// Don't return a DRAFT article if the user is not the author
	if (collection.status === ArticleStatus.DRAFT && !article?.isCreatedByCurrentUser) return null;

	return article;
}

export async function getArticles(filter: string, currentUserId?: string): Promise<Article[]> {
	let collection: ArticleCollection[] = [];
	try {
		const pb = await pbAdmin();
		collection = await pb.collection('articles').getFullList(undefined, {
			sort: '-updated',
			filter: filter,
			expand: EXPAND_RECORD_RELATIONS
		});
	} catch (_) {
		return [];
	}

	return generateArticlesFromCollection(collection, currentUserId);
}

export async function createArticleCollection(
	formData: FormData
): Promise<ArticleCollection | null> {
	try {
		const pb = await pbAdmin();
		return await pb.collection('articles').create(formData);
	} catch (_) {
		return null;
	}
}

export async function getArticlesList(filter?: string): Promise<ListResult<BaseModel> | null> {
	let listResult: ListResult<BaseModel>;
	try {
		const pb = await pbAdmin();
		listResult = await pb.collection('articles').getList(1, 1, { filter });
	} catch (_) {
		return null;
	}

	return listResult;
}

export async function updateArticleCollection(
	articleId: string,
	formData: FormData
): Promise<ArticleCollection | null> {
	//validate user
	try {
		const pb = await pbAdmin();
		return await pb.collection('articles').update(articleId, formData, {
			expand: EXPAND_RECORD_RELATIONS
		});
	} catch (_) {
		return null;
	}
}

export async function deleteArticleCollection(articleId: string) {
	try {
		const pb = await pbAdmin();
		return await pb.collection('articles').delete(articleId);
	} catch (_) {
		return null;
	}
}

export function generateArticleFromCollection(
	collection?: ArticleCollection,
	currentUserId?: string
): Article | null {
	if (!collection) return null;

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
		audioSrc: getFileSrc(collection, 'audio'),
		imageSrc: getFileSrc(collection, 'image'),
		user: getUser(userCollection),
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
export async function isUserAuthorized(
	articleId?: string,
	currentUserId?: string
): Promise<boolean> {
	// FIXME: could be optimized by only querying the article, without `EXPAND_RECORD_RELATIONS`
	const article = await getArticle(articleId, currentUserId);
	return article?.isCreatedByCurrentUser ?? false;
}