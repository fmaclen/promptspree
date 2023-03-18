import { env } from '$env/dynamic/private';
import { logEventToSlack } from '$lib/slack.server';
import { error } from '@sveltejs/kit';
import { type ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';

import type { ArticleCompletion } from './articles';
import { UNKNOWN_ERROR_MESSAGE } from './utils';

export interface CompletionUserPrompt {
	userId: string;
	messages: ChatCompletionRequestMessage[];
}

export interface CompletionResponse {
	status: number; // Status code
	message: string; // Status message
	completion: string | null;
	parsedCompletion?: ArticleCompletion;
}

const configuration = new Configuration({ apiKey: env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

export const CURRENT_MODEL = 'gpt-3.5-turbo';

// Every article starts
// export function getInitialChatCompletionRequest(
// 	userPrompt: string
// ): ChatCompletionRequestMessage[] {
// 	return [
// 		{ role: 'system', content: SYSTEM_PROMPT },
// 		{ role: 'user', content: userPrompt }
// 	];
// }

export async function getCompletionFromAI(
	completionUserPrompt: CompletionUserPrompt
): Promise<CompletionResponse> {
	try {
		const completion = await openai.createChatCompletion({
			model: CURRENT_MODEL,
			temperature: 0.75,
			max_tokens: 2048,
			messages: completionUserPrompt.messages,
			user: completionUserPrompt.userId // e.g. `my6b0jgzuwrtuxg`
		});

		const unformattedCompletion = completion.data.choices[0].message?.content;

		if (!unformattedCompletion)
			// If we get here, the AI didn't return a completion for some unknown reason
			return {
				completion: null,
				status: 500,
				message: "Couldn't get a response from AI, please try again later"
			};

		return {
			completion: unformattedCompletion,
			status: 200,
			message: 'Create chat completion was succesful'
		};
	} catch (err: any) {
		logEventToSlack('openai.server.ts: getCompletionFromAI', err);

		switch (err?.response?.status) {
			case 429:
				return {
					completion: null,
					status: 429,
					message: 'API rate limit exceeded'
				};
			case 503:
				return {
					completion: null,
					status: 503,
					message: 'That model is currently overloaded with other requests'
				};
			default:
				throw error(500, UNKNOWN_ERROR_MESSAGE);
		}
	}
}
