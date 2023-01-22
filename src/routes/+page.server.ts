import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

export const load = async ({ locals }) => {
	// filter records where the status is not "draft"
	const records = await pb.collection('articles').getFullList(200, {
		sort: '-created',
		filter: 'status != "draft"'
	});

	return {
		user: locals.user || undefined,
		articles: JSON.parse(JSON.stringify(records))
	};
};
