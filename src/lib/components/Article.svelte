<script lang="ts">
	import { formatDistance } from 'date-fns';

	const getImageURL = (collectionId: string, recordId: string, fileName: string, size = '0x0') => {
		return `http://localhost:8090/api/files/${collectionId}/${recordId}/${fileName}?thumb=${size}`;
	};

	interface Article {
		body: string;
		collectionId: string;
		collectionName: string;
		headline: string;
		id: string;
		image: string[];
		summary: string;
		updated: string;
		prompt?: string;
	}

	export let article: Article;
</script>

<article class="article">
	{#if article.image.length > 0}
		<img
			class="article__img"
			src={getImageURL(article.collectionId, article.id, article.image[0])}
			alt={article.headline}
		/>
	{/if}

	<time class="article__time">
		{formatDistance(new Date(article.updated), new Date(), { addSuffix: true })}
	</time>
	<h1 class="article__headline">
		{article.headline}
	</h1>
	<h2 class="article__summary">{article.summary}</h2>
	{#each article.body.split(/\n/) as paragraph}
		<p class="article__p">{paragraph}</p>
	{/each}

	{#if article.prompt}
		<code class="article__prompt">{article.prompt.split(/\nFormat/)[0]} </code>
	{/if}
</article>

<style lang="scss">
	article.article {
		font-family: 'EB Garamond', 'Georgia', serif;
		display: inline-flex;
		flex-direction: column;
		row-gap: 24px;
		border: 1px solid #e2e2e2;
		border-radius: 2px;
		overflow: hidden;
		padding: 2.5rem;
		margin-bottom: 1rem;
		background-color: #fff;
	}

	img.article__img {
		width: calc(100% + 2.5rem + 2.5rem);
		height: 100%;
		object-fit: cover;
		margin: -2.5rem -2.5rem 1rem -2.5rem;
	}

	time.article__time {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.75rem;
		color: slateblue;
		letter-spacing: 0.1em;
		text-transform: capitalize;
	}

	h1.article__headline {
		font-size: 2.25rem;
		letter-spacing: -0.025em;
		line-height: 1em;
		margin: 0;
	}

	h2.article__summary {
		font-style: italic;
		font-size: 1.5rem;
		line-height: 1.15em;
		margin: 0;
	}

	p.article__p {
		font-size: 0.9rem;
		margin: 0;
		font-size: 1.1rem;
		line-height: 1.25em;
	}

	p.article__empty {
		text-align: center;
		font-style: italic;
		width: 100%;
		padding: 4rem 0;
		border: 1px solid #e2e2e2;
	}

	code.article__prompt {
		overflow-y: scroll;
		background-color: #f4f4f4;
		color: #999;
		padding: 1.5rem 2.5rem;
		margin: 0;
		box-sizing: border-box;

		width: calc(100% + 2.5rem + 2.5rem);
		margin: 1rem -2.5rem -2.5rem -2.5rem;
	}
</style>
