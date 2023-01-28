import type { Article } from '$lib/article';
import { generateArticle } from '$lib/article.server';
import { handlePocketbaseError, pb } from '$lib/pocketbase.server';
import { logEventToSlack } from '$lib/slack.server';
import type { BaseAuthStore, Record } from 'pocketbase';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	let records: Record[] = [];

	try {
		records = await pb.collection('articles').getFullList(25, {
			sort: '-created',
			filter: 'status = "published"',
			expand: 'user'
		});
	} catch (err) {
		logEventToSlack('HOMEPAGE', err);
		handlePocketbaseError(err);
	}

	const articles: Article[] = [];

	const articlesCollection = JSON.parse(JSON.stringify(records)) as BaseAuthStore['model'][];

	articlesCollection.map((article) => {
		const generatedArticle = generateArticle(article);
		if (generatedArticle) articles.push(generatedArticle);
	});

	return {
		articles: articles || []
	};
};
