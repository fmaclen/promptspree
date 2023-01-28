import { generateArticle } from '$lib/article.server';
import { handlePocketbaseErrors, pb, serializeNonPOJOs } from '$lib/pocketbase.server';
import { logEventToSlack } from '$lib/slack.server';
import { type Actions, error } from '@sveltejs/kit';
import type { BaseAuthStore } from 'pocketbase';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!params.slug || !locals?.user) throw error(404, 'Not found');

	let articleCollection: BaseAuthStore['model'] = null;
	// let reactionCollection: BaseAuthStore['model'] = null;

	try {
		articleCollection = serializeNonPOJOs(
			await pb.collection('articles').getOne(params.slug, {
				expand: 'user'
			})
		);
		// reactionCollection = serializeNonPOJOs(
		// 	await pb
		// 		.collection('reactions')
		// 		.getOne(`user="${locals.user.id}" && article="${params.slug}"`)
		// );
	} catch (err) {
		logEventToSlack('/article/[slug]/+page.server.ts', err);
		return handlePocketbaseErrors(err);
	}

	const article = generateArticle(articleCollection);
	if (!article) throw error(404, 'Not found');

	// console.log(serializeNonPOJOs(reactionCollection));

	return { success: true, article };
};

export const actions: Actions = {
	react: async ({ request, locals, params }) => {
		const formData = await request.formData();
		const articleId = params.slug;
		const reaction = formData.get('reaction')?.toString();

		if (!locals?.user || !articleId || !reaction) throw error(400, "Can't react to the article");

		let articleCollection: BaseAuthStore['model'] = null;
		let reactCollection: BaseAuthStore['model'] = null;

		// Check if the article exists
		try {
			articleCollection = serializeNonPOJOs(await pb.collection('articles').getOne(articleId));
		} catch (_) {
			// eslint-disable-next-line no-empty
			// We expect this to be an error often, so we don't log it
		}

		// It should be rare that we hit this case since the UI is the one defining
		// the `articleId`, but it's still possible that the article is deleted
		// during a long user serssion.
		if (!articleCollection) return handleErrors({ status: 404 });

		// Append user and article to formData
		formData.append('user', locals.user.id);
		formData.append('article', articleCollection.id || '');

		// Check if the user already reacted to article
		try {
			reactCollection = serializeNonPOJOs(
				await pb
					.collection('reactions')
					.getFirstListItem(`user="${locals.user.id}" && article="${articleCollection.id}"`)
			);
		} catch (_) {
			// eslint-disable-next-line no-empty
			// We expect this to be an error often, so we don't log it
		}

		// If reaction exists check if the reaction is the same: delete it
		if (reactCollection?.reaction === reaction) {
			try {
				await pb.collection('reactions').delete(reactCollection.id);
			} catch (err) {
				return handleErrors(err);
			}
			// Don't return anything else
			return;
		}

		// If reaction is different from existing one: update it
		try {
			if (reactCollection) {
				reactCollection = serializeNonPOJOs(
					await pb.collection('reactions').update(reactCollection.id, formData)
				);
			} else {
				// Create a new reaction
				reactCollection = serializeNonPOJOs(await pb.collection('reactions').create(formData));
			}
		} catch (err) {
			return handleErrors(err);
		}

		return { reactCollection };
	}
};

const handleErrors = (err: any) => {
	if (err?.status === 404) {
		throw error(404, 'Article not found');
	} else {
		logEventToSlack('/article/[slug]?/react', err);
		throw error(500);
	}
};
