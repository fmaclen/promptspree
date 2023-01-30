export interface ArticleReaction {
	reaction: Reaction;
	sum: number;
}

export interface Article {
	updated: string;
	author: string;
	headline: string;
	keywords: string[];
	body: string[];
	reactions: ArticleReaction[] | null;
	userReaction: Reaction | number | null;
	id?: string;
	prompt?: string;
	imageURL?: string;
	isPlaceholder?: boolean;
}

export const PLACEHOLDER_ARTICLE: Article = {
	updated: new Date().toISOString(),
	author: 'Poncio',
	headline: 'Flibbertigibbet Jibber-jabber Jiggery-pokery',
	keywords: ['placeholder', 'Flibbertigibbet', 'pokery'],
	body: [
		'The first thing to know about flibbertigibbet jibber-jabber jiggery-pokery is that it is a complex and multi-faceted phenomenon. At its core, it is a form of communication that is characterized by its nonsensical and seemingly random nature.',
		'Despite its apparent lack of meaning, however, flibbertigibbet jibber-jabber jiggery-pokery has been found to be a powerful tool for expressing deep emotions and ideas.'
	],
	reactions: null,
	userReaction: null,
	id: undefined,
	prompt: undefined,
	imageURL: undefined,
	isPlaceholder: true
};

export enum Reaction {
	MIND_BLOWN = '🤯',
	ROFL = '🤣',
	UNSURE = '🤔',
	MEH = '😒',
	GRIMACE = '😬'
}

export enum ArticleStatus {
	DRAFT = 'DRAFT',
	PUBLISHED = 'PUBLISHED'
}
