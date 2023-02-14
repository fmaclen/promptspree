import { ArticleStatus } from '$lib/article';
import { generateArticles } from '$lib/article.server';
import { handlePocketbaseError } from '$lib/pocketbase.server';
import { logEventToSlack } from '$lib/slack.server';
import type { BaseAuthStore } from 'pocketbase';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	let articlesCollection: BaseAuthStore['model'][] = [];

	try {
		articlesCollection = await locals.pb.collection('articles').getFullList(200, {
			sort: '-updated',
			filter: `status = "${ArticleStatus.PUBLISHED}"`,
			expand: 'user'
		});
	} catch (err) {
		logEventToSlack('/+page.server.ts', err);
		handlePocketbaseError(err);
	}

	return {
		articles: await generateArticles(articlesCollection, locals)
	};
};
