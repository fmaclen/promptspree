import { type Article, ArticleStatus } from '$lib/articles';
import type { UserCollection } from '$lib/pocketbase.schema';

export interface User {
	id: string;
	nickname: string;
}

export function getUser(userCollection: UserCollection): User {
	return {
		id: userCollection.id,
		nickname: userCollection.nickname
	};
}

// Calculate the score of a prompt based on the number of reactions
export const getPromptScore = (articles: Article[]): number => {
	return articles.reduce((acc, article) => {
		if (article.status !== ArticleStatus.PUBLISHED) return acc;

		return acc + (article.reactions ? article.reactions.total : 0);
	}, 0);
};
