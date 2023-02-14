import { type Article, ArticleStatus } from './article';

export const getPromptScore = (articles: Article[]): number => {
	return articles.reduce((acc, article) => {
		if (article.status !== ArticleStatus.PUBLISHED) return acc;

		return acc + article.reactions.total;
	}, 0);
};
