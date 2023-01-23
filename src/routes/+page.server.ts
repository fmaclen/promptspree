import { pb } from '$lib/+server.utils';

export const load = async ({ locals }) => {
	const records = await pb.collection('articles').getFullList(25, {
		sort: '-created',
		filter: 'status = "published"'
	});

	return {
		user: locals.user || undefined,
		articles: JSON.parse(JSON.stringify(records))
	};
};
