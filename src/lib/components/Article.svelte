<script lang="ts">
	import { formatDistance } from 'date-fns';
	import type { Article } from '$lib/article';

	export let article: Article;
	export let sentiment: 'positive' | undefined = undefined;
	export let isPreview: boolean = false;
</script>

<article class="article {article.isPlaceholder ? 'article--placeholder' : ''}">
	{#if article.imageURL}
		<img class="article__img" src={article.imageURL} alt="AI-generated for this article" />
	{/if}

	{#if !article.isPlaceholder}
		<time class="article__time {sentiment === 'positive' ? 'article__time--positive' : ''}">
			{article.author} — {formatDistance(new Date(article.updated), new Date(), {
				addSuffix: true
			})}
		</time>
	{/if}

	{#if isPreview && article.id}
		<a href="/article/{article.id}" class="article__a">
			<h1 class="article__headline">
				{article.headline}
			</h1>
		</a>
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
	{/if}

	{#if article.prompt}
		<code class="article__prompt">
			{article.prompt.split(/\nFormat/)[0]}
		</code>
	{/if}
</article>

<style lang="scss">
	article.article {
		display: inline-flex;
		flex-direction: column;
		row-gap: 24px;
		border: 1px solid #e2e2e2;
		border-radius: 2px;
		overflow: hidden;
		padding: 32px;
		margin-bottom: 16px;
		background-color: #fff;

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
		width: calc(100% + 2.5rem + 2.5rem);
		height: 100%;
		object-fit: cover;
		margin: -2.5rem -2.5rem 1rem -2.5rem;
	}

	time.article__time {
		font-size: 14px;
		font-family: var(--font-mono);
		color: var(--color-accent);

		&--positive {
			color: var(--color-positive);
		}
	}

	a.article__a {
		text-decoration: none;
		color: inherit;

		&:hover {
			text-decoration: wavy underline;
			text-decoration-color: var(--color-secondary);
			text-decoration-thickness: 2px;
			color: var(--color-accent);
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

	code.article__prompt {
		font-size: 14px;
		font-family: var(--font-mono);
		overflow-y: scroll;
		background-color: #f4f4f4;
		color: #999;
		padding: 20px 32px;
		margin: 0;
		box-sizing: border-box;

		width: calc(100% + 32px + 32px);
		margin: 0 -32px -32px -32px;
	}
</style>
