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
	byCurrentUser?: Reaction | number;
}
