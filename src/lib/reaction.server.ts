import type { ReactionCollection } from './pocketbase.schema';
import { pbClient } from './pocketbase.server';
import { Reaction, type ReactionByType, type Reactions } from './reaction';

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
		// eslint-disable-next-line no-empty
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
		// eslint-disable-next-line no-empty
	}

	return collection;
}

export function calculateReactionsFromCollection(
	reactionsCollection?: ReactionCollection[],
	currentUserId?: string
): Reactions {
	// Initialize an array of objects to track the total count of each reaction type
	const byType: ReactionByType[] = Object.values(Reaction).map((reaction, index) => ({
		index,
		reaction,
		total: 0
	}));

	// Initialize variables to track the total count of reactions and the current user's reaction
	let total = 0;
	let byCurrentUser: number | undefined;

	// If the reactions collection is defined, loop through each collection and update the counts
	if (reactionsCollection) {
		reactionsCollection.forEach((reactionCollection) => {
			const reaction = parseInt(reactionCollection.reaction);

			byType[reaction].total++; // Increment the total count of the reaction type
			total++; // Increment the total count of reactions

			// Check if the current user has reacted to this collection and update the byCurrentUser variable if so
			if (reactionCollection.user === currentUserId) byCurrentUser = reaction;
		});
	}

	// Sort reactions by most reacted type
	byType.sort((a, b) => b.total - a.total);

	// If the current user hasn't reacted to any collection, set the byCurrentUser variable to 0
	return { total, byType, byCurrentUser: byCurrentUser ?? 0 };
}

export async function createReactionCollection(formData: FormData): Promise<ReactionCollection | null> {
	let createdReactionCollection: ReactionCollection | null = null;

	try {
		const pb = await pbClient();
		createdReactionCollection = await pb.collection('reactions').create(formData);
	} catch (_) {
		// eslint-disable-next-line no-empty
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
		// eslint-disable-next-line no-empty
	}

	return updatedReactionCollection;
}

export async function deleteReactionCollection(reactionCollection: ReactionCollection) {
	try {
		const pb = await pbClient();
		await pb.collection('reactions').delete(reactionCollection.id);
	} catch (_) {
		// eslint-disable-next-line no-empty
	}
}
