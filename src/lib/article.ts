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
	id: string;
	updated: string;
	author: ArticleAuthor;
	status: ArticleStatus;
	category: ArticleCategory;
	headline: string;
	body: string[];
	prompt: string;
	reactions: ArticleReactions;
	audioSrc?: string;
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
	PUBLISHED = 'PUBLISHED',
	FAILED = 'FAILED'
}

export enum ArticleCategory {
	POLITICS = 'Politics',
	BUSINESS = 'Business',
	TECHNOLOGY = 'Technology',
	ENTERTAINMENT = 'Entertainment',
	SCIENCE = 'Science',
	HEALTH = 'Health',
	SPORTS = 'Sports',
	CULTURE = 'Culture',
	FASHION = 'Fashion',
	OPINION = 'Opinion'
}
