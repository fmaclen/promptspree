<script lang="ts">
	import { type SubmitFunction, enhance } from '$app/forms';
	import { type Article, ArticleSize, ArticleStatus } from '$lib/articles';
	import type { User } from '$lib/users';
	import { Sentiment } from '$lib/utils';
	import { formatDistance } from 'date-fns';

	import ArticleReactions from './ArticleReactions.svelte';
	import FormButton from './FormButton.svelte';

	export let article: Article;
	export let size: ArticleSize;
	export let currentUser: User | null = null;

	const isActionable = size === ArticleSize.FULL;
	const isDeletable = isActionable && article.isCreatedByCurrentUser;
	const isPublishable =
		isActionable && article.isCreatedByCurrentUser && article.status === ArticleStatus.DRAFT;

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

<aside class="metadata">
	<nav class="metadata__nav">
		<div class="metadata__author">
			<a class="metadata__a" href={`/profile/${article.user.id}`}>
				{article.user.nickname}
			</a>

			<time class="metadata__time" title={article.updated} datetime={article.updated}>
				{formatDistance(new Date(article.updated), new Date(), {
					addSuffix: true
				})}
			</time>
		</div>
		<ArticleReactions
			{article}
			currentUserCanReact={currentUser !== null && isActionable && !isPublishable}
		/>
	</nav>

	{#if isDeletable || isPublishable}
		<nav class="metadata__author-actions">
			{#if isPublishable}
				<a class="metadata__edit" href={`/play?articleId=${article.id}`}>Edit</a>

				<form method="POST" action="?/publish" use:enhance={handlePublish}>
					<input type="hidden" name="articleId" value={article.id} />
					<FormButton
						label="Publish"
						type="submit"
						isCompact={true}
						sentiment={Sentiment.POSITIVE}
					/>
				</form>
			{/if}

			{#if isDeletable}
				<form method="POST" action="?/delete" use:enhance={handleDelete}>
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
		</nav>
	{/if}
</aside>

<style lang="scss">
	aside.metadata {
		@include paragraph-xs;
		width: 100%;
		box-sizing: border-box;
		display: flex;
		gap: 16px;
		flex-direction: column;
		color: var(--color-neutral-200);
	}

	div.metadata__author {
		display: flex;
		flex-direction: column;
		gap: 2px;
		color: inherit;
	}

	time.metadata__time {
		color: var(--color-neutral-300);
	}

	a.metadata__a {
		display: block;
		color: inherit;
		text-decoration: none;
		font-weight: bold;

		&:hover {
			color: var(--color-green);
		}
	}

	nav.metadata__nav {
		display: flex;
		column-gap: 8px;
		justify-content: space-between;
	}

	nav.metadata__author-actions {
		display: flex;
		gap: 8px;
		flex-direction: column;
	}

	a.metadata__edit {
		padding: 8px 16px;
		font-size: 14px;
		font-weight: 600;
		box-sizing: border-box;
		text-align: center;
		width: 100%;
		text-decoration: none;
		border-radius: var(--border-radius-l);
		color: var(--color-neutral-100);
		background-color: var(--color-neutral-600);
	}
</style>
