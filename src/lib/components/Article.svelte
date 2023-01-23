<script lang="ts">
	import { formatDistance } from 'date-fns';

	interface Article {
		body: string;
		collectionId: string;
		collectionName: string;
		headline: string;
		id: string;
		image: string[];
		summary: string;
		updated: string;
		isPlaceholder?: boolean;
		prompt?: string;
	}

	// const getImageURL = (collectionId: string, recordId: string, fileName: string) => {
	// 	return `http://localhost:8090/api/files/${collectionId}/${recordId}/${fileName}`;
	// };

	export let article: Article;
	export let sentiment: 'positive' | undefined = undefined;
</script>

<article class="article {article.isPlaceholder ? 'article--placeholder' : ''}">
	<!-- {#if article.image.length > 0}
		<img
			class="article__img"
			src={getImageURL(article.collectionId, article.id, article.image[0])}
			alt={article.headline}
		/>
	{/if} -->

	{#if !article.isPlaceholder}
		<time class="article__time {sentiment === 'positive' ? 'article__time--positive' : ''}">
			{formatDistance(new Date(article.updated), new Date(), { addSuffix: true })}
		</time>
	{/if}
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
		display: inline-flex;
		flex-direction: column;
		row-gap: 24px;
		border: 1px solid #e2e2e2;
		border-radius: 2px;
		overflow: hidden;
		padding: 32px;
		margin-bottom: 1rem;
		background-color: #fff;

		&--placeholder {
			background-color: #fafafa;
			color: #999;

			time.article__time {
				color: #999;
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
		padding: 1.5rem 2.5rem;
		margin: 0;
		box-sizing: border-box;

		width: calc(100% + 2.5rem + 2.5rem);
		margin: 1rem -2.5rem -2.5rem -2.5rem;
	}
</style>
