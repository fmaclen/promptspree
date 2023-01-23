import { pb } from '$lib/+server.pocketbase';

export const load = async () => {
	let records: any;

	try {
		records = await pb.collection('articles').getFullList(25, {
			sort: '-created',
			filter: 'status = "published"'
		});
	} catch (error) {
		console.error(error);
	}

	return {
		articles: records ? JSON.parse(JSON.stringify(records)) : []
	};
};
