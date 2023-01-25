import type Article from '$lib/components/Article.svelte';
import { getImageURL, handlePocketbaseError, pb } from '$lib/pocketbase.server';
import type { BaseAuthStore, Record } from 'pocketbase';

export const load = async () => {
	let records: Record[] = [];

	try {
		records = await pb.collection('articles').getFullList(25, {
			sort: '-created',
			filter: 'status = "published"'
		});
	} catch (err) {
		handlePocketbaseError(err);
	}

	const articlesCollection = JSON.parse(JSON.stringify(records)) as BaseAuthStore['model'][];

	const articles: Article[] = articlesCollection.map((article) => {
		if (!article) return;
		article.body = article.body.split('\n');
		article.imageURL = getImageURL(article);
		return article;
	});

	return {
		articles: articles || []
	};
};
