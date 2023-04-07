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
		<a class="metadata__a" href={`/profile/${article.user.id}`}>
			<span class="metadata__author">{article.user.nickname}</span>

			<time class="metadata__time" title={article.updated} datetime={article.updated}>
				{formatDistance(new Date(article.updated), new Date(), {
					addSuffix: true
				})}
			</time>
		</a>

		<ArticleReactions
			{article}
			currentUserCanReact={currentUser !== null && isActionable && !isPublishable}
		/>
	</nav>

	{#if size === ArticleSize.FULL}
		{#if article.messages}
			<div class="article-prompt">
				<code class="article-prompt__code">
					{#each article.messages as message}
						{#if typeof message.content === 'string'}
							<p>{message.content}</p>
						{:else if message.content?.notes !== undefined}
							<p class="article-prompt__assistant">{message.content.notes}</p>
						{/if}
					{/each}
				</code>
			</div>
		{/if}
	{/if}

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
		width: 100%;
		font-size: 13px;
		box-sizing: border-box;
		display: flex;
		gap: 16px;
		flex-direction: column;
		height: max-content;
		color: var(--color-neutral-200);
	}

	span.metadata__author {
		font-weight: 600;
		color: inherit;
	}

	time.metadata__time {
		color: var(--color-neutral-300);
	}

	a.metadata__a {
		display: flex;
		gap: 2px;
		flex-direction: column;
		color: inherit;
		text-decoration: none;
		width: max-content;
		align-self: center;

		&:hover {
			color: var(--color-primary);
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

	/* ------------------------------------------------------------------------ */

	div.article-prompt {
		display: flex;
		flex-direction: column;
	}

	code.article-prompt__code {
		font-size: 13px;
		font-family: var(--font-mono);
		overflow-y: scroll;
		color: var(--color-neutral-300);
		background-color: var(--color-neutral-700);
		border-radius: var(--border-radius-l);
		padding: 0 16px;
	}

	p.article-prompt__assistant {
		color: var(--color-primary-dark);
	}
</style>
