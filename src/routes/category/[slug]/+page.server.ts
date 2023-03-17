import { ArticleCategory, ArticleStatus } from '$lib/articles';
import { generateArticles } from '$lib/article.server';
import { error } from '@sveltejs/kit';
import type { BaseAuthStore } from 'pocketbase';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	// Check the slug is a valid category
	const category = ArticleCategory[params.slug.toUpperCase() as keyof typeof ArticleCategory];
	if (!category) throw error(404, 'Not found');

	let articlesCollection: BaseAuthStore['model'][] = [];

	try {
		articlesCollection = await locals.pb.collection('articles').getFullList(200, {
			sort: '-updated',
			filter: `category = "${category}" && status = "${ArticleStatus.PUBLISHED}"`,
			expand: 'user'
		});
	} catch (_) {
		// eslint-disable-next-line no-empty
	}

	if (!articlesCollection) throw error(404, 'Not found');

	const articles = await generateArticles(articlesCollection, locals);

	return { articles, category };
};
