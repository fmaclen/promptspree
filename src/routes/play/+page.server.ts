import { redirect, error } from '@sveltejs/kit';
import { getCompletionFromAI } from '$lib/openai.server';
import { handlePocketbaseError, pb, serializeNonPOJOs } from '$lib/pocketbase.server';
import { generateArticle, getFieldsFromCompletion } from '$lib/article.server';
import type { BaseAuthStore } from 'pocketbase';
import type { Actions } from './$types';

export const actions = {
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
			articleCollection = serializeNonPOJOs(await pb.collection('articles').create(formData));
		} catch (err) {
			handlePocketbaseError(err);
		}

		if (!articleCollection) throw error(400, 'Prompt could not be saved');

		// Get completion from OpenAI and parse it
		const completion = await getCompletionFromAI(prompt);
		const fieldsFromCompletion = getFieldsFromCompletion(completion);

		if (!fieldsFromCompletion) throw error(400, 'AI generated article but was in the wrong format');

		// // Update the article with the completion
		try {
			articleCollection = serializeNonPOJOs(
				await pb
					.collection('articles')
					.update(articleCollection.id, { completion, ...fieldsFromCompletion }, { expand: 'user' })
			);
		} catch (err) {
			handlePocketbaseError(err);
		}

		// Generate the article for frontend
		const article = generateArticle(articleCollection);
		if (!article) throw error(400, 'Article could not be generated');
		article.isPlaceholder = false;

		return article;
	}
	// publish: async ({ request }) => {
	// 	const body = Object.fromEntries(await request.formData());

	// 	return {
	// 		status: 200,
	// 		message: 'this is a test for PUBLISHING'
	// 	};
	// }
} satisfies Actions;
