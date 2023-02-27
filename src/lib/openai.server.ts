import { env } from '$env/dynamic/private';
import { logEventToSlack } from '$lib/slack.server';
import { error } from '@sveltejs/kit';
import { Configuration, OpenAIApi } from 'openai';

import { ArticleCategory } from './article';

export interface ArticleCompletion {
	headline: string;
	category: ArticleCategory;
	body: string[];
}

export interface CompletionUserPrompt {
	user: string;
	prompt: string;
}

export interface CompletionResponse {
	status: number;
	message: string;
}

const articleCategories = Object.values(ArticleCategory).join(', ');
const articlePromptShape = {
	headline: 'Clickbait headline shorter than 80 characters',
	body: [
		'Attention grabbing introduction must shorter than 140 characters',
		'Main paragraph with details at least 420 characters',
		'Conclusion paragraph at least 280 characters'
	],
	category: `Choose the closest category that best describes the article: ${articleCategories}`
};

const configuration = new Configuration({
	apiKey: env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

const formatPrompt = (prompt: string): string => {
	return `
		${prompt.trim()}
		Write article in English, don't repeat phrases, use this JSON shape and minify it, stricly adhere to character limits as specified:
		${JSON.stringify(articlePromptShape)}
	`;
};

export const getCompletionFromAI = async ({
	user,
	prompt
}: CompletionUserPrompt): Promise<CompletionResponse> => {
	try {
		const completionResponse = await openai.createCompletion({
			model: 'text-davinci-003',
			temperature: 1,
			max_tokens: 1024,
			top_p: 1.0,
			frequency_penalty: 0.0,
			presence_penalty: 1,
			prompt: formatPrompt(prompt),
			user // e.g. `my6b0jgzuwrtuxg`
		});

		const completion = completionResponse.data.choices[0].text?.trim();
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
