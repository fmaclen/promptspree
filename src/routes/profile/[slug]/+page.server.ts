import { type Article, ArticleStatus } from '$lib/article';
import { generateArticle } from '$lib/article.server';
import { handlePocketbaseError } from '$lib/pocketbase.server';
import { logEventToSlack } from '$lib/slack.server';
import { error, fail, redirect } from '@sveltejs/kit';
import type { BaseAuthStore } from 'pocketbase';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!params.slug) throw error(404, 'Not found');

	let userCollection: BaseAuthStore['model'] = null;
	let articlesCollection: BaseAuthStore['model'][] = [];

	let totalDrafts = 0;
	const isCurrentUserProfile = locals.user?.id === params.slug;

	if (isCurrentUserProfile) {
		const articleDrafts = await locals.pb
			.collection('articles')
			.getList(1, 1, { filter: `user = "${params.slug}" && status = "${ArticleStatus.DRAFT}"` });
		totalDrafts = articleDrafts.totalItems;
	}

	try {
		userCollection = await locals.pb.collection('users').getOne(params.slug);
		articlesCollection = await locals.pb.collection('articles').getFullList(200, {
			sort: '-created',
			filter: `user = "${params.slug}" && status = "${ArticleStatus.PUBLISHED}"`,
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

	// Sort articles by number of reactions
	articles.sort((a, b) => b.reactions.total - a.reactions.total);

	// Calculate user's prompt score
	const promptScore = articles.reduce((acc, article) => acc + article.reactions.total, 0);

	const profile = {
		id: userCollection.id,
		nickname: userCollection.nickname,
		created: userCollection.created,
		promptScore
	};

	return { profile, articles, isCurrentUserProfile, totalDrafts };
};

export const actions: Actions = {
	delete: async ({ request, locals }) => {
		const formData = await request.formData();
		const articleId = formData.get('articleId')?.toString();

		if (!locals?.user || !articleId) return fail(400, { error: "Can't delete the article" });

		try {
			await locals.pb.collection('articles').delete(articleId);
		} catch (err) {
			console.log('made it here');
			logEventToSlack('/profile/[slug]/+page.server.ts (delete)', err);
			handlePocketbaseError(err);
		}

		throw redirect(303, `/profile/${locals.user.id}`);
	}
};
