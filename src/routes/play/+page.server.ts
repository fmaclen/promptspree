import { aiCompletion } from '$lib/+server.openai';
import { PLACEHOLDER_ARTICLE } from '$lib/components/Article';

export const actions = {
	generate: async ({ request }) => {
		const body = Object.fromEntries(await request.formData());

		// Trust but verify the prompt is not too long
		if (body.prompt.length > 280) return PLACEHOLDER_ARTICLE;

		try {
			const completion = await aiCompletion(body.prompt);
			if (completion.data.choices[0].text)
				return getArticleFromCompletion(body.prompt, completion.data.choices[0].text);
		} catch (error) {
			console.error(error);
			return PLACEHOLDER_ARTICLE;
		}

		// return new Promise((resolve) => {
		// 	setTimeout(() => resolve(PLACEHOLDER_ARTICLE), 5000);
		// });
	},
	publish: async ({ request }) => {
		const body = Object.fromEntries(await request.formData());
	}
};

const getArticleFromCompletion = (prompt: string, completion: string) => {
	const article = JSON.parse(completion);
	article.body = article.body.join('\n');
	article.prompt = prompt;

	// FIXME: this is a hack to make the article valid
	article.updated = new Date().toISOString();
	article.collectionId = '';
	article.collectionName = '';
	article.id = '';
	article.image = [];

	return article;
};
