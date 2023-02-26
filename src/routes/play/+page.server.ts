import { env } from '$env/dynamic/private';
import { ArticleStatus } from '$lib/article';
import { generateArticle, getFieldsFromCompletion, publishArticle } from '$lib/article.server';
import { type CompletionUserPrompt, getCompletionFromAI } from '$lib/openai.server';
import { handlePocketbaseError } from '$lib/pocketbase.server';
import { logEventToSlack } from '$lib/slack.server';
import { getCompletionFromMock } from '$lib/tests';
import { fail, redirect } from '@sveltejs/kit';
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
		if (prompt.length > 290)
			return fail(400, { fieldError: ['prompt', 'Prompt is greater than 280 characters'] });

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

		if (!articleCollection)
			return fail(401, {
				error: 'Prompt could not be saved'
			});

		// Get completion from OpenAI and parse it

		// HACK: If we're in the test environment, mock the completion response.
		// Couldn't figure out a better way to mock the response from Playwright.
		const isTestEnvironment = env.TEST_POCKETBASE_URL !== '';

		const completionUserPrompt: CompletionUserPrompt = { user: locals.user.id, prompt };
		const completion = isTestEnvironment
			? await getCompletionFromMock(completionUserPrompt)
			: await getCompletionFromAI(completionUserPrompt);
		if (completion.status !== 200) return fail(completion.status, { error: completion.message });

		const fieldsFromCompletion = getFieldsFromCompletion(completion.message);

		// // Update the article with the completion
		try {
			articleCollection = await locals.pb.collection('articles').update(
				articleCollection.id,
				{
					completion,
					...fieldsFromCompletion,
					user: locals.user.id,
					status: fieldsFromCompletion ? ArticleStatus.DRAFT : ArticleStatus.FAILED
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
