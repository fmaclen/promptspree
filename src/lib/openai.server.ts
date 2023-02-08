import { env } from '$env/dynamic/private';
import { logEventToSlack } from '$lib/slack.server';
import { error} from '@sveltejs/kit';
import { Configuration, OpenAIApi } from 'openai';

import { ArticleCategory } from './article';

export interface ArticlePromptShape {
	headline: string;
	category: ArticleCategory;
	body: string[];
}

const articleCategories = Object.values(ArticleCategory).join(', ');
const articlePromptShape = {
	headline: 'Clickbait headline should be less 80 characters',
	body: [
		'Paragraph 1 should be between 70 and 140 characters long',
		'Paragraph 2 should be between 200 and 280 characters long',
		'Paragraph 3 should be between 70 and 200 character longs'
	],
	category: `Choose the closest category that best describes the article: ${articleCategories}`
};

const configuration = new Configuration({
	apiKey: env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

const formatPrompt = (prompt: string) => {
	return `
		${prompt.trim()}
		Write article in English, don't repeat phrases, use this JSON shape and minify it, stricly adhere to character limits as specified:
		${JSON.stringify(articlePromptShape)}
	`;
};

export const getCompletionFromAI = async (prompt: string): Promise<{ status: number, message: string; }> => {
	try {
		const completionResponse = await openai.createCompletion({
			model: 'text-davinci-003',
			temperature: 0.7,
			max_tokens: 384,
			top_p: 1.0,
			frequency_penalty: 0.0,
			presence_penalty: 1,
			prompt: formatPrompt(prompt)
		});

		const completion = completionResponse.data.choices[0].text?.trim()
		if (completion) return { status: 200, message: completion };

		// If we get here, the AI didn't return a completion for some unknown reason
		throw error(500);
	} catch (err: any) {
		logEventToSlack('openai.server.ts: getCompletionFromAI', err);

		switch (err?.response?.status) {
			case 429:
				return { status: 429, message: 'API rate limit exceeded' };
			case 503:
				return { status: 503, message: 'That model is currently overloaded with other requests' };
			default:
				throw error(500);
		}
	}
};
