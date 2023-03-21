import { ArticleStatus } from '$lib/articles';
import { getArticles } from '$lib/articles.server';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	return {
		articles: await getArticles(locals, `status = "${ArticleStatus.PUBLISHED}"`)
	};
};
