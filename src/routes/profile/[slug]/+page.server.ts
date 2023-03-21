import { type Article, ArticleStatus, getArticleAndUserIds } from '$lib/articles';
import { deleteArticle, getArticles, getArticlesList, publishArticle } from '$lib/articles.server';
import type { UserCollection } from '$lib/pocketbase.schema';
import { getPromptScore } from '$lib/users';
import { error, redirect } from '@sveltejs/kit';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!params.slug) throw error(404, 'Not found');

	const isCurrentUserProfile = locals.user?.id === params.slug;

	let userCollection: UserCollection | null = null;

	try {
		userCollection = await locals.pbAdmin.collection('users').getOne(params.slug);
	} catch (_) {
		// eslint-disable-next-line no-empty
	}

	if (!userCollection) throw error(404, 'Not found');

	const articles: Article[] = await getArticles(
		locals,
		`user = "${params.slug}" && status = "${ArticleStatus.PUBLISHED}"`
	);

	let totalDrafts = 0;

	if (isCurrentUserProfile) {
		const articleDrafts = await getArticlesList(
			locals,
			`user = "${params.slug}" && status = "${ArticleStatus.DRAFT}"`
		);
		totalDrafts = articleDrafts?.totalItems ?? 0;
	}

	const profile = {
		id: userCollection.id,
		nickname: userCollection.nickname,
		created: userCollection.created,
		promptScore: getPromptScore(articles)
	};

	return { profile, isCurrentUserProfile, articles, totalDrafts };
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
