<script lang="ts">
	import { type Article, ArticleSize } from '$lib/articles';
	import ArticleLayout from '$lib/components/ArticleLayout.svelte';

	export let articles: Article[];
	export let isActionable: boolean = false;

	interface SizedArticle extends Article {
		size: ArticleSize;
	}

	let sizedArticles: SizedArticle[];
	$: sizedArticles = articles.map((article, index) => {
		if (index <= 7) {
			// The first 7 are medium size
			return { ...article, size: ArticleSize.MEDIUM };
		} else {
			// The rest are small size
			return { ...article, size: ArticleSize.SMALL };
		}
	});
</script>

<ul class="articles">
	{#each sizedArticles as article}
		<li class="articles__li">
			<ArticleLayout {article} {isActionable} size={article.size} />
		</li>
	{/each}
</ul>

<style lang="scss">
	ul.articles {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	li.articles__li {
		&:not(:first-child) {
			padding-top: 24px;
		}

		&:not(:last-child) {
			padding-bottom: 24px;
			border-bottom: 1px solid var(--color-neutral-600);
		}
	}
</style>
