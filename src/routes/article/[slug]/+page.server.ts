import { ArticleStatus, getArticleAndUserIds } from '$lib/articles';
import { deleteArticle, getArticle, getArticles, publishArticle } from '$lib/articles.server';
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

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const article = await getArticle(locals, params.slug);

	const suggestedArticles = await getArticles(locals, `status = "${ArticleStatus.PUBLISHED}"`)

	if (article) {
		return { article, suggestedArticles };
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
			locals,
			articleId
		);
		const reactionId = userReactionCollection?.id;

		// Check if the user has already reacted to the article
		if (reactionId) {
			if (userReactionCollection.reaction === reaction) {
				// If the existing reaction is the same as the new reaction, delete the reaction
				await deleteReactionCollection(locals, reactionId);
			} else {
				// If the existing reaction is different from the new reaction, update the reaction
				await updateReactionCollection(locals, reactionId, reaction);
			}
		} else {
			// If the user hasn't reacted to the article, create a new reaction
			await createReactionCollection(locals, articleId, reaction);
		}

		// Get all the reactions again
		const reactionsCollection: ReactionCollection[] = await getReactionsCollection(
			locals,
			articleId
		);

		return calculateReactionsFromCollection(reactionsCollection, currentUserId);
	},
	delete: async ({ request, locals }) => {
		const { articleId, currentUserId } = await getArticleAndUserIds(request, locals);
		await deleteArticle(locals, articleId);
		throw redirect(303, `/profile/${currentUserId}`);
	},
	publish: async ({ request, locals }) => {
		const { articleId, currentUserId } = await getArticleAndUserIds(request, locals);
		await publishArticle(locals, articleId);
		throw redirect(303, `/profile/${currentUserId}`);
	}
};
