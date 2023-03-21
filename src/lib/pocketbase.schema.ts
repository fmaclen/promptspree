import type { ArticleCategory, ArticleStatus } from '$lib/articles';
import type { ArticleCompletion } from '$lib/articles';
import type { MessageRole } from '$lib/messages';
import type { Reaction } from '$lib/reactions';

export interface BaseCollection {
	id?: string;
	created?: Date;
	updated?: Date;
	collectionId?: string;
}

export interface UserCollection extends BaseCollection {
	email: string;
	nickname: string;
	terms: string;
}

export interface ArticleCollection extends BaseCollection {
	headline?: string;
	status?: ArticleStatus;
	body?: string[];
	category?: ArticleCategory;
	model?: string;
	audio?: string[];
	image?: string[];
	expand?: {
		user: UserCollection;
		['messages(article)']?: MessageCollection[];
		['reactions(article)']?: ReactionCollection[];
	};
}

export interface ReactionCollection extends BaseCollection {
	user: string;
	article: string;
	reaction: Reaction;
}

export interface MessageCollection extends BaseCollection {
	article?: string;
	role?: MessageRole;
	content?: ArticleCompletion | string;
}
