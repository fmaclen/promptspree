import { pb } from '$lib/+server.utils';

export const load = async () => {
	const records = await pb.collection('articles').getFullList(25, {
		sort: '-created',
		filter: 'status = "published"'
	});

	return {
		articles: JSON.parse(JSON.stringify(records))
	};
};
