import { ArticleCategory, ArticleStatus } from '$lib/article';
import { generateArticle, publishArticle } from '$lib/article.server';
import {
	type ArticleCompletion,
	type CompletionResponse,
	type CompletionUserPrompt,
	getCompletionFromAI,
	getInitialChatCompletionRequest,
	CURRENT_MODEL
} from '$lib/openai.server';
import { handlePocketbaseError } from '$lib/pocketbase.server';
import { logEventToSlack } from '$lib/slack.server';
import { getCompletionFromMock } from '$lib/tests';
import { isTestEnvironment } from '$lib/utils';
import { fail, redirect } from '@sveltejs/kit';
import type { ChatCompletionRequestMessage } from 'openai';
import type { BaseAuthStore } from 'pocketbase';

import type { PageServerLoad } from '../$types';
import type { Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.pb.authStore.isValid) throw redirect(303, '/join');
};

export const actions: Actions = {
	generate: async ({ request, locals }) => {
		// Redirect to login if no user is set in locals
		if (!locals?.user) throw redirect(303, '/login');

		const formData = await request.formData();

		// Check that the prompt exists, is greater than 10 character and less than 280
		const prompt = formData.get('prompt')?.toString();
		if (!prompt) return fail(400, { fieldError: ['prompt', 'Prompt was not provided'] });
		if (prompt.length < 10) return fail(400, { fieldError: ['prompt', 'Prompt is too short'] });
		if (prompt.length > 290) return fail(400, { fieldError: ['prompt', 'Prompt is greater than 280 characters'] }); // prettier-ignore

		const initialMessages: ChatCompletionRequestMessage[] = getInitialChatCompletionRequest(prompt);

		formData.append('messages', JSON.stringify(initialMessages)); // Set the starting messages
		formData.append('status', ArticleStatus.DRAFT); // Set the default status
		formData.append('user', locals.user.id); // Set the author

		let articleCollection: BaseAuthStore['model'] = null;

		// Create the draft article
		try {
			articleCollection = await locals.pb.collection('articles').create(formData);
		} catch (err) {
			logEventToSlack('/play/+page.server.ts (generate)', err);
			handlePocketbaseError(err);
		}

		if (!articleCollection) return fail(401, { error: 'Prompt could not be saved' });

		// Get completion from OpenAI and parse it
		const completionUserPrompt: CompletionUserPrompt = {
			userId: locals.user.id,
			messages: initialMessages
		};

		let completion: CompletionResponse;
		let fieldsFromCompletion: ArticleCompletion | null = null;
		let retries = 0;

		do {
			// HACK: If we're in the test environment, mock the completion response.
			// Couldn't figure out a better way to mock the response from Playwright.
			completion = isTestEnvironment
				? getCompletionFromMock(completionUserPrompt)
				: await getCompletionFromAI(completionUserPrompt);

			fieldsFromCompletion = getFieldsFromCompletion(completion.message);
			if (fieldsFromCompletion) break;

			// Wait 2 seconds before retrying again
			!isTestEnvironment && await new Promise((resolve) => setTimeout(resolve, 2000));
			retries++;
		} while (retries < 3 && completion.status !== 200);

		if (completion.status !== 200) {
			return fail(completion.status, { error: completion.message });
		}

		// // Update the article with the completion
		try {
			articleCollection = await locals.pb.collection('articles').update(
				articleCollection.id,
				{
					...fieldsFromCompletion,
					body: JSON.stringify(fieldsFromCompletion?.body),
					messages: JSON.stringify(initialMessages),
					user: locals.user.id,
					status: fieldsFromCompletion ? ArticleStatus.DRAFT : ArticleStatus.FAILED,
					model: CURRENT_MODEL
				},
				{ expand: 'user' }
			);
		} catch (err) {
			logEventToSlack('/play/+page.server.ts (generate)', err);
			handlePocketbaseError(err);
		}

		if (!fieldsFromCompletion)
			return fail(400, { error: 'AI tried to generate the article but was in the wrong format' });

		// Generate the article for frontend
		const article = await generateArticle(articleCollection, locals);
		if (!article) return fail(400, { error: 'Article could not be generated' });

		return { article };
	},
	publish: async ({ request, locals }) => {
		const article = await publishArticle(request, locals);
		if (!article) return fail(400, { error: 'Article could not be published' });

		throw redirect(303, `/article/${article.id}`);
	}
};

// Parses the completion from OpenAI and checks the format of the fields is correct
function getFieldsFromCompletion(completion: string | undefined): ArticleCompletion | null {
	if (!completion) return null;

	let fields: ArticleCompletion | null = null;

	const startIndex = completion.indexOf('{');
	const endIndex = completion.lastIndexOf('}') + 1;
	const jsonString = completion.slice(startIndex, endIndex);
	
	try {
		fields = JSON.parse(jsonString);
	} catch (err) {
		logEventToSlack('/lib/article.server.ts: getFieldsFromCompletion', err);
	}

	if (!fields) return null;

	const { headline, category, body, suggestions } = fields;

	if (!headline || !isCategoryValid(category) || body.length < 1 || suggestions.length < 1)
		return null;

	return {
		headline,
		category,
		body,
		suggestions
	};
}

// Check if the category the AI picked is one of the `ArticleCategory`'s we expect
function isCategoryValid(category: string) {
	return Object.values(ArticleCategory).includes(category as ArticleCategory);
}
