<script lang="ts">
	import { type Article, ArticleSize } from '$lib/articles';

	export let article: Article;
	export let size: ArticleSize;

	const isSizeFull = size === ArticleSize.FULL;
</script>

<header class="article__header">
	<h2 class="article__h2">{article.category}</h2>

	{#if isSizeFull}
		<h1 class="article__h1 article__h1--full">{article.headline}</h1>
	{:else}
		<a class="article__a" href="/article/{article.id}">
			<h1 class="article__h1">{article.headline}</h1>
		</a>
	{/if}
</header>

<style lang="scss">
	header.article__header {
		display: flex;
		flex-direction: column;
		row-gap: 8px;
	}

	h1.article__h1 {
		color: var(--color-neutral-100);

		&:not(.article__h1--full) {
			@include headline-l;
		}

		&--full {
			@include headline-xxl;
			font-size: 40px;
		}

		@media (max-width: 768px) {
			font-size: 20px;

			&--full {
				font-size: 32px;
			}
		}
	}

	h2.article__h2 {
		@include subtitle-m;
		color: var(--color-green);
	}

	a.article__a {
		text-decoration: none;

		&:hover {
			h1.article__h1 {
				color: var(--color-green);
			}
		}
	}
</style>
