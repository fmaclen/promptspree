import { deleteArticle, getArticle, publishArticle } from '$lib/articles.server';
import type { ReactionCollection } from '$lib/pocketbase.schema';
import type { Reaction, Reactions } from '$lib/reactions';
import { calculateReactionsFromCollection } from '$lib/reactions';
import {
	createReactionCollection,
	deleteReactionCollection,
	getReactionCollection,
	getReactionsCollection,
	updateReactionCollection
} from '$lib/reactions.server';
import { type Actions, error, redirect } from '@sveltejs/kit';

import { getArticleAndUserIds } from '$lib/articles';
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
		const reaction = formData.get('reaction')?.toString() as Reaction;

		if (!articleId || !reaction) throw error(400, "Can't react to the article");

		const userReactionCollection: ReactionCollection | null = await getReactionCollection(
			articleId,
			currentUserId
		);
		const reactionId = userReactionCollection?.id;

		// Check if the user has already reacted to the article
		if (reactionId) {
			if (userReactionCollection.reaction === reaction) {
				// If the existing reaction is the same as the new reaction, delete the reaction
				await deleteReactionCollection(reactionId);
			} else {
				// If the existing reaction is different from the new reaction, update the reaction
				await updateReactionCollection(reactionId, reaction);
			}
		} else {
			// If the user hasn't reacted to the article, create a new reaction
			await createReactionCollection(articleId, currentUserId, reaction);
		}

		// Get all the reactions again
		const reactionsCollection: ReactionCollection[] = await getReactionsCollection(articleId);

		return calculateReactionsFromCollection(reactionsCollection, currentUserId);
	},
	delete: async ({ request, locals }) => {
		const { articleId, currentUserId } = await getArticleAndUserIds(request, locals);
		await deleteArticle(articleId, currentUserId);
		throw redirect(303, `/profile/${currentUserId}`);
	},
	publish: async ({ request, locals }) => {
		const { articleId, currentUserId } = await getArticleAndUserIds(request, locals);
		await publishArticle(articleId, currentUserId);
		throw redirect(303, `/profile/${currentUserId}`);
	}
};
