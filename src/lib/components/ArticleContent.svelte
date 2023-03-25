<script lang="ts">
	import { type Article, ArticleSize } from '$lib/articles';
	import ArticleBody from '$lib/components/ArticleBody.svelte';
	import ArticleHeader from '$lib/components/ArticleHeader.svelte';

	export let article: Article;
	export let size: ArticleSize;
</script>

<article class={`article-content article-content--${size}`}>
	<ArticleHeader {article} {size} />
	<ArticleBody {article} {size} />

	{#if article.audioSrc && size === ArticleSize.FULL}
		<nav class="article__audio">
			<p class="article__beta" title="Coming soon, hopefully!">Plus</p>
			<audio controls src={article.audioSrc} preload="none" class="article__player" />
		</nav>
	{/if}
</article>

<style lang="scss">
	article.article-content {
		display: flex;
		flex-direction: column;
		row-gap: 8px;

		&--full {
			row-gap: 32px;
		}
	}

	nav.article__audio {
		display: flex;
		width: 100%;
		background-color: #f2f3f4;
		border-radius: var(--border-radius-l);
		align-items: center;
		filter: invert(1);
	}

	audio.article__player {
		width: 100%;
	}

	p.article__beta {
		font-size: 12px;
		font-weight: 600;
		margin: 0;
		line-height: 1em;
		padding: 8px;
		cursor: help;
		margin-left: 16px;
		border-radius: var(--border-radius-l);
		color: var(--color-secondary);
		border: 1px solid var(--color-secondary);
		filter: invert(1);
	}
</style>
