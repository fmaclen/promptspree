import {
	ARTICLE_SYSTEM_PROMPT,
	type Article,
	ArticleCategory,
	type ArticleCompletion,
	ArticleStatus,
	isCategoryValid
} from '$lib/articles';
import { createArticle, getArticle, updateArticleCollection } from '$lib/articles.server';
import { type Message, MessageRole, generateCompletionUserPrompt } from '$lib/messages';
import { createMessageCollection, getMessagesCollection } from '$lib/messages.server';
import {
	type CompletionResponse,
	type CompletionUserPrompt,
	getCompletionFromAI
} from '$lib/openai.server';
import type { ArticleCollection, MessageCollection } from '$lib/pocketbase.schema';
import { logEventToSlack } from '$lib/slack.server';
import { getCompletionFromMock } from '$lib/tests';
import { UNKNOWN_ERROR_MESSAGE, isTestEnvironment } from '$lib/utils';
import { error, fail, redirect } from '@sveltejs/kit';

import type { PageServerLoad } from '../$types';
import type { Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.pb.authStore.isValid) throw redirect(303, '/join');
};

export const actions: Actions = {
	generate: async ({ request, locals }) => {
		// Redirect to login if no user is set in locals
		const currentUserId = locals?.user?.id;
		if (!currentUserId) throw redirect(303, '/login');

		const formData = await request.formData();
		const articleId = formData.get('articleId')?.toString();
		const validation = await validatePrompt(formData.get('prompt')?.toString());

		if (!validation.prompt || validation.error)
			return fail(400, { fieldError: ['prompt', validation.error] });

		let article = articleId
			? await getArticle(articleId, currentUserId)
			: await createArticle(currentUserId, ArticleStatus.DRAFT);
		if (!article?.id) throw error(500, UNKNOWN_ERROR_MESSAGE);

    // Get the messages (if any) for the article
		const messages: Message[] = article.messages || [];

		// Save user prompt as a message
		const userMessage = await createMessageCollection(
			article.id,
			MessageRole.USER,
			validation.prompt
		);
		if (!userMessage) throw error(500, UNKNOWN_ERROR_MESSAGE);

		messages.push(userMessage);

		const completionResponse = await getArticleCompletion(currentUserId, messages);
		const { status, message, parsedCompletion } = completionResponse;

		if (status !== 200 || !parsedCompletion) {
			await updateArticleCollection(article.id, { status: ArticleStatus.FAILED });
			return fail(status, { error: message });
		}

		// Save AI completion as a message
		const assistantMessage = await createMessageCollection(
			article.id,
			MessageRole.ASSISTANT,
			parsedCompletion
		);
		if (!assistantMessage) throw error(500, UNKNOWN_ERROR_MESSAGE);

		// Update the article with the completion
		article = await updateArticleCollection(article.id, { ...parsedCompletion }, currentUserId);
		if (!article?.id) throw error(500, UNKNOWN_ERROR_MESSAGE);

		return { article, suggestions: parsedCompletion.suggestions };
	}
	// publish: async ({ request, locals }) => {
	// 	const article = await publishArticle(request, locals);
	// 	if (!article) return fail(400, { error: 'Article could not be published' });

	// 	throw redirect(303, `/article/${article.id}`);
	// }
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

// function setDefaultValues(formData: FormData, currentUserId: string, prompt: string) {
// 	const messages = getInitialChatCompletionRequest(prompt);
// 	formData.append('messages', miniStringify(messages)); // Set the starting messages
// 	formData.append('status', ArticleStatus.DRAFT); // Set the default status
// 	formData.append('user', currentUserId); // Set the author
// }

// Get completion from AI and try to parse it
async function getArticleCompletion(
	currentUserId: string,
	messages: Message[]
): Promise<CompletionResponse> {
	const completionUserPrompt = generateCompletionUserPrompt(
		ARTICLE_SYSTEM_PROMPT,
		currentUserId,
		messages
	);

	let completionResponse: CompletionResponse;
	let retries = 0;

	do {
		// HACK: If we're in the test environment, mock the completion response.
		// Couldn't figure out a better way to mock the response from Playwright.
		const completion = isTestEnvironment
			? getCompletionFromMock(completionUserPrompt)
			: await getCompletionFromAI(completionUserPrompt);

		// Break out of the retry loop if we get a valid completion
		completionResponse = parseArticleCompletion(completion);
		if (completionResponse.parsedCompletion) break;

		// Wait 2 seconds before retrying again
		// But in the test environment don't wait otherwise the test will timeout
		if (!isTestEnvironment) await new Promise((resolve) => setTimeout(resolve, 2000));

		retries++;
	} while (retries < 3);

	return completionResponse;
}

// Parses the completion from OpenAI and checks the format of the fields is correct
function parseArticleCompletion(completionResponse: CompletionResponse): CompletionResponse {
	const cantGenerateError = {
		status: 400,
		message: "Couldn't generate an article based on your last prompt, try a different one",
		completion: null
	};

	// If the completion is not 200 or 400, it means that the response has an API error,
	// we assume we can't parse the `unformattedCompletion` and we return it as-is.
	if (![200, 400].includes(completionResponse.status)) return completionResponse;

	// If the `unformattedCompletion` is missing we also can't parse it
	if (!completionResponse.completion) return cantGenerateError;

	// Sometimes AI will return a completion that has extra text so we can't parse
	// the JSON directly. We need to find the start and end of the JSON object
	// and then parse it.
	const { completion } = completionResponse;
	const startIndex = completion.indexOf('{');
	const endIndex = completion.lastIndexOf('}') + 1;
	const jsonString = completion.slice(startIndex, endIndex);

	let fields: ArticleCompletion | undefined;

	try {
		fields = JSON.parse(jsonString);
	} catch (err) {
		logEventToSlack('/lib/article.server.ts: getFieldsFromCompletion', `${err} // ${completion}`);

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
		completion: completionResponse.completion,
		parsedCompletion: fields
	};
}
