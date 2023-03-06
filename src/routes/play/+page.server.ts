import { ArticleCategory, ArticleStatus } from '$lib/article';
import {
	createArticleCollection,
	generateArticle,
	publishArticle,
	updateArticleCollection
} from '$lib/article.server';
import {
	type ArticleCompletion,
	type CompletionResponse,
	type CompletionUserPrompt,
	getCompletionFromAI,
	getInitialChatCompletionRequest
} from '$lib/openai.server';
import { logEventToSlack } from '$lib/slack.server';
import { getCompletionFromMock } from '$lib/tests';
import { UNKNOWN_ERROR_MESSAGE, isTestEnvironment } from '$lib/utils';
import { error, fail, redirect } from '@sveltejs/kit';
import type { ChatCompletionRequestMessage } from 'openai';
import type { BaseAuthStore } from 'pocketbase';

import type { PageServerLoad } from '../$types';
import { miniStringify } from '../../lib/pocketbase.server';
import type { Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.pb.authStore.isValid) throw redirect(303, '/join');
};

export const actions: Actions = {
	generate: async ({ request, locals }) => {
		// Redirect to login if no user is set in locals
		if (!locals?.user) throw redirect(303, '/login');

		const formData = await request.formData();

		const validation = await validatePrompt(formData.get('prompt')?.toString());
		if (!validation.prompt || validation.error)
			return fail(400, { fieldError: ['prompt', validation.error] });

		const articleId = formData.get('articleId')?.toString();

		let articleCollection: BaseAuthStore['model'];

		if (articleId) {
			// Find existing article
			articleCollection = await locals.pb
				.collection('articles')
				.getOne(articleId, { expand: 'user' });
			articleCollection?.messages.push({ role: 'user', content: validation.prompt });
		} else {
			// Create new article
			setDefaultValues(formData, locals.user.id, validation.prompt);
			articleCollection = await createArticleCollection(locals.pb, formData); // Create draft article
			if (!articleCollection) return fail(400, { error: 'Prompt could not be saved' });
		}
		if (!articleCollection) throw error(500, UNKNOWN_ERROR_MESSAGE);

		//
		//
		// TODO: check if the number of tokens is smaller than 4096
		//
		//

		const completionResponse = await getCompletion(locals.user.id, articleCollection.messages);
		if (completionResponse.status !== 200) {
			return fail(completionResponse.status, { error: completionResponse.message });
		}

		const { articleCompletion } = completionResponse;

		// Add AI completion to the messages chain (without suggestions) so we can
		// use it in a future request for context.
		articleCollection.messages.push({
			role: 'assistant',
			content: articleCompletion
		});

		// Update the article with the completion
		articleCollection = await updateArticleCollection(locals.pb, articleCollection.id, {
			...articleCompletion,
			body: articleCompletion && miniStringify(articleCompletion.body),
			messages: miniStringify(articleCollection.messages)
		});

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

interface PromptValidation {
	prompt: string | null;
	error: string | null;
}

async function validatePrompt(prompt: string | undefined): Promise<PromptValidation> {
	// Check that the prompt exists, is greater than 10 character and less than 280
	if (!prompt) return { prompt: null, error: 'Prompt was not provided' };
	if (prompt.length < 10) return { prompt, error: 'Prompt is too short' };
	if (prompt.length > 290) return { prompt, error: 'Prompt is greater than 280 characters' };

	// TODO: Check that prompt doesn't violete the moderation rules

	return { prompt, error: null };
}

function setDefaultValues(formData: FormData, userId: string, prompt: string) {
	const messages = getInitialChatCompletionRequest(prompt);
	formData.append('messages', miniStringify(messages)); // Set the starting messages
	formData.append('status', ArticleStatus.DRAFT); // Set the default status
	formData.append('user', userId); // Set the author
}

// Get completion from AI and try to parse it
async function getCompletion(
	userId: string,
	messages: ChatCompletionRequestMessage[]
): Promise<CompletionResponse> {
	const completionUserPrompt: CompletionUserPrompt = {
		userId: userId,
		messages
	};

	let completionResponse: CompletionResponse;
	let retries = 0;

	do {
		// HACK: If we're in the test environment, mock the completion response.
		// Couldn't figure out a better way to mock the response from Playwright.
		completionResponse = isTestEnvironment
			? getCompletionFromMock(completionUserPrompt)
			: await getCompletionFromAI(completionUserPrompt);

		// Break out of the retry loop if we get a valid completion
		completionResponse = getFieldsFromCompletion(completionResponse);
		if (completionResponse.articleCompletion) break;

		// Wait 2 seconds before retrying again
		// But in the test environment don't wait otherwise the test will timeout
		if (!isTestEnvironment) await new Promise((resolve) => setTimeout(resolve, 2000));

		retries++;
	} while (retries < 3);

	//
	//
	//
	//
	//
	console.log(completionUserPrompt);
	//
	//
	//
	//
	//

	return completionResponse;
}

// Parses the completion from OpenAI and checks the format of the fields is correct
function getFieldsFromCompletion(completionResponse: CompletionResponse): CompletionResponse {
	const cantGenerateError = {
		status: 400,
		message: "Couldn't generate an article based on your last prompt, try modifiying it",
		articleCompletion: null
	};

	// If the completion is not 200 or 400, it means that the response has an API error,
	// we assume we can't parse the `unformattedCompletion` and we return it as-is.
	if (![200, 400].includes(completionResponse.status)) return completionResponse;

	// If the `unformattedCompletion` is missing we also can't parse it
	if (!completionResponse.unformattedCompletion) return cantGenerateError;

	// Sometimes AI will return a completion that has extra text so we can't parse
	// the JSON directly. We need to find the start and end of the JSON object
	// and then parse it.
	const { unformattedCompletion } = completionResponse;
	const startIndex = unformattedCompletion.indexOf('{');
	const endIndex = unformattedCompletion.lastIndexOf('}') + 1;
	const jsonString = unformattedCompletion.slice(startIndex, endIndex);

	let fields: ArticleCompletion | undefined;

	try {
		fields = JSON.parse(jsonString);
	} catch (err) {
		logEventToSlack(
			'/lib/article.server.ts: getFieldsFromCompletion',
			`${err} // ${unformattedCompletion}`
		);

		return cantGenerateError;
	}

	// Validate the parsed fields
	if (
		!fields?.headline ||
		fields?.body.length < 1 ||
		fields?.suggestions.length < 1 ||
		!isCategoryValid(fields?.category)
	) {
		return cantGenerateError;
	}

	return {
		status: 200,
		message: 'Completion and field validation was succesful',
		articleCompletion: fields
	};
}

// Check if the category the AI picked is one of the `ArticleCategory`'s we expect
function isCategoryValid(category: string) {
	return Object.values(ArticleCategory).includes(category as ArticleCategory);
}
