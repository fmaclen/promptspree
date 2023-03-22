import type { ReactionCollection } from '$lib/pocketbase.schema';
import type { Reaction } from '$lib/reactions';

export async function getReactionCollection(
	locals: App.Locals,
	articleId: string
): Promise<ReactionCollection | null> {
	try {
		const reactionCollection: ReactionCollection | null = await locals.pbAdmin
			.collection('reactions')
			.getFirstListItem(`article="${articleId}" && user="${locals.user?.id}"`);

		return reactionCollection;
	} catch (_) {
		return null;
	}
}

export async function getReactionsCollection(
	locals: App.Locals,
	articleId?: string
): Promise<ReactionCollection[]> {
	try {
		const collection: ReactionCollection[] = await locals.pbAdmin
			.collection('reactions')
			.getFullList(undefined, {
				filter: `article="${articleId}"`
			});

		return collection;
	} catch (_) {
		return [];
	}
}

export async function createReactionCollection(
	locals: App.Locals,
	articleId: string,
	reaction: Reaction
): Promise<ReactionCollection | null> {
	try {
		const createdReactionCollection: ReactionCollection | null = await locals.pbAdmin
			.collection('reactions')
			.create({ reaction, article: articleId, user: locals.user?.id });

		return createdReactionCollection;
	} catch (_) {
		return null;
	}
}

export async function updateReactionCollection(
	locals: App.Locals,
	reactionId: string,
	reaction: Reaction
): Promise<ReactionCollection | null> {
	try {
		const updatedReactionCollection: ReactionCollection | null = await locals.pbAdmin
			.collection('reactions')
			.update(reactionId, { reaction });

		return updatedReactionCollection;
	} catch (_) {
		return null;
	}
}

export async function deleteReactionCollection(locals: App.Locals, reactionId: string) {
	try {
		await locals.pbAdmin.collection('reactions').delete(reactionId);
	} catch (_) {
		return null;
	}
}
