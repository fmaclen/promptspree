import { type Article, ArticleStatus, getArticleAndUserIds } from '$lib/articles';
import { deleteArticle, getArticles, getArticlesList, publishArticle } from '$lib/articles.server';
import type { UserCollection } from '$lib/pocketbase.schema';
import { pbAdmin } from '$lib/pocketbase.server';
import { getPromptScore } from '$lib/users';
import { error, redirect } from '@sveltejs/kit';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!params.slug) throw error(404, 'Not found');

	// Return 404 if the drafts are not the current user's
	const isCurrentUserProfile = locals.user?.id === params.slug;
	if (!isCurrentUserProfile) throw error(404, 'Not found');

	let userCollection: UserCollection | null = null;

	try {
		const pb = await pbAdmin();
		userCollection = await pb.collection('users').getOne(params.slug);
	} catch (_) {
		// eslint-disable-next-line no-empty
	}

	if (!userCollection?.id || !userCollection?.created) throw error(404, 'Not found');

	const articles: Article[] = await getArticles(
		locals,
		`user = "${params.slug}" && status = "${ArticleStatus.DRAFT}"`
	);

	const articlesPublished = await getArticlesList(
		locals,
		`user = "${params.slug}" && status = "${ArticleStatus.PUBLISHED}"`
	);
	const totalPublished = articlesPublished?.totalItems ?? 0;

	const profile = {
		id: userCollection.id,
		nickname: userCollection.nickname,
		created: userCollection.created,
		promptScore: getPromptScore(articles)
	};

	return { profile, isCurrentUserProfile, articles, totalPublished };
};

export const actions: Actions = {
	delete: async ({ request, locals }) => {
		const { articleId, currentUserId } = await getArticleAndUserIds(request, locals);
		await deleteArticle(locals, articleId);
		throw redirect(303, `/profile/${currentUserId}`);
	},
	publish: async ({ request, locals }) => {
		const { articleId, currentUserId } = await getArticleAndUserIds(request, locals);
		await publishArticle(locals, articleId);
		throw redirect(303, `/profile/${currentUserId}`);
	}
};
