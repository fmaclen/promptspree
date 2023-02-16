<script lang="ts">
	import type { Article } from '$lib/article';

	import ArticleCategory from './ArticleCategory.svelte';
	import ArticlePlaceholder from './ArticlePlaceholder.svelte';

	export let article: Article | null;
	export let isLoading: boolean = false;
</script>

<article class="article">
	{#if article}
		<ArticleCategory href="/category/{article.category.toLowerCase()}" category={article.category}>
			{article.category}
		</ArticleCategory>

		<h1 class="article__headline">
			{article.headline}
		</h1>

		{#each article.body as paragraph}
			<p class="article__p">{paragraph}</p>
		{/each}
	{:else}
		<ArticlePlaceholder {isLoading} />
	{/if}
</article>

<style lang="scss">
	article.article {
		border-top-left-radius: 2px;
		border-top-right-radius: 2px;
		background-color: var(--color-white);
		display: flex;
		flex-direction: column;
		padding: 32px;
		row-gap: 12px;
	}

	h1.article__headline {
		font-family: var(--font-serif);
		margin: 0;
		line-height: 1em;
		color: hsl(0, 0%, 10%);

		font-size: 32px;
		margin-bottom: 0.5em;
	}

	p.article__p {
		font-size: 16px;
		margin: 0;
		color: hsl(0, 0%, 40%);
		line-height: 1.5em;
	}
</style>
