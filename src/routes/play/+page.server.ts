import { generateArticle, getFieldsFromCompletion } from '$lib/article.server';
import { getCompletionFromAI } from '$lib/openai.server';
import { handlePocketbaseError } from '$lib/pocketbase.server';
import { logEventToSlack } from '$lib/slack.server';
import { error, redirect } from '@sveltejs/kit';
import type { BaseAuthStore } from 'pocketbase';

import type { Actions } from './$types';

export const actions: Actions = {
	generate: async ({ request, locals }) => {
		// Redirect to login if no user is set in locals
		if (!locals?.user) throw redirect(303, '/login');

		const formData = await request.formData();

		// Check that the prompt exists, is greater than 10 character and less than 280
		const prompt = formData.get('prompt')?.toString();
		if (!prompt) return { errors: ['prompt', 'Prompt was not provided'] };
		if (prompt.length < 10) return { errors: ['prompt', 'Prompt is too short'] };
		if (prompt.length > 290) return { errors: ['prompt', 'Prompt is greater than 280 characters'] };

		formData.append('status', 'draft'); // Set the default status
		formData.append('user', locals.user.id); // Set the author

		let articleCollection: BaseAuthStore['model'] = null;

		// Create the draft article
		try {
			articleCollection = await locals.pb.collection('articles').create(formData);
		} catch (err) {
			logEventToSlack("PLAY: couldn't create article collection", err);
			handlePocketbaseError(err);
		}

		if (!articleCollection) throw error(400, 'Prompt could not be saved');

		// Get completion from OpenAI and parse it
		const completion = await getCompletionFromAI(prompt);
		const fieldsFromCompletion = getFieldsFromCompletion(completion);

		// // Update the article with the completion
		try {
			articleCollection = await locals.pb
				.collection('articles')
				.update(
					articleCollection.id,
					{ completion, ...fieldsFromCompletion, user: locals.user.id },
					{ expand: 'user' }
				);
		} catch (err) {
			logEventToSlack("PLAY: couldn't update article collection with completion", err);
			handlePocketbaseError(err);
		}

		if (!fieldsFromCompletion)
			throw error(400, 'AI tried to generate the article but was in the wrong format');

		// Generate the article for frontend
		const article = generateArticle(articleCollection);
		if (!article) throw error(400, 'Article could not be generated');
		article.isPlaceholder = false;

		return article;
	},
	publish: async ({ request, locals }) => {
		const formData = await request.formData();
		const articleId = formData.get('articleId')?.toString();

		if (!locals?.user || !articleId) throw error(400, "Can't publish the article");

		formData.append('status', 'published');
		formData.append('user', locals.user.id);

		let articleCollection: BaseAuthStore['model'] = null;

		try {
			articleCollection = await locals.pb.collection('articles').update(articleId, formData);
		} catch (err) {
			logEventToSlack("PLAY: coudn't publish article", err);
			handlePocketbaseError(err);
		}
		if (!articleCollection) throw error(400, 'Article could not be published');

		throw redirect(303, `/article/${articleCollection.id}`);
	}
};
