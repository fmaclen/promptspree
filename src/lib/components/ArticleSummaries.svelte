<script lang="ts">
	import { type SubmitFunction, enhance } from '$app/forms';
	import type { Article } from '$lib/article';
	import ArticleMetadata from '$lib/components/ArticleMetadata.svelte';
	import Plate from '$lib/components/Plate.svelte';

	export let articles: Article[];
	export let isCurrentUserProfile: boolean = false;

	const confirmDeletion = (event: any) => {
		const confirmDeletion = window.confirm(
			`Are you sure you want to delete the article?\nThis action cannot be undone`
		);
		if (!confirmDeletion) event.preventDefault();
	};

	const handleDelete: SubmitFunction = () => {
		return async ({ result, update }) => {
			await update();
		};
	};
</script>

<div class="articles">
	{#each articles as article}
		<Plate>
			<a class="article" href="/article/{article.id}">
				<div class="article__body">
					<h3 class="article__category">{article.category}</h3>
					<h1 class="article__headline">
						{article.headline}
					</h1>
					<p class="article__p">{article.body[0]}</p>
				</div>
			</a>

			<ArticleMetadata
				id={article.author.id}
				nickname={article.author.nickname}
				updated={article.updated}
			>
				<a class="article-reactions-summary" href="/article/{article.id}">
					<span class="article-reactions-summary__emoji">
						{article.reactions.total > 0
							? article.reactions.byType.sort((a, b) => b.total - a.total)[0].reaction
							: ''}
					</span>
					<span class="article-reactions-summary__total">{article.reactions.total}</span>
				</a>

				{#if isCurrentUserProfile}
					<form class="form" method="POST" action="?/delete" use:enhance={handleDelete}>
						<input type="hidden" name="articleId" value={article.id} />
						<button type="submit" on:click={confirmDeletion}>Delete</button>
					</form>
				{/if}
			</ArticleMetadata>
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
		border-top-left-radius: 2px;
		border-top-right-radius: 2px;
		background-color: var(--color-white);
		padding: 20px;
		display: flex;
		flex-direction: column;
		row-gap: 8px;
	}

	h3.article__category {
		margin: 0;
		font-size: 13px;
		line-height: 1em;
		font-weight: 600;
		color: var(--color-positive);
	}

	h1.article__headline {
		font-family: var(--font-serif);
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

	a.article-reactions-summary {
		display: flex;
		align-items: center;
		column-gap: 8px;
		text-decoration: none;

		font-family: var(--font-mono);
		font-size: 12px;
		line-height: 1em;
		text-align: center;
		font-weight: 400;
		color: hsl(0, 0%, 50%);
	}

	span.article-reactions-summary__emoji {
		font-size: 16px;
	}
</style>
