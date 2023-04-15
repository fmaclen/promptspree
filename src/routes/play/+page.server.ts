import {
	ARTICLE_SYSTEM_PROMPT,
	type Article,
	type ArticleCompletion,
	ArticleStatus,
	isCategoryValid
} from '$lib/articles';
import { createArticleCollection, getArticle, updateArticleCollection } from '$lib/articles.server';
import { type Message, MessageRole } from '$lib/messages';
import { createMessageCollection, getMessage } from '$lib/messages.server';
import type { CompletionResponse } from '$lib/openai';
import { generateCompletionUserPrompt, getCompletionFromAI } from '$lib/openai.server';
import type { ArticleCollection } from '$lib/pocketbase.schema';
import { logEventToSlack } from '$lib/slack.server';
import { getCompletionFromMock } from '$lib/tests';
import { UNKNOWN_ERROR_MESSAGE, isTestEnvironment } from '$lib/utils';
import { error, fail, redirect } from '@sveltejs/kit';

import type { PageServerLoad } from '../$types';
import type { Actions } from './$types';

export const load: PageServerLoad = async ({ url, locals }) => {
	if (!locals.pb.authStore.isValid) throw redirect(303, '/join');

	const articleParams = new URLSearchParams(url.search);
	const articleId = articleParams.get('articleId');

	if (articleId) {
		const article = await getArticle(locals, articleId);
		const messages = article?.messages || [];

		if (!article) throw error(404, 'Article not found');
		if (article.status === ArticleStatus.PUBLISHED) throw redirect(303, `/article/${article.id}`);

		return { article, messages };
	}
};

export const actions: Actions = {
	generate: async ({ request, locals }) => {
		// Redirect to login if no user is set in locals
		const currentUserId = locals?.user?.id;
		if (!currentUserId) throw redirect(303, '/login');

		const formData = await request.formData();
		const articleId = formData.get('articleId')?.toString();
		const prompt = formData.get('prompt')?.toString();
		const promptError = validatePrompt(prompt);
		if (promptError) return fail(400, { error: promptError });

		let article: ArticleCollection | Article | null = null;
		let messages: Message[] = [];

		if (articleId) {
			// Get existing article and it's messages (if any)
			article = await getArticle(locals, articleId);
			messages = article?.messages || [];
		} else {
			// Create a new article
			article = await createArticleCollection(locals, ArticleStatus.DRAFT);
		}

		if (!article?.id) throw error(500, UNKNOWN_ERROR_MESSAGE);

		// Save user prompt as a message
		const userMessage = await createMessageCollection(
			locals,
			article.id,
			MessageRole.USER,
			prompt as string // NOTE: validatePrompt() ensures that prompt is a string
		);
		if (!userMessage) throw error(500, UNKNOWN_ERROR_MESSAGE);

		messages.push(userMessage);

		const completionResponse = await getArticleCompletion(currentUserId, messages);
		const { status, message, parsedCompletion } = completionResponse;

		if (status !== 200 || !parsedCompletion) {
			await updateArticleCollection(locals, article.id, { status: ArticleStatus.FAILED });
			return fail(status, { error: message });
		}

		// Save AI completion as a message
		const assistantMessage = await createMessageCollection(
			locals,
			article.id,
			MessageRole.ASSISTANT,
			parsedCompletion
		);
		if (!assistantMessage) throw error(500, UNKNOWN_ERROR_MESSAGE);
		messages.push(assistantMessage);

		// Update the article with the completion
		article = await updateArticleCollection(locals, article.id, {
			...parsedCompletion,
			status: ArticleStatus.DRAFT
		});
		if (!article?.id) throw error(500, UNKNOWN_ERROR_MESSAGE);

		return {
			article,
			messages: structuredClone(messages),
			suggestions: parsedCompletion.suggestions
		};
	},
	publish: async ({ request, locals }) => {
		const formData = await request.formData();
		const articleId = formData.get('articleId')?.toString() || '';
		const messageId = formData.get('messageId')?.toString() || '';

		const message = await getMessage(locals, messageId);
		if (!message || !message.content || typeof message.content === 'string')
			throw error(500, UNKNOWN_ERROR_MESSAGE);

		const { category, headline, body } = message.content;

		await updateArticleCollection(locals, articleId, {
			category: category,
			headline: headline,
			body: body,
			status: ArticleStatus.PUBLISHED
		});

		throw redirect(303, `/profile/${locals?.user?.id}`);
	}
};

function validatePrompt(prompt: string | undefined): string | null {
	// Check that the prompt exists, is greater than 10 character and less than 280
	if (!prompt) return 'Prompt was not provided';
	if (prompt.length < 10) return 'Prompt is too short';
	if (prompt.length > 290) return 'Prompt is greater than 280 characters';

	// TODO: Check that prompt doesn't violete the moderation rules

	return null;
}

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
