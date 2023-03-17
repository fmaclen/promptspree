import { ArticleStatus } from '$lib/articles';
import { deleteArticle, generateArticles, publishArticle } from '$lib/articles.server';
import { getPromptScore } from '$lib/user';
import { error, redirect } from '@sveltejs/kit';
import type { BaseAuthStore } from 'pocketbase';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!params.slug) throw error(404, 'Not found');

	let userCollection: BaseAuthStore['model'] = null;
	let articlesCollection: BaseAuthStore['model'][] = [];

	try {
		userCollection = await locals.pb.collection('users').getOne(params.slug);
		articlesCollection = await locals.pb.collection('articles').getFullList(200, {
			sort: '-updated',
			filter: `user = "${params.slug}" && status != "${ArticleStatus.FAILED}"`,
			expand: 'user'
		});
	} catch (_) {
		// eslint-disable-next-line no-empty
	}

	if (!userCollection) throw error(404, 'Not found');

	const articles = await generateArticles(articlesCollection, locals);
	const isCurrentUserProfile = locals.user?.id === params.slug;
	const totalPublished = articles.filter(
		(article) => article.status === ArticleStatus.PUBLISHED
	).length;

	const profile = {
		id: userCollection.id,
		nickname: userCollection.nickname,
		created: userCollection.created,
		promptScore: getPromptScore(articles)
	};

	return {
		articles: articles.filter((article) => article.status === ArticleStatus.DRAFT),
		profile,
		isCurrentUserProfile,
		totalPublished
	};
};

export const actions: Actions = {
	delete: async ({ request, locals }) => {
		await deleteArticle(request, locals);
		throw redirect(303, `/profile/${locals?.user?.id}`);
	},
	publish: async ({ request, locals }) => {
		const article = await publishArticle(request, locals);
		throw redirect(303, article?.id ? `/article/${article.id}` : `/profile/${locals?.user?.id}`);
	}
};
