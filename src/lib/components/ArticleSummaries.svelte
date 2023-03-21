<script lang="ts">
	import type { Article } from '$lib/articles';
	import ArticleCategory from '$lib/components/ArticleCategory.svelte';
	import ArticleMetadata from '$lib/components/ArticleMetadata.svelte';
	import Plate from '$lib/components/Plate.svelte';

	export let articles: Article[];
	export let isActionable: boolean = false;

	// Sort articles by the total number of reactions
	// articles = articles.sort((a, b) => b.reactions.total - a.reactions.total);
</script>

<div class="articles">
	{#each articles as article}
		<Plate>
			<a class="article" href="/article/{article.id}">
				<div class="article__body">
					<ArticleCategory category={article.category}>
						{article.category}
					</ArticleCategory>

					<h1 class="article__headline">
						{article.headline}
					</h1>
					<p class="article__p">{article.body[0]}</p>
				</div>
			</a>

			<ArticleMetadata {article} {isActionable} />
		</Plate>
	{/each}
</div>

<style lang="scss">
	div.articles {
		display: flex;
		align-items: center;
		flex-direction: column;
		row-gap: 16px;
	}

	a.article {
		text-decoration: none;
	}

	div.article__body {
		border-top-left-radius: var(--border-radius-l);
		border-top-right-radius: var(--border-radius-l);
		background-color: var(--color-white);
		padding: 24px;
		display: flex;
		flex-direction: column;
		row-gap: 8px;
	}

	h1.article__headline {
		font-weight: 600;
		letter-spacing: -0.025em;
		margin: 0;
		font-size: 24px;
		line-height: 1.1em;
		color: hsl(0, 0%, 10%);
	}

	p.article__p {
		font-size: 14px;
		margin: 0;
		color: hsl(0, 0%, 40%);
		line-height: 1.4em;
	}
</style>
