<script lang="ts">
	import { type SubmitFunction, enhance } from '$app/forms';
	import { type Article, Reaction } from '$lib/article';
	import type { Sentiment } from '$lib/utils';
	import { formatDistance } from 'date-fns';

	import A from './A.svelte';

	export let article: Article;
	export let sentiment: Sentiment | undefined = undefined;
	export let isPreview: boolean = false;

	let errors;

	const handleReaction: SubmitFunction = () => {
		return async ({ result, update }) => {
			switch (result.type) {
				case 'success':
					break;
				case 'failure':
					errors = result.data?.data;
					break;
				default:
					break;
			}
			await update();
		};
	};
</script>

<article class="article {article.isPlaceholder ? 'article--placeholder' : ''}">
	{#if article.imageURL}
		{@const ALT = 'AI-generated for this article'}
		{#if isPreview && article.id}
			<A href="/article/{article.id}">
				<img class="article__img" src={article.imageURL} alt={ALT} title={ALT} />
			</A>
		{:else}
			<img class="article__img" src={article.imageURL} alt={ALT} title={ALT} />
		{/if}
	{/if}

	{#if !article.isPlaceholder}
		<time class="article__time {sentiment === 'positive' ? 'article__time--positive' : ''}">
			{article.author} — {formatDistance(new Date(article.updated), new Date(), {
				addSuffix: true
			})}
		</time>
	{/if}

	{#if isPreview && article.id}
		<A href="/article/{article.id}">
			<h1 class="article__headline">
				{article.headline}
			</h1>
		</A>
	{:else}
		<h1 class="article__headline">
			{article.headline}
		</h1>
	{/if}

	<h2 class="article__summary">{article.summary}</h2>
	{#if !isPreview}
		{#each article.body as paragraph}
			<p class="article__p">{paragraph}</p>
		{/each}

		<div class="article-prompt">
			<nav class="article-ranking">
				{#each Object.entries(Reaction) as [_, reaction], index}
					{console.log('article', article, index)}
					<form action="/article/{article.id}?/react" method="POST" use:enhance={handleReaction}>
						<input type="hidden" name="reaction" value={index} />
						<button
							type="submit"
							class="article-ranking__button {article?.userReaction === index
								? 'article-ranking__button--reacted'
								: ''}"
						>
							{reaction}
							{#if article?.reactions}
								{article.reactions[index]?.sum || 0}
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
	{/if}
</article>

<style lang="scss">
	article.article {
		display: inline-flex;
		flex-direction: column;
		row-gap: 24px;
		box-sizing: border-box;
		padding: 32px;
		margin-bottom: 16px;
		overflow: hidden;
		background-color: #fff;
		border: 1px solid #e2e2e2;

		&--placeholder {
			background-color: #fafafa;
			color: #ccc;
			margin-bottom: 0;

			time.article__time {
				color: #ccc;
			}
		}
	}

	img.article__img {
		width: calc(100% + 32px + 32px);
		height: 100%;
		object-fit: cover;
		margin: -32px -32px 16px -32px;
	}

	time.article__time {
		font-size: 14px;
		font-family: var(--font-mono);
		color: var(--color-accent);

		&--positive {
			color: var(--color-positive);
		}
	}

	h1.article__headline {
		font-size: 32px;
		letter-spacing: -0.035em;
		line-height: 1em;
		margin: 0;
	}

	h2.article__summary {
		font-weight: 200;
		font-size: 24px;
		line-height: 1.25em;
		margin: 0;
	}

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

	nav.article-ranking {
		display: grid;
		grid-auto-flow: column;
		margin: 0;
		padding: 0;
		border-top: 1px solid var(--color-border);
	}

	button.article-ranking__button {
		font-family: var(--font-mono);
		display: grid;
		grid-auto-flow: column;
		align-items: center;
		justify-content: center;
		gap: 8px;
		width: 100%;
		padding: 12px;
		box-sizing: border-box;
		border: none;
		background-color: var(--color-grey5);
		border-left: 1px solid var(--color-border);
		border-bottom: 1px solid var(--color-border);
		font-size: 14px;
		cursor: pointer;
		filter: grayscale(100%);
		text-align: center;

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
			color: var(--color-grey80);
		}

		&:first-child {
			border-left: none;
		}
	}

	span.article-ranking__rank {
		font-size: 11px;
	}
</style>
