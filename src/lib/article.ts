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
