<script lang="ts">
	import { type SubmitFunction, enhance } from '$app/forms';
	import { type Article, ArticleSize, ArticleStatus } from '$lib/articles';
	import type { Reactions } from '$lib/reactions';
	import type { User } from '$lib/users';

	export let article: Article;
	export let size: ArticleSize;
	export let currentUser: User | null = null;

	$: reactions = article.reactions;
	$: mostPopularReaction = reactions.byType.sort((a, b) => b.total - a.total)[0].reaction;

	const handleReaction: SubmitFunction = () => {
		toggleVisibility();

		return async ({ result, update }) => {
			if (result.type === 'success' && result.data) {
				article = { ...article, reactions: result.data as Reactions };
			}
			await update();
		};
	};

	let isVisible = false;
	function toggleVisibility() {
		isVisible = !isVisible;
	}
</script>

{#if article.status !== ArticleStatus.DRAFT}
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

{#if currentUser && size === ArticleSize.FULL}
	<nav class="article-reactions">
		<button on:click={toggleVisibility}>React!</button>

		{#if isVisible}
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
		{/if}
	</nav>
{/if}

<style lang="scss">
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
</style>
