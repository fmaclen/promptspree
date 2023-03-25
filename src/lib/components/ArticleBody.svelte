<script lang="ts">
	import { type Article, ArticleSize } from '$lib/articles';

	export let article: Article;
	export let size: ArticleSize;
</script>

{#if size === ArticleSize.FULL}
	<div class="article__body">
		{#each article.body as paragraph}
			<p class="article__p article__p--full">{paragraph}</p>
		{/each}
	</div>
{/if}

{#if size === ArticleSize.MEDIUM}
	<div class="article__body">
		<p class="article__p">{article.body[0]}</p>
	</div>
{/if}

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
	}
</style>
