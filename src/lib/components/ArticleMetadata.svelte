<script lang="ts">
	import { type SubmitFunction, enhance } from '$app/forms';
	import { type Article, ArticleStatus } from '$lib/article';
	import { Sentiment } from '$lib/utils';
	import { formatDistance } from 'date-fns';

	import FormButton from './FormButton.svelte';

	export let article: Article;
	export let isCurrentUserProfile: boolean = false;

	const isDraft = article.status === ArticleStatus.DRAFT;
	const isDeletable = isCurrentUserProfile;
	const isPublishable = isCurrentUserProfile && article.status === ArticleStatus.DRAFT;

	// Get the most popular reaction by sorting the reactions by their total
	const mostPopularReaction = article.reactions.byType.sort((a, b) => b.total - a.total)[0]
		.reaction;

	const confirmDeletion = (event: any) => {
		const confirmDeletion = window.confirm(
			`Are you sure you want to delete the article?\nThis action cannot be undone`
		);
		if (!confirmDeletion) event.preventDefault();
	};

	const handleDelete: SubmitFunction = () => {
		return async ({ update }) => {
			await update();
		};
	};

	const handlePublish: SubmitFunction = () => {
		return async ({ update }) => {
			await update();
		};
	};
</script>

<nav class="metadata">
	<a class="metadata__a" href={`/profile/${article.author.id}`}>
		<span class="metadata__author">{article.author.nickname}</span>

		<time class="metadata__time" title={article.updated} datetime={article.updated}>
			{formatDistance(new Date(article.updated), new Date(), {
				addSuffix: true
			})}
		</time>
	</a>

	<div class="metadata__actions">
		{#if !isDraft}
			<a class="article-reactions-summary" href="/article/{article.id}">
				{#if article.reactions.total > 0}
					<span class="article-reactions-summary__emoji">
						{mostPopularReaction}
					</span>
				{/if}
				<span class="article-reactions-summary__total">{article.reactions.total}</span>
			</a>
		{/if}

		{#if isDeletable || isPublishable}
			<nav class="metadata__author-actions">
				{#if isDeletable}
					<form class="form" method="POST" action="?/delete" use:enhance={handleDelete}>
						<input type="hidden" name="articleId" value={article.id} />
						<FormButton
							label="Delete"
							type="submit"
							isCompact={true}
							sentiment={Sentiment.NEGATIVE}
							on:click={confirmDeletion}
						/>
					</form>
				{/if}

				{#if isPublishable}
					<form class="play__form" method="POST" action="?/publish" use:enhance={handlePublish}>
						<input type="hidden" name="articleId" value={article.id} />
						<FormButton
							label="Publish"
							type="submit"
							isCompact={true}
							sentiment={Sentiment.POSITIVE}
						/>
					</form>
				{/if}
			</nav>
		{/if}
	</div>
</nav>

<style lang="scss">
	nav.metadata {
		min-height: 48px;
		padding: 8px 8px 8px 16px;
		width: 100%;
		box-sizing: border-box;
		font-size: 13px;
		display: grid;
		grid-template-columns: auto max-content;
		row-gap: 32px;
		align-items: center;
		border-top: 1px solid hsl(0, 0%, 85%);
		box-shadow: inset 1px 1px 0 rgba(255, 255, 255, 0.5);
	}

	span.metadata__author {
		font-weight: 600;
		color: inherit;
		text-shadow: var(--text-shadow-white-50);
	}

	time.metadata__time {
		margin-left: 4px;
		color: hsl(0, 0%, 50%);
		text-shadow: var(--text-shadow-white-50);
	}

	a.metadata__a {
		display: grid;
		grid-template-columns: max-content auto;
		align-items: center;
		column-gap: 4px;
		color: inherit;
		text-decoration: none;
		width: 100%;
		height: 100%;

		&:hover {
			color: var(--color-accent);
		}
	}

	div.metadata__actions {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		column-gap: 8px;
	}

	nav.metadata__author-actions {
		display: flex;
		column-gap: 8px;
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
		padding: 10px;
		/* border: 1px solid hsl(0, 0%, 85%); */

		&:hover {
			/* border: 1px solid hsl(0, 0%, 70%); */
		}
	}

	span.article-reactions-summary__emoji {
		font-size: 16px;
		transform: translateY(2px); // Optically align with text `span.article-reactions-summary__total`
	}

	span.article-reactions-summary__total {
		transform: translateY(1px); // Optically align with text `a.article-reactions-summary`
	}
</style>
