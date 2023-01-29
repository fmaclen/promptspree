import { generateArticle } from '$lib/article.server';
import { logEventToSlack } from '$lib/slack.server';
import { error } from '@sveltejs/kit';
import type { Record } from 'pocketbase';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!params.slug) throw error(404, 'Not found');

	let record: Record | null = null;

	try {
		record = await locals.pb.collection('articles').getOne(params.slug, {
			expand: 'user'
		});
	} catch (err) {
		logEventToSlack('ARTICLE', err);
	}

	const article = generateArticle(record);
	if (!article) throw error(404, 'Not found');

	return { article };
};
