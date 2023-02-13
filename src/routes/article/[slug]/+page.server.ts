import { deleteArticle, generateArticle } from '$lib/article.server';
import { logEventToSlack } from '$lib/slack.server';
import { type Actions, error } from '@sveltejs/kit';
import type { BaseAuthStore } from 'pocketbase';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!params.slug) throw error(404, 'Not found');

	let articleCollection: BaseAuthStore['model'] = null;
	try {
		articleCollection = await locals.pb
			.collection('articles')
			.getOne(params.slug, { expand: 'user' });
	} catch (_) {
		// eslint-disable-next-line no-empty
	}

	const article = await generateArticle(articleCollection, locals);
	if (!article) throw error(404, 'Not found');

	return { article };
};

export const actions: Actions = {
	react: async ({ request, locals, params }) => {
		const formData = await request.formData();
		const articleId = params.slug;
		const reaction = formData.get('reaction')?.toString();

		if (!locals?.user || !articleId || !reaction) throw error(400, "Can't react to the article");

		let articleCollection: BaseAuthStore['model'] = null;
		let reactionCollection: BaseAuthStore['model'] = null;

		// Check if the article exists
		try {
			articleCollection = await locals.pb
				.collection('articles')
				.getOne(articleId, { expand: 'user' });
		} catch (_) {
			// eslint-disable-next-line no-empty
		}

		// It should be rare that we hit this case since the UI is the one defining
		// the `articleId`, but it's still possible that the article is deleted
		// during a long user serssion.
		if (!articleCollection) throw error(404, 'Not found');

		// Append user and article to formData
		formData.append('user', locals.user.id);
		formData.append('article', articleCollection.id || '');

		// Check if the user already reacted to article
		try {
			reactionCollection = await locals.pb
				.collection('reactions')
				.getFirstListItem(`user="${locals.user.id}" && article="${articleCollection.id}"`);
		} catch (_) {
			// eslint-disable-next-line no-empty
		}

		// Create, update or delete reaction
		try {
			if (reactionCollection) {
				if (reactionCollection?.reaction === reaction) {
					// Delete it
					await locals.pb.collection('reactions').delete(reactionCollection.id);
				} else {
					// Update it
					reactionCollection = await locals.pb
						.collection('reactions')
						.update(reactionCollection.id, formData);
				}
			} else {
				// Create it
				reactionCollection = await locals.pb.collection('reactions').create(formData);
			}
		} catch (err) {
			return handleErrors(err);
		}

		const article = await generateArticle(articleCollection, locals);
		if (!article) throw error(404, 'Not found');

		return { article };
	},
	delete: async ({ request, locals }) => {
		await deleteArticle(request, locals);
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
