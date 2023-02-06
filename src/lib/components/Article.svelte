<script lang="ts">
	import type { Article } from '$lib/article';
	import type { Sentiment } from '$lib/utils';
	import { formatDistance } from 'date-fns';

	import A from './A.svelte';

	export let article: Article;
	export let sentiment: Sentiment | undefined = undefined;
	export let isPreview: boolean = false;
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
			{article.category} — {formatDistance(new Date(article.updated), new Date(), {
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
		<p class="article__p">{article?.body[0]}</p>
	{:else}
		<h1 class="article__headline">
			{article.headline}
		</h1>
	{/if}

	{#if !isPreview}
		{#if article?.body}
			{#each article.body as paragraph}
				<p class="article__p">{paragraph}</p>
			{/each}
		{/if}

		{#if article.prompt}
			<div class="article-prompt">
				<slot />

				<code class="article-prompt__code">
					{article.prompt}<br /><br />By {article.author}
				</code>
			</div>
		{/if}
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
		border-top: 1px solid var(--color-border);
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
</style>
