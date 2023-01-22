import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

export const load = async ({ locals }) => {
	// you can also fetch all records at once via getFullList
	const records = await pb.collection('articles').getFullList(200 /* batch size */, {
		sort: '-created'
	});

	return {
		user: locals.user || undefined,
		articles: JSON.parse(JSON.stringify(records))
	};
};
