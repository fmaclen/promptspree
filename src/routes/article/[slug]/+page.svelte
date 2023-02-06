<script lang="ts">
	import { type SubmitFunction, enhance } from '$app/forms';
	import { Reaction } from '$lib/article';
	import A from '$lib/components/A.svelte';
	import ArticleMetadata from '$lib/components/ArticleMetadata.svelte';
	import Button from '$lib/components/Button.svelte';
	import Section from '$lib/components/Section.svelte';

	import type { PageData } from './$types';

	export let data: PageData;
	let article = data.article;

	const handleReaction: SubmitFunction = () => {
		return async ({ result, update }) => {
			article = result?.data?.article || article;
			await update();
		};
	};
</script>

<Section>
	<article class="article">
		<div class="article__body">
			<h3 class="article__category">{article.category}</h3>

			<h1 class="article__headline">
				{article.headline}
			</h1>

			{#each article.body as paragraph}
				<p class="article__body">{paragraph}</p>
			{/each}
		</div>

		<nav class="article-reactions">
			{#each Object.entries(Reaction) as [_, reaction], index}
				{@const totalReactions = article.reactions.byType.find(
					(reaction) => parseInt(reaction.reaction) === index
				)?.total}

				<form
					class="article-reactions__form"
					action="/article/{article.id}?/react"
					method="POST"
					use:enhance={handleReaction}
				>
					<input type="hidden" name="reaction" value={index} />
					<button
						type="submit"
						class="article-reactions__button
							{article?.reactions?.byCurrentUser === index ? 'article-reactions__button--reacted' : ''}"
						disabled={!data.user}
					>
						{reaction}

						{#if totalReactions}
							<span class="article-reactions__sum">
								{totalReactions}
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
			id={article?.user?.id}
			nickname={article?.user?.nickname}
			updated={article.updated}
		>
			<!-- <Button href="/">Delete</Button> -->
		</ArticleMetadata>
	</article>
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
			filter: grayscale(0%);
			background-color: transparent;
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

	/* ============================================================================== */
	/* ============================================================================== */
	/* ============================================================================== */

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

	/* ============================================================================== */
	/* ============================================================================== */
	/* ============================================================================== */

	article.article {
		border: 1px solid rgba(0, 0, 0, 0.2);
		border-radius: 2px;
		box-shadow: 1px 1px 0 rgba(255, 255, 255, 0.5), inset 1px 1px 0 rgba(255, 255, 255, 0.5);
	}

	div.article__body {
		border-top-left-radius: 2px;
		border-top-right-radius: 2px;
		background-color: var(--color-white);
		display: flex;
		flex-direction: column;

		padding: 24px;
		row-gap: 12px;
	}

	h3.article__category {
		margin: 0;
		font-size: 13px;
		line-height: 1em;
		font-weight: 400;
		color: var(--color-accent);
	}

	h1.article__headline {
		font-family: var(--font-serif);
		margin: 0;
		line-height: 1em;
		color: hsl(0, 0%, 10%);

		font-size: 32px;
		margin-bottom: 0.5em;
	}

	p.article__body {
		font-size: 16px;
		margin: 0;
		color: hsl(0, 0%, 35%);
		line-height: 1.5em;
	}
</style>
