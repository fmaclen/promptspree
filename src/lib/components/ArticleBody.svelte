<script lang="ts">
	import { type Article, ArticleSize } from '$lib/articles';

	export let article: Article;
	export let size: ArticleSize;
</script>

<div class="article__body">
	{#if size === ArticleSize.FULL}
		{#each article.body as paragraph}
			<p class="article__p article__p--full">{paragraph}</p>
		{/each}
	{/if}

	{#if size === ArticleSize.MEDIUM}
		<p class="article__p">{article.body[0]}</p>
	{/if}
</div>

<style lang="scss">
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

		@media (max-width: 768px) {
			font-size: 13px;

			&--full {
				font-size: 16px;
			}
		}
	}
</style>
