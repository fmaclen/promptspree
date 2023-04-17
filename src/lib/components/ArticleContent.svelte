<script lang="ts">
	import { type SubmitFunction, enhance } from '$app/forms';
	import { type Article, ArticleSize, ArticleStatus } from '$lib/articles';
	import ArticleBody from '$lib/components/ArticleBody.svelte';
	import ArticleHeader from '$lib/components/ArticleHeader.svelte';
	import { Sentiment } from '$lib/utils';

	import FormButton from './FormButton.svelte';

	export let article: Article;
	export let size: ArticleSize;

	const isActionable = size === ArticleSize.FULL;
	const isDeletable = isActionable && article.isCreatedByCurrentUser;
	const isPublishable =
		isActionable && article.isCreatedByCurrentUser && article.status === ArticleStatus.DRAFT;

	const confirmDeletion = (event: any) => {
		const confirmDeletion = window.confirm(
			`Are you sure you want to delete the article?\nThis action cannot be undone`
		);
		if (!confirmDeletion) event.preventDefault();
	};

	const handleDelete: SubmitFunction = () => {
		return async ({ update }) => {
			await update();
		};
	};

	const handlePublish: SubmitFunction = () => {
		return async ({ update }) => {
			await update();
		};
	};
</script>

<article class={`article-content article-content--${size}`}>
	<ArticleHeader {article} {size} />

	<div class="article-content__body">
		{#if article.imageSrc && size === ArticleSize.FULL}
			<img
				src={article.imageSrc}
				class="article__img"
				alt="AI-generated illustration of the article"
			/>
		{/if}

		{#if article.audioSrc && size === ArticleSize.FULL}
			<nav class="article__audio">
				<audio controls src={article.audioSrc} preload="none" class="article__player" />
			</nav>
		{/if}

		<ArticleBody {article} {size} />
	</div>

	{#if isDeletable || isPublishable}
		<nav class="article-content__actions">
			{#if isPublishable}
				<a class="metadata__edit" href={`/play?articleId=${article.id}`}>Edit</a>

				<form method="POST" action="?/publish" use:enhance={handlePublish}>
					<input type="hidden" name="articleId" value={article.id} />
					<FormButton
						label="Publish"
						type="submit"
						isCompact={true}
						sentiment={Sentiment.POSITIVE}
					/>
				</form>
			{/if}

			{#if isDeletable}
				<form method="POST" action="?/delete" use:enhance={handleDelete}>
					<input type="hidden" name="articleId" value={article.id} />
					<FormButton
						label="Delete"
						type="submit"
						isCompact={true}
						sentiment={Sentiment.NEGATIVE}
						on:click={confirmDeletion}
					/>
				</form>
			{/if}
		</nav>
	{/if}
</article>

<style lang="scss">
	article.article-content {
		&--medium {
			display: flex;
			flex-direction: column;
			row-gap: 8px;
		}

		&--full {
			@media (min-width: 1024px) {
				display: grid;
				grid-column: span 2;
				grid-template-columns: 2fr 1fr;
				grid-template-areas: 'headline headline' 'body actions';
				row-gap: 32px;
				column-gap: 56px;
			}

			@media (max-width: 1024px) {
				display: flex;
				flex-direction: column;
				row-gap: 32px;
			}
		}
	}

	div.article-content__body {
		display: flex;
		flex-direction: column;
		row-gap: 32px;
		grid-area: body;
	}

	nav.article__audio {
		display: flex;
		width: 100%;
		background-color: #f2f3f4; // Color of the Chrome audio player
		align-items: center;
		filter: invert(1);
		border-radius: var(--border-radius-l);
	}

	audio.article__player {
		width: 100%;
		padding-block: 8px;
		padding-inline: 8px;
		height: 32px;
	}

	img.article__img {
		width: 100%;
		border-radius: var(--border-radius-l);
	}

	nav.article-content__actions {
		grid-area: actions;
	}
</style>
