import { aiCompletion } from '$lib/+server.openai';

export const actions = {
	generate: async ({ request }) => {
		const body = Object.fromEntries(await request.formData());

		// const parsed = getArticleFromCompletion(
		// 	body.prompt,
		// 	`{
		// 		"headline": "Headline should have different words than prompt shorter than 80 characters",
		// 		"summary": "Summary should be shorter than 200 characters",
		// 		"body": [
		// 			"Paragraph 1 should be shorter than 140 characters",
		// 			"Paragraph 2 should be shorter than 280 characters"
		// 		]
		// 	}
		// `
		// );
		// console.log(parsed);
		// return parsed;

		const completion = await aiCompletion(body.prompt);
		console.log(completion);
		return getArticleFromCompletion(body.prompt, completion.data.choices[0].text);
	},
	publish: async ({ request }) => {
		const body = Object.fromEntries(await request.formData());

		console.log('publishing: ', body);
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
