import { env } from '$env/dynamic/private';
import { logEventToSlack } from '$lib/slack.server';
import { error } from '@sveltejs/kit';
import { type ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';

import { ArticleCategory } from './article';

export interface ArticleCompletion {
	headline: string;
	category: ArticleCategory;
	body: string[];
	suggestions: string[];
}

export interface CompletionUserPrompt {
	userId: string;
	messages: ChatCompletionRequestMessage[];
}

export interface CompletionResponse {
	status: number;
	message?: string;
}

const configuration = new Configuration({ apiKey: env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);
const articleCategories = Object.values(ArticleCategory).join(', ');

export const CURRENT_MODEL = 'gpt-3.5-turbo';
export const SYSTEM_PROMPT = `
You are a website that allows users to generate fictitious articles in a news format.
You will use the user's prompt as inspiration to generate an article.
If the user's prompt is not clear simply generate a random article.
If the user prompt is of a humorous tone play along with the joke, don't steer the suggestions as if it was a real article.
You can only write articles in English.
The article must have a headline, a category, a body and suggestions.
You will provide suggestions that the user can choose to improve the generated article, for example: "add a quote from an expert, make it more ridiculous, change the names with realistic sounding fictitious ones, revert changes back to an earlier version, etc".
Your response should only include a minified JSON object containing the article, without any additional text.
Don't use any line breaks, whitespaces, tabs or other characters.
Format the JSON using these keys:
- "headline": No more than 80 characters long
- "category": One of these: ${articleCategories}
- "body": an array of 3 to 6 paragraphs
- "suggestions": an array of 3 very short sentences
- "error": Optional. If the prompt goes against content moderation rules use this key with a short description of the issue.
`;

// Every article starts
export function getInitialChatCompletionRequest(
	userPrompt: string
): ChatCompletionRequestMessage[] {
	return [
		{ role: 'system', content: SYSTEM_PROMPT },
		{ role: 'user', content: userPrompt }
	];
}

export async function getCompletionFromAI({
	userId,
	messages
}: CompletionUserPrompt): Promise<CompletionResponse> {
	try {
		const completion = await openai.createChatCompletion({
			model: CURRENT_MODEL,
			user: userId, // e.g. `my6b0jgzuwrtuxg`
			temperature: 0.75,
			max_tokens: 2048,
			messages
		});

		if (!completion)
			// If we get here, the AI didn't return a completion for some unknown reason
			return { status: 500, message: "Couldn't get a response from AI, please try again later" };

		return { status: 200, message: completion.data.choices[0].message?.content };
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
}
