import { ArticleStatus } from '$lib/articles';
import {
	deleteArticleCollection,
	getArticle,
	isUserAuthorized,
	updateArticleCollection
} from '$lib/articles.server';
import type { ReactionCollection } from '$lib/pocketbase.schema';
import type { Reactions } from '$lib/reaction';
import { calculateReactionsFromCollection } from '$lib/reaction';
import {
	createReactionCollection,
	deleteReactionCollection,
	getReactionCollection,
	getReactionsCollection,
	updateReactionCollection
} from '$lib/reaction.server';
import { type Actions, error, fail, redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const article = await getArticle(params.slug, locals.user?.id);

	if (article) {
		return { article };
	} else {
		throw error(404, 'Article not found');
	}
};

export const actions: Actions = {
	react: async ({ request, locals }): Promise<Reactions> => {
		const currentUserId = locals.user?.id;

		if (!currentUserId) throw error(401, 'You must be logged in to react to an article');

		const formData = await request.formData();
		const articleId = formData.get('article')?.toString();
		const reaction = formData.get('reaction')?.toString();
		formData.append('user', currentUserId);

		if (!articleId || !reaction) throw error(400, "Can't react to the article");

		const userReactionCollection: ReactionCollection | null = await getReactionCollection(
			articleId,
			currentUserId
		);

		// Check if the user has already reacted to the article
		if (userReactionCollection) {
			if (userReactionCollection.reaction === reaction) {
				// If the existing reaction is the same as the new reaction, delete the reaction
				await deleteReactionCollection(userReactionCollection);
			} else {
				// If the existing reaction is different from the new reaction, update the reaction
				await updateReactionCollection(userReactionCollection, formData);
			}
		} else {
			// If the user hasn't reacted to the article, create a new reaction
			await createReactionCollection(formData);
		}

		// Get all the reactions again
		const reactionsCollection: ReactionCollection[] = await getReactionsCollection(articleId);

		return calculateReactionsFromCollection(reactionsCollection, currentUserId);
	},
	delete: async ({ request, locals }) => {
		const formData = await request.formData();
		const articleId = formData.get('articleId')?.toString();

		// Authorize user
		const currentUserId = locals.user?.id;
		const isCurrentUserAuthorized = await isUserAuthorized(articleId, currentUserId);
		if (!isCurrentUserAuthorized || !articleId)
			return fail(401, { error: "Can't delete the article" });

		await deleteArticleCollection(articleId);
		throw redirect(303, `/profile/${currentUserId}`);
	},
	publish: async ({ request, locals }) => {
		const formData = await request.formData();
		const articleId = formData.get('articleId')?.toString();
		formData.append('status', ArticleStatus.PUBLISHED);

		// Authorize user
		const currentUserId = locals.user?.id;
		const isCurrentUserAuthorized = await isUserAuthorized(articleId, currentUserId);
		if (!isCurrentUserAuthorized || !articleId)
			return fail(401, { error: "Can't publish the article" });

		await updateArticleCollection(articleId, formData);
		throw redirect(303, `/profile/${currentUserId}`);
	}
};
