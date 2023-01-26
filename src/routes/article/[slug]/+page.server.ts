import type { Record } from 'pocketbase';
import { error } from '@sveltejs/kit';
import { pb } from '$lib/pocketbase.server';
import { generateArticle } from '$lib/article.server';
import { logErrorToSlack } from '$lib/slack.server';

interface Params {
	slug: string | null;
}

export const load = async ({ params }: { params: Params }) => {
	const { slug } = params;
	if (!slug) throw error(404, 'Not found');

	let record: Record | null = null;

	try {
		record = await pb.collection('articles').getOne(slug, {
			expand: 'user'
		});
	} catch (err) {
		logErrorToSlack(err);
	}

	const article = generateArticle(record);
	if (!article) throw error(404, 'Not found');

	return { article };
};
