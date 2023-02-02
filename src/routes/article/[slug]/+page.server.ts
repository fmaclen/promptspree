import type { ArticleReaction } from '$lib/article';
import { generateArticle } from '$lib/article.server';
import { handlePocketbaseErrors } from '$lib/pocketbase.server';
import { logEventToSlack } from '$lib/slack.server';
import { type Actions, error } from '@sveltejs/kit';
import type { BaseAuthStore, Record } from 'pocketbase';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!params.slug) throw error(404, 'Not found');

	return getArticleAndReactions(params.slug, locals);
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
			articleCollection = await locals.pb.collection('articles').getOne(articleId);
		} catch (_) {
			// eslint-disable-next-line no-empty
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

		// Return the article with the updated reactions
		return getArticleAndReactions(articleId, locals);
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

// Gets an article with it's reactions and the current user's reaction
const getArticleAndReactions = async (articleId: string, locals: any) => {
	let articleCollection: BaseAuthStore['model'] = null;
	let reactionCollection: Record[];

	try {
		articleCollection = await locals.pb.collection('articles').getOne(articleId, {
			expand: 'user'
		});
		reactionCollection = await locals.pb
			.collection('reactions')
			.getFullList(200, { filter: `article="${articleId}"` });
	} catch (err) {
		logEventToSlack('/article/[slug]/+page.server.ts', err);
		return handlePocketbaseErrors(err);
	}

	if (!articleCollection) throw error(404, 'Not found');

	const article = generateArticle(articleCollection);
	const reactions = generateArticleReactions(reactionCollection);
	const userReaction = locals.user ? generateArticleUserReaction(reactionCollection, locals) : null;

	return { success: true, article: { ...article, reactions, userReaction } };
};

// Calculates the sum of all reactions in an article by reaction type
const generateArticleReactions = (reactionCollection: Record[]) => {
	if (reactionCollection.length === 0) return [];

	const reactions: ArticleReaction[] = [];

	reactionCollection.forEach((item) => {
		const existingReaction = reactions.find((r) => r.reaction === item.reaction);
		if (existingReaction) {
			existingReaction.sum++;
		} else {
			reactions.push({ reaction: item.reaction, sum: 1 });
		}
	});

	return reactions;
};

// Finds the user's reaction to the article from the list of article reactions
const generateArticleUserReaction = (reactionCollection: Record[], locals: any) => {
	const userReaction = reactionCollection.find((item) => item.user === locals?.user?.id);
	if (userReaction) return parseInt(userReaction.reaction);
	return null;
};
