<script lang="ts">
	import { type SubmitFunction, enhance } from '$app/forms';
	import { type Article, ArticleSize, ArticleStatus } from '$lib/articles';
	import type { Reactions } from '$lib/reactions';
	import { Sentiment } from '$lib/utils';
	import { formatDistance } from 'date-fns';

	import FormButton from './FormButton.svelte';

	export let article: Article;
	export let isActionable: boolean = false;
	export let size: ArticleSize;

	$: reactions = article.reactions;
	$: mostPopularReaction = reactions.byType.sort((a, b) => b.total - a.total)[0].reaction;

	const isDraft = article.status === ArticleStatus.DRAFT;
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

	const handleReaction: SubmitFunction = () => {
		return async ({ result, update }) => {
			if (result.type === 'success' && result.data) {
				article = { ...article, reactions: result.data as Reactions };
			}
			await update();
		};
	};
</script>

<nav class="metadata">
	<a class="metadata__a" href={`/profile/${article.user.id}`}>
		<span class="metadata__author">{article.user.nickname}</span>

		<time class="metadata__time" title={article.updated} datetime={article.updated}>
			{formatDistance(new Date(article.updated), new Date(), {
				addSuffix: true
			})}
		</time>
	</a>

	{#if !isDraft}
		<div class="metadata__actions">
			<a class="article-reactions-summary" href="/article/{article.id}">
				{#if reactions.total > 0}
					<span class="article-reactions-summary__emoji">
						{mostPopularReaction}
					</span>
				{/if}
				<span class="article-reactions-summary__total">{reactions.total}</span>
			</a>
		</div>
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

	{#if size === ArticleSize.FULL}
		<nav class="article-reactions">
			{#each article.reactions.byType as reaction}
				<form
					class="article-reactions__form"
					action="/article/{article.id}?/react"
					method="POST"
					use:enhance={handleReaction}
				>
					<input type="hidden" name="reaction" value={reaction.index} />
					<input type="hidden" name="article" value={article.id} />
					<button
						type="submit"
						class="article-reactions__button
							{article.reactions?.byCurrentUser === reaction.index ? 'article-reactions__button--reacted' : ''}"
						disabled={!article.user}
					>
						<span class="article-reactions-summary__emoji">
							{reaction.reaction}
						</span>
						{#if reaction.total}
							<span class="article-reactions-summary__total">
								{reaction.total}
							</span>
						{/if}
					</button>
				</form>
			{/each}
		</nav>
	{/if}

	{#if size === ArticleSize.FULL && article.messages}
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
</nav>

<style lang="scss">
	nav.metadata {
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

		&:hover {
			color: var(--color-primary);
		}
	}

	nav.metadata__author-actions {
		display: flex;
		column-gap: 8px;
	}

	/* ------------------------------------------------------------------------ */

	a.article-reactions-summary {
		display: flex;
		align-items: center;
		column-gap: 8px;
		text-decoration: none;
		font-size: 12px;
		line-height: 1em;
		font-weight: 400;
		padding: 10px;
		width: max-content;
		font-family: var(--font-mono);
		border-radius: var(--border-radius-l);
		color: var(--color-neutral-200);
		background-color: var(--color-neutral-600);

		&:hover {
			border-color: var(--color-neutral-300);
		}
	}

	span.article-reactions-summary__emoji {
		font-size: 16px;
		transform: translateY(2px); // Optically align with text `span.article-reactions-summary__total`
	}

	span.article-reactions-summary__total {
		transform: translateY(1px); // Optically align with text `a.article-reactions-summary`
	}

	/* ------------------------------------------------------------------------ */

	nav.article-reactions {
		display: flex;
		flex-direction: column;
		width: max-content;
		background-color: var(--color-neutral-700);
		border-radius: var(--border-radius-l);
		overflow: hidden; // Hide rounded corners
	}

	button.article-reactions__button {
		display: flex;
		align-items: center;
		justify-content: center;
		column-gap: 8px;
		width: 100%;
		padding: 8px;
		box-sizing: border-box;
		border: none;
		background-color: transparent;
		cursor: pointer;

		// Styles shared with `a.article-reactions-summary`
		text-align: center;
		font-weight: 400;
		line-height: 24px;
		font-size: 12px;
		font-family: var(--font-mono);
		color: var(--color-neutral-200);

		&--reacted {
			font-weight: 600;
		}

		&--reacted,
		&:hover:not(:disabled) {
			background-color: var(--color-neutral-600);
		}

		&:disabled {
			cursor: not-allowed;
		}
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
