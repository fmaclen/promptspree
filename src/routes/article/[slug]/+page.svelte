<script lang="ts">
	import { type SubmitFunction, enhance } from '$app/forms';
	import { Reaction } from '$lib/article';
	import Article from '$lib/components/Article.svelte';
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
	{#if article}
		<Article {article}>
			{#if article?.body}
				{#each article.body as paragraph}
					<p class="article__p">{paragraph}</p>
				{/each}
			{/if}

			<div class="article-prompt">
				<nav class="article-reactions">
					{#each Object.entries(Reaction) as [_, reaction], index}
						{@const totalReactions = article?.reactions?.find(
							(reaction) => parseInt(reaction.reaction) === index
						)?.sum}

						<form
							class="article-reactions__form"
							action="/article/{article.id}?/react"
							method="POST"
							use:enhance={handleReaction}
						>
							<input type="hidden" name="reaction" value={index} />
							<button
								type="submit"
								class="article-reactions__button {article?.userReaction === index
									? 'article-reactions__button--reacted'
									: ''}"
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

				{#if article.prompt}
					<code class="article-prompt__code">
						{article.prompt}
					</code>
				{/if}
			</div>
		</Article>
	{/if}
</Section>

<style lang="scss">
	p.article__p {
		font-size: 16px;
		margin: 0;
		font-size: 1.1rem;
		line-height: 1.5em;
	}

	div.article-prompt {
		display: flex;
		flex-direction: column;
		width: calc(100% + 32px + 32px);
		margin: 16px -32px -32px -32px;
	}

	code.article-prompt__code {
		font-size: 13px;
		font-family: var(--font-mono);
		overflow-y: scroll;
		color: #999;
		padding: 20px 32px;
		margin: 0;
		box-sizing: border-box;
	}

	nav.article-reactions {
		display: grid;
		grid-auto-flow: column;
		margin: 0;
		padding: 0;
		border-top: 1px solid var(--color-border);
	}

	form.article-reactions__form {
		border-left: 1px solid var(--color-border);

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
		padding: 12px 8px;
		box-sizing: border-box;
		border: none;
		background-color: var(--color-grey5);
		border-bottom: 1px solid var(--color-border);
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
		&:hover {
			filter: grayscale(0%);
			background-color: transparent;
			border-bottom-color: transparent;
			color: var(--color-accent);
		}
	}

	span.article-reactions__sum {
		font-size: 11px;
	}
</style>
