import { Configuration, OpenAIApi } from 'openai';
import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';
import { logEventToSlack } from '$lib/slack.server';

export interface ArticlePromptShape {
	headline: string;
	summary: string;
	body: string[];
}

const ARTICLE_PROMPT_SHAPE = {
	headline: 'Headline should be shorter than 80 characters',
	summary: 'Summary should be shorter than 200 characters',
	body: [
		'Paragraph 1 should be shorter than 140 characters',
		'Paragraph 2 should be shorter than 280 characters'
	]
};

const configuration = new Configuration({
	apiKey: env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

const formatPrompt = (prompt: string) => {
	return `
		${prompt}

		Format the response in English and using this JSON shape:

		${JSON.stringify(ARTICLE_PROMPT_SHAPE)}
	`;
};

export const getCompletionFromAI = async (prompt: string) => {
	try {
		const completion = await openai.createCompletion({
			model: 'text-davinci-003',
			temperature: 0.7,
			max_tokens: 256,
			top_p: 1.0,
			frequency_penalty: 0.0,
			presence_penalty: 1,
			prompt: formatPrompt(prompt)
		});

		return completion.data.choices[0].text;
	} catch (err) {
		logEventToSlack('openai.server.ts: getCompletionFromAI', err);

		switch (err?.response.status) {
			case 429:
				throw error(429, 'API rate limit exceeded');
			case 503:
				throw error(503, 'That model is currently overloaded with other requests. ');
			default:
				throw error(500, 'Uknown error');
		}
	}
};
