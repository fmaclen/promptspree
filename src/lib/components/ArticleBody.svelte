<script lang="ts">
	import type { Article } from '$lib/articles';
	import ArticleCategory from '$lib/components/ArticleCategory.svelte';

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

		{#if article.audioSrc}
			<nav class="article__audio">
				<p class="article__beta" title="Coming soon">Plus</p>
				<audio controls src={article.audioSrc} preload="none" class="article__player" />
			</nav>
		{/if}
	{:else}
		<ArticlePlaceholder {isLoading} />
	{/if}
</article>

<style lang="scss">
	article.article {
		border-top-left-radius: var(--border-radius-l);
		border-top-right-radius: var(--border-radius-l);
		background-color: var(--color-white);
		display: flex;
		flex-direction: column;
		padding: 32px;
		row-gap: 12px;
	}

	h1.article__headline {
		font-weight: 600;
		letter-spacing: -0.025em;
		margin: 0;
		line-height: 1em;
		color: hsl(0, 0%, 10%);

		font-size: 32px;
		margin-bottom: 16px;
	}

	p.article__p {
		font-size: 15px;
		margin: 0;
		color: hsl(0, 0%, 40%);
		line-height: 1.5em;
	}

	nav.article__audio {
		display: flex;
		width: 100%;
		background-color: #f2f3f4;
		border-radius: var(--border-radius-l);
		margin-top: 20px;
		align-items: center;
	}

	audio.article__player {
		width: 100%;
	}

	p.article__beta {
		font-size: 12px;
		font-weight: 600;
		margin: 0;
		color: var(--color-accent);
		line-height: 1em;
		padding: 8px;
		border-radius: var(--border-radius-m);
		border: 1px solid var(--color-accent);
		cursor: help;
		margin-left: 16px;
	}
</style>
