<script lang="ts">
	import { type SubmitFunction, enhance } from '$app/forms';
	import ArticleBody from '$lib/components/ArticleBody.svelte';
	import ArticleMetadata from '$lib/components/ArticleMetadata.svelte';
	import Card from '$lib/components/Card.svelte';
	import Section from '$lib/components/Section.svelte';

	import type { PageData } from './$types';

	export let data: PageData;
	$: article = data.article;
	// let currentUserId = data.user?.id;

	const handleReaction: SubmitFunction = () => {
		return async ({ result, update }) => {
			article = result.type === 'success' ? result.data?.article : article;
			await update();
		};
	};
</script>

<Section isFullscreen={true}>
	<Card>
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
						{reaction.reaction}

						{#if reaction.total}
							<span class="article-reactions__sum">
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
		>
			<!-- {#if currentUserId === article.author.id}
				<button>Delete</button>
			{/if} -->
		</ArticleMetadata>
	</Card>
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

		border-top: 1px solid hsl(0, 0%, 80%);
		border-bottom: 1px solid hsl(0, 0%, 80%);
		border-left: 1px solid hsl(0, 0%, 80%);
		box-shadow: inset 4px 4px 0 rgba(255, 255, 255, 0.35);

		&:first-child {
			border-left: none;
		}
	}

	button.article-reactions__button {
		font-family: var(--font-mono);
		display: grid;
		grid-auto-flow: column;
		align-items: center;
		justify-content: center;
		gap: 8px;
		width: 100%;
		padding: 8px 12px;
		box-sizing: border-box;
		border: none;
		background-color: var(--color-grey5);
		/* border-bottom: 1px solid var(--color-border); */
		font-size: 24px;
		text-align: center;
		cursor: pointer;
		filter: grayscale(100%);

		font-weight: 400;
		color: var(--color-grey30);

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

	span.article-reactions__sum {
		font-size: 11px;
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
