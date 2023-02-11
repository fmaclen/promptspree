import { type Article, ArticleStatus } from '$lib/article';
import { generateArticle } from '$lib/article.server';
import { logEventToSlack } from '$lib/slack.server';
import { type Actions, error } from '@sveltejs/kit';
import type { BaseAuthStore } from 'pocketbase';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!params.slug) throw error(404, 'Not found');

	let userCollection: BaseAuthStore['model'] = null;
	let articlesCollection: BaseAuthStore['model'][] = [];

	try {
		userCollection = await locals.pb.collection('users').getOne(params.slug);
		articlesCollection = await locals.pb.collection('articles').getFullList(25, {
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
		nickname: userCollection.nickname,
		created: userCollection.created,
		promptScore
	};

	return { profile, articles };
};

