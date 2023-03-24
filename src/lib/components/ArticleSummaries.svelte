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
		<div class="article article--medium">
			<ArticleMetadata {article} {isActionable} />
			<a class="article__a" href="/article/{article.id}">
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
		</div>
	{/each}
</div>

<style lang="scss">
	div.articles {
		display: flex;
		align-items: center;
		flex-direction: column;
		row-gap: 16px;
	}

	div.article {
		display: grid;
		grid-template-columns: 1fr 2fr 1fr;
		gap: 16px;
		padding: 24px 0;

		&:not(:last-child) {
			border-bottom: 1px solid var(--color-neutral-500);
		}

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
	}

	div.article__body {
		border-top-left-radius: var(--border-radius-l);
		border-top-right-radius: var(--border-radius-l);
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
		color: var(--color-neutral-100);
	}

	p.article__p {
		margin: 0;
		font-size: 14px;
		line-height: 1.4em;
		color: var(--color-neutral-200);
	}
</style>
