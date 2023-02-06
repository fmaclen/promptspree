export interface ArticleReactions {
	total: number;
	byType: ArticleReactionByType[];
	byCurrentUser?: Reaction | number;
}

export interface ArticleReactionByType {
	index: number;
	reaction: Reaction;
	total: number;
}

// export interface Article {
// 	updated: string;
// 	author: string;
// 	headline: string;
// 	category: ArticleCategory;
// 	body: string[];
// 	reactions: ArticleReactions;
// 	userReaction: Reaction | number | null;
// 	id?: string;
// 	prompt?: string;
// 	imageURL?: string;
// 	isPlaceholder?: boolean;
// }

export interface ArticleAuthor {
	id: string;
	nickname: string;
}

export interface Article {
	updated: string;
	author: ArticleAuthor;
	headline: string;
	category: ArticleCategory;
	body: string[];
	reactions: ArticleReactions;
	id: string;
	prompt: string;
}

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

export enum ArticleCategory {
	BUSINESS = 'Business',
	TECHNOLOGY = 'Technology',
	OPINION = 'Opinion',
	CULTURE = 'Culture',
	POLITICS = 'Politics',
	ENTERTAINMENT = 'Entertainment',
	SPORTS = 'Sports',
	HUMOR = 'Humor',
	TRAVEL = 'Travel',
	HEALTH = 'Health',
	FOOD = 'Food',
	REAL_STATE = 'Real State',
	OTHER = 'Other'
}

// export const PLACEHOLDER_ARTICLE: Article = {
// 	updated: new Date().toISOString(),
// 	user: {
// 		id: 'some-id',
// 		nickname: 'Poncio'
// 	},
// 	headline: 'Flibbertigibbet Jibber-jabber Jiggery-pokery',
// 	category: ArticleCategory.OTHER,
// 	body: [
// 		'The first thing to know about flibbertigibbet jibber-jabber jiggery-pokery is that it is a complex and multi-faceted phenomenon. At its core, it is a form of communication that is characterized by its nonsensical and seemingly random nature.',
// 		'Despite its apparent lack of meaning, however, flibbertigibbet jibber-jabber jiggery-pokery has been found to be a powerful tool for expressing deep emotions and ideas.'
// 	],
// 	reactions: null,
// 	userReaction: null,
// 	id: undefined,
// 	prompt: undefined,
// 	imageURL: undefined,
// 	isPlaceholder: true
// };
