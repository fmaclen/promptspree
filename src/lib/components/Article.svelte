<script lang="ts">
	import { ArticleSize, type Article } from '$lib/articles';
	import ArticleMetadata from '$lib/components/ArticleMetadata.svelte';

	export let article: Article;
	export let isActionable: boolean = false;
	export let size: ArticleSize;
</script>

<div class={`article article--${size}`}>
	<ArticleMetadata {article} {isActionable} {size} />

	<div class={`article__container article__container--${size}`}>
		{#if size === ArticleSize.FULL}
			<header class="article__header">
				<h2 class="article__h2">
					{article.category}
				</h2>

				<h1 class="article__h1 article__h1--full">
					{article.headline}
				</h1>
			</header>

			<div class="article__body">
				{#each article.body as paragraph}
					<p class="article__p article__p--full">{paragraph}</p>
				{/each}
			</div>
		{/if}

		{#if size === ArticleSize.MEDIUM}
			<header class="article__header">
				<h2 class="article__h2">
					{article.category}
				</h2>

				<a class="article__a" href="/article/{article.id}">
					<h1 class="article__h1">
						{article.headline}
					</h1>
				</a>
			</header>
			<p class="article__p">{article.body[0]}</p>
		{/if}
	</div>
</div>

<style lang="scss">
	div.article {
		display: grid;
		grid-template-columns: 1fr 2fr 1fr;
		gap: 56px;

		@media (max-width: 1024px) {
			grid-template-columns: 1fr 2fr;
		}

		@media (max-width: 768px) {
			display: flex;
			flex-direction: column-reverse;
		}
	}

	a.article__a {
		text-decoration: none;

		&:hover {
			h1.article__h1 {
				color: var(--color-primary);
			}
		}
	}

	header.article__header {
		display: flex;
		flex-direction: column;
		row-gap: 8px;
	}

	div.article__container {
		display: flex;
		flex-direction: column;
		row-gap: 8px;

		&--full {
			row-gap: 32px;
		}
	}

	h1.article__h1 {
		font-weight: 600;
		letter-spacing: -0.025em;
		margin: 0;
		font-size: 24px;
		line-height: 1.2em;
		color: var(--color-neutral-100);

		&--full {
			font-size: 40px;
		}
	}

	h2.article__h2 {
		font-size: 14px;
		font-weight: 600;
		margin: 0;
		color: var(--color-primary);
	}

	div.article__body {
		display: flex;
		flex-direction: column;
		row-gap: 16px;
	}

	p.article__p {
		margin: 0;
		font-size: 14px;
		line-height: 1.5em;
		color: var(--color-neutral-200);

		&--full {
			font-size: 18px;
		}
	}
</style>
