import { pb, pocketbaseURL } from '$lib/+server.pocketbase';

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

	const articles = JSON.parse(JSON.stringify(records));

	articles.forEach((article: any) => {
		article.baseImageURL = pocketbaseURL;
	});

	return {
		articles: articles || []
	};
};
