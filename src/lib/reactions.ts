import type { ReactionCollection } from '$lib/pocketbase.schema';

export enum Reaction {
	MIND_BLOWN = '🤯',
	ROFL = '🤣',
	UNSURE = '🤔',
	MEH = '😒',
	GRIMACE = '😬'
}

export interface ReactionByType {
	index: number;
	reaction: Reaction;
	total: number;
}

export interface Reactions {
	total: number;
	byType: ReactionByType[];
	byCurrentUser: Reaction | number | null;
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
	let byCurrentUser: number | null = null;

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
	return { total, byType, byCurrentUser: byCurrentUser };
}
