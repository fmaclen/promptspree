import type { ReactionCollection } from './pocketbase.schema';
import { pbClient } from './pocketbase.server';

export async function getReactionCollection(
	articleId: string,
	currentUserId: string
): Promise<ReactionCollection | null> {
	let reactionCollection: ReactionCollection | null = null;

	try {
		const pb = await pbClient();
		reactionCollection = await pb
			.collection('reactions')
			.getFirstListItem(`article="${articleId}" && user="${currentUserId}"`);
	} catch (_) {
		return null;
	}

	return reactionCollection;
}

export async function getReactionsCollection(articleId?: string): Promise<ReactionCollection[]> {
	let collection: ReactionCollection[] = [];

	try {
		const pb = await pbClient();
		collection = await pb.collection('reactions').getFullList(undefined, {
			filter: `article="${articleId}"`
		});
	} catch (_) {
		return [];
	}

	return collection;
}

export async function createReactionCollection(formData: FormData): Promise<ReactionCollection | null> {
	let createdReactionCollection: ReactionCollection | null = null;

	try {
		const pb = await pbClient();
		createdReactionCollection = await pb.collection('reactions').create(formData);
	} catch (_) {
		return null;
	}

	return createdReactionCollection;
}

export async function updateReactionCollection(
	reactionCollection: ReactionCollection,
	formData: FormData
): Promise<ReactionCollection | null> {
	let updatedReactionCollection: ReactionCollection | null = null;

	try {
		const pb = await pbClient();
		updatedReactionCollection = await pb
			.collection('reactions')
			.update(reactionCollection.id, formData);
	} catch (_) {
		return null;
	}

	return updatedReactionCollection;
}

export async function deleteReactionCollection(reactionCollection: ReactionCollection) {
	try {
		const pb = await pbClient();
		await pb.collection('reactions').delete(reactionCollection.id);
	} catch (_) {
		return null;
	}
}
