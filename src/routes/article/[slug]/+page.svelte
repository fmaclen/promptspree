<script lang="ts">
	import { type SubmitFunction, enhance } from '$app/forms';
	import { ArticleStatus } from '$lib/article';
	import ArticleBody from '$lib/components/ArticleBody.svelte';
	import ArticleMetadata from '$lib/components/ArticleMetadata.svelte';
	import Plate from '$lib/components/Plate.svelte';
	import Section from '$lib/components/Section.svelte';

	import type { PageData } from './$types';

	export let data: PageData;
	let article = data.article;
	let isCurrentUserAuthor = data.user?.id === article.author.id

	const handleReaction: SubmitFunction = () => {
		return async ({ result, update }) => {
			article = result.type === 'success' ? result.data?.article : article;
			await update();
		};
	};
</script>

<Section>
	<Plate>
		<ArticleBody {article} />

		<nav class="article-reactions">
			{#each article.reactions.byType as reaction}
				<form
					class="article-reactions__form"
					action="/article/{article.id}?/react"
					method="POST"
					use:enhance={handleReaction}
				>
					<input type="hidden" name="reaction" value={reaction.index} />
					<button
						type="submit"
						class="article-reactions__button
							{article?.reactions?.byCurrentUser === reaction.index ? 'article-reactions__button--reacted' : ''}"
						disabled={!data.user}
					>
						<span class="article-reactions__emoji">
							{reaction.reaction}
						</span>

						{#if reaction.total}
							<span class="article-reactions__total">
								{reaction.total}
							</span>
						{/if}
					</button>
				</form>
			{/each}
		</nav>

		<div class="article-prompt">
			<code class="article-prompt__code">
				{article.prompt}
			</code>
		</div>

		<ArticleMetadata
			id={article.author.id}
			nickname={article.author.nickname}
			updated={article.updated}
			isDeletable={isCurrentUserAuthor}
			isPublishable={isCurrentUserAuthor && article.status === ArticleStatus.DRAFT}
		/>
	</Plate>
</Section>

<style lang="scss">
	nav.article-reactions {
		display: flex;
		grid-auto-flow: column;
		margin: 0;
		padding: 0;
		width: 100%;
	}

	form.article-reactions__form {
		width: 100%;
		border-top: 1px solid hsl(0, 0%, 85%);
		border-bottom: 1px solid hsl(0, 0%, 85%);
		border-left: 1px solid hsl(0, 0%, 85%);

		&:first-child {
			border-left: none;
		}
	}

	button.article-reactions__button {
		display: flex;
		align-items: center;
		justify-content: center;
		column-gap: 8px;
		width: 100%;
		padding: 16px;
		box-sizing: border-box;
		border: none;
		background-color: hsl(0, 0%, 95%);
		cursor: pointer;
		filter: grayscale(100%);

		// Styles shared with `a.article-reactions-summary`
		text-align: center;
		font-weight: 400;
		color: hsl(0, 0%, 50%);
		line-height: 24px;
		font-size: 12px;
		font-family: var(--font-mono);

		&--reacted {
			font-weight: 600;
		}

		&--reacted,
		&:hover:not(:disabled) {
			filter: inherit;
			background-color: var(--color-white);
			border-bottom-color: transparent;
			color: var(--color-accent);
		}

		&:disabled {
			cursor: not-allowed;
		}
	}

	span.article-reactions__emoji {
		font-size: 24px;
		transform: translateY(2px); // Optically align emoji to total reactions
	}

	div.article-prompt {
		display: flex;
		flex-direction: column;
	}

	code.article-prompt__code {
		font-size: 13px;
		font-family: var(--font-mono);
		overflow-y: scroll;
		background-color: hsl(0, 0%, 90%);
		padding: 16px;
	}
</style>
