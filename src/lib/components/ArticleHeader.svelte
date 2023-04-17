<script lang="ts">
	import { type Article, ArticleSize } from '$lib/articles';
	import Category from '$lib/components/Category.svelte';

	export let article: Article;
	export let size: ArticleSize;

	const isSizeFull = size === ArticleSize.FULL;
</script>

<header class="article__header {isSizeFull ? 'article__header--full' : ''}">
	<Category label={article.category} />

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
		row-gap: 16px;

		&--full {
			grid-area: headline;
		}
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

	a.article__a {
		text-decoration: none;

		&:hover {
			h1.article__h1 {
				color: var(--color-green);
			}
		}
	}
</style>
