import { type Article, ArticleStatus } from '$lib/articles';
import {
	deleteArticleCollection,
	getArticles,
	getArticlesList,
	isUserAuthorized,
	updateArticleCollection
} from '$lib/articles.server';
import type { UserCollection } from '$lib/pocketbase.schema';
import { pbAdmin } from '$lib/pocketbase.server';
import { getPromptScore } from '$lib/users';
import { error, fail, redirect } from '@sveltejs/kit';

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

	if (!userCollection) throw error(404, 'Not found');

	const articles: Article[] = await getArticles(
		`user = "${params.slug}" && status = "${ArticleStatus.DRAFT}"`,
		locals.user?.id
	);

	const articlesPublished = await getArticlesList(
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
		const formData = await request.formData();
		const articleId = formData.get('articleId')?.toString();

		// Authorize user
		const currentUserId = locals.user?.id;
		const isCurrentUserAuthorized = await isUserAuthorized(articleId, currentUserId);
		if (!isCurrentUserAuthorized || !articleId)
			return fail(401, { error: "Can't delete the article" });

		await deleteArticleCollection(articleId);
		throw redirect(303, `/profile/${currentUserId}`);
	},
	publish: async ({ request, locals }) => {
		const formData = await request.formData();
		const articleId = formData.get('articleId')?.toString();
		formData.append('status', ArticleStatus.PUBLISHED);

		// Authorize user
		const currentUserId = locals.user?.id;
		const isCurrentUserAuthorized = await isUserAuthorized(articleId, currentUserId);
		if (!isCurrentUserAuthorized || !articleId)
			return fail(401, { error: "Can't publish the article" });

		await updateArticleCollection(articleId, formData);
		throw redirect(303, `/profile/${currentUserId}`);
	}
};
