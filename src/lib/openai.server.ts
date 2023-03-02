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

const configuration = new Configuration({ apiKey: env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

const articleCategories = Object.values(ArticleCategory).join(', ');

const SYSTEM_PROMT = `
You are a website that allows users to generate fictitious articles in a news format.
You will use the user's prompt as inspiration to generate the article.
You will provide suggestions that the user can choose to improve the generated article, for example: "add a quote from an expert, make it more ridiculous, change the names with realistic sounding fictitious ones, revert changes back to an earlier version, etc".
If the user prompt is of a humorous tone follow along with the joke, don't steer the suggestions as if it was a real article.
Your response must be a minified JSON object with the following keys:
- "headline": No more than 80 characters long
- "category": Choose the closest that best describes the article from this list: ${articleCategories}
- "body": 2 to 5 paragraphs
- "suggestions": 3 very short sentences
- "error": Optional. If the prompt goes against content moderation rules use this key with a short description of the issue.
`;

// const articlePromptShape = {
// 	headline: 'Clickbait headline shorter than 80 characters',
// 	body: [
// 		'Attention grabbing introduction must shorter than 140 characters',
// 		'Main paragraph with details at least 420 characters',
// 		'Conclusion paragraph at least 280 characters'
// 	],
// 	category: `Choose the closest category that best describes the article: ${articleCategories}`
// };

// const formatPrompt = (prompt: string): string => {
// 	return `
// 		${prompt.trim()}
// 		Write article in English, don't repeat phrases, use this JSON shape and minify it, stricly adhere to character limits as specified:
// 		${JSON.stringify(articlePromptShape)}
// 	`;
// };

export const getCompletionFromAI = async ({
	user,
	prompt
}: CompletionUserPrompt): Promise<CompletionResponse> => {
	try {
		// const completionResponse = await openai.createCompletion({
		// 	model: 'text-davinci-003',
		// 	temperature: 1,
		// 	max_tokens: 1024,
		// 	top_p: 1.0,
		// 	frequency_penalty: 0.0,
		// 	presence_penalty: 1,
		// 	prompt: formatPrompt(prompt),
		// 	user // e.g. `my6b0jgzuwrtuxg`
		// });

		// const completion = completionResponse.data.choices[0].text?.trim();

		const completionResponse = await openai.createChatCompletion({
			model: 'gpt-3.5-turbo',
			user, // e.g. `my6b0jgzuwrtuxg`
			temperature: 0.75,
			messages: [
				{ role: 'system', content: SYSTEM_PROMT },
				{ role: 'user', content: prompt.trim() }
			]
		});

		const completion = completionResponse.data.choices[0].message?.content.trim();

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
