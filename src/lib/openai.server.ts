import { env } from '$env/dynamic/private';
import { CURRENT_MODEL, type CompletionResponse, type CompletionUserPrompt } from '$lib/openai';
import { logEventToSlack } from '$lib/slack.server';
import { UNKNOWN_ERROR_MESSAGE } from '$lib/utils';
import { error } from '@sveltejs/kit';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({ apiKey: env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

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
