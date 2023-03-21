import type { ReactionCollection } from '$lib/pocketbase.schema';
import { pbAdmin } from '$lib/pocketbase.server';
import type { Reaction } from '$lib/reactions';

export async function getReactionCollection(
	articleId: string,
	currentUserId: string
): Promise<ReactionCollection | null> {
	try {
		const pb = await pbAdmin();
		const reactionCollection: ReactionCollection | null = await pb
			.collection('reactions')
			.getFirstListItem(`article="${articleId}" && user="${currentUserId}"`);

		return reactionCollection;
	} catch (_) {
		return null;
	}
}

export async function getReactionsCollection(articleId?: string): Promise<ReactionCollection[]> {
	try {
		const pb = await pbAdmin();
		const collection: ReactionCollection[] = await pb
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
	articleId: string,
	currentUserId: string,
	reaction: Reaction
): Promise<ReactionCollection | null> {
	try {
		const pb = await pbAdmin();
		const createdReactionCollection: ReactionCollection | null = await pb
			.collection('reactions')
			.create({ reaction, article: articleId, user: currentUserId });

		return createdReactionCollection;
	} catch (_) {
		return null;
	}
}

export async function updateReactionCollection(
	reactionId: string,
	reaction: Reaction
): Promise<ReactionCollection | null> {
	try {
		const pb = await pbAdmin();
		const updatedReactionCollection: ReactionCollection | null = await pb
			.collection('reactions')
			.update(reactionId, { reaction });

		return updatedReactionCollection;
	} catch (_) {
		return null;
	}
}

export async function deleteReactionCollection(reactionId: string) {
	try {
		const pb = await pbAdmin();
		await pb.collection('reactions').delete(reactionId);
	} catch (_) {
		return null;
	}
}
