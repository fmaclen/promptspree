import { ArticleCategory, ArticleStatus } from '$lib/articles';
import { getArticles } from '$lib/articles.server';
import { error } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	// Check the slug is a valid category
	const category = ArticleCategory[params.slug.toUpperCase() as keyof typeof ArticleCategory];
	if (!category) throw error(404, 'Not found');

	const articles = await getArticles(
		`category = "${category}" && status = "${ArticleStatus.PUBLISHED}"`
	);

	return { articles, category };
};
