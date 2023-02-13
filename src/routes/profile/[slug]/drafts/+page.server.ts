import { type Article, ArticleStatus } from '$lib/article';
import { deleteArticle, generateArticle, publishArticle } from '$lib/article.server';
import { error, redirect } from '@sveltejs/kit';
import type { BaseAuthStore } from 'pocketbase';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!params.slug) throw error(404, 'Not found');

	let userCollection: BaseAuthStore['model'] = null;
	let articlesCollection: BaseAuthStore['model'][] = [];

	let totalPublished = 0;
	const isCurrentUserProfile = locals.user?.id === params.slug;

	if (isCurrentUserProfile) {
		const articlesPublished = await locals.pb
			.collection('articles')
			.getList(1, 1, {
				filter: `user = "${params.slug}" && status = "${ArticleStatus.PUBLISHED}"`
			});
		totalPublished = articlesPublished.totalItems;
	}

	try {
		userCollection = await locals.pb.collection('users').getOne(params.slug);
		articlesCollection = await locals.pb.collection('articles').getFullList(200, {
			sort: '-updated',
			filter: `user = "${params.slug}" && status = "${ArticleStatus.DRAFT}"`,
			expand: 'user'
		});
	} catch (_) {
		// eslint-disable-next-line no-empty
	}

	if (!userCollection) throw error(404, 'Not found');

	const articles: Article[] = [];

	for (const articleCollection of articlesCollection) {
		const generatedArticle = await generateArticle(articleCollection, locals);
		if (generatedArticle) articles.push(generatedArticle);
	}

	// Calculate user's prompt score
	const promptScore = articles.reduce((acc, article) => acc + article.reactions.total, 0);

	const profile = {
		id: userCollection.id,
		nickname: userCollection.nickname,
		created: userCollection.created,
		promptScore
	};

	return { profile, articles, isCurrentUserProfile, totalPublished };
};

export const actions: Actions = {
	delete: async ({ request, locals }) => {
		await deleteArticle(request, locals);
		throw redirect(303, `/profile/${locals?.user?.id}`)
	},
	publish: async ({ request, locals }) => {
		const article = await publishArticle(request, locals);
		throw redirect(303, article?.id ? `/article/${article.id}` : `/profile/${locals?.user?.id}`)
	}
};
