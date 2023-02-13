import { type Article, ArticleStatus } from '$lib/article';
import { generateArticle } from '$lib/article.server';
import { handlePocketbaseError } from '$lib/pocketbase.server';
import { logEventToSlack } from '$lib/slack.server';
import type { BaseAuthStore } from 'pocketbase';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	let articlesCollection: BaseAuthStore['model'][] = [];

	try {
		articlesCollection = await locals.pb.collection('articles').getFullList(25, {
			sort: '-updated',
			filter: `status = "${ArticleStatus.PUBLISHED}"`,
			expand: 'user'
		});
	} catch (err) {
		logEventToSlack('/+page.server.ts', err);
		handlePocketbaseError(err);
	}

	const articles: Article[] = [];

	for (const articleCollection of articlesCollection) {
		const generatedArticle = await generateArticle(articleCollection, locals);
		if (generatedArticle) articles.push(generatedArticle);
	}

	return {
		articles
	};
};
