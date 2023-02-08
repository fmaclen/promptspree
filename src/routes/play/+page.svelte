<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import type { Article } from '$lib/article';
	import A from '$lib/components/A.svelte';
	import ArticlePlaceholder from '$lib/components/ArticlePlaceholder.svelte';
	import FormButton from '$lib/components/FormButton.svelte';
	import FormField from '$lib/components/FormField.svelte';
	import FormFieldset from '$lib/components/FormFieldset.svelte';
	import FormTextarea from '$lib/components/FormTextarea.svelte';
	import HR from '$lib/components/HR.svelte';
	import IconLoading from '$lib/components/IconLoading.svelte';
	import Notice from '$lib/components/Notice.svelte';
	import Section from '$lib/components/Section.svelte';
	import { Sentiment } from '$lib/utils';
	import type { ActionResult } from '@sveltejs/kit';

	let prompt = '';
	let article: Article | null = null;
	let error: string | null = null;
	let fieldError: string[] | null = null;
	$: isLoading = false;

	const submitGenerate = () => {
		// HACK:
		// When typing in the textarea on mobile browsers the page scrolls down
		// to the bottom of the textarea. This is a hack to scroll back to the top
		// of the page after the form is submitted so that the top part of the article
		// is visible on the viewport.
		window.scrollTo(0, 0);
		document.body.style.height = '100%';
		document.body.style.height = `${document.body.scrollHeight}px`;

		isLoading = true;
		article = null;
		error = null;
		fieldError = null;

		return async ({ result, update }: { result: ActionResult; update: () => void }) => {
			if (result.type === 'success') {
				article = result.data?.article || null;
			}
			if (result.type === 'failure') {
				error = result.data?.error || null;
				fieldError = result.data?.fieldError || null;
				await applyAction(result);
			}

			update();
			isLoading = false;
		};
	};

	const submitPublish = () => {
		isLoading = true;
	};
</script>

{#if error}
	<Notice sentiment={Sentiment.NEGATIVE}>{error}</Notice>
	<HR />
{/if}

<Notice>Write a prompt below to generate an article draft</Notice>
<HR/>

<section class="play">
	<!-- <Section> -->
	<div class="play__draft">
		<article class="article">
			<div class="article__body">
				{#if article}
					<h3 class="article__category">{article.category}</h3>

					<h1 class="article__headline">
						{article.headline}
					</h1>

					{#each article.body as paragraph}
						<p class="article__body">{paragraph}</p>
					{/each}
				{:else}
					<ArticlePlaceholder {isLoading} />
					{/if}
				</div>
		</article>
	</div>

	<div class="play__prompt">
		{#if fieldError}
			<Notice sentiment={Sentiment.NEGATIVE}>{fieldError[1]}</Notice>
		{/if}

		<!-- <FormField label="Prompt"> -->
			<FormTextarea
				name="prePrompt"
				placeholder="e.g. write a story about how everything new is old again"
				disabled={isLoading}
				bind:value={prompt}
			/>
		<!-- </FormField> -->

		<nav class="form-nav">
			<form class="form" method="POST" action="?/generate" use:enhance={submitGenerate}>
				<input type="hidden" name="prompt" bind:value={prompt} />
				<FormButton
					label={article ? 'Try another one' : 'Generate'}
					type="submit"
					disabled={!prompt || isLoading}
				/>
			</form>

			{#if article}
				<form class="form" method="POST" action="?/publish" use:enhance={submitPublish}>
					<input type="hidden" name="articleId" value={article.id} />
					<FormButton label="Publish" type="submit" disabled={!prompt || isLoading} />
				</form>
			{/if}
		</nav>
	</div>
	<!-- </Section> -->
</section>

<style lang="scss">
	section.play {
		display: grid;
		grid-template-rows: auto max-content;
		flex-grow: 1;
		/* height: calc(100vh - 64px); */
		/* display: grid;
		width: 100%;
		grid-template-columns: 1fr auto 1fr;
		gap: 32px;
		align-items: center;

		@media (max-width: 1280px) {
			grid-template-columns: unset;
			grid-template-rows: repeat(3, auto);
			gap: 16px;
		} */
		/* background-color: aquamarine; */
	}

	div.play__draft {
		padding: 24px;
	}

	div.play__prompt {
		/* background-color: tomato; */
		position: sticky;
		bottom: 0;
		display: flex;
		flex-direction: column;
		row-gap: 16px;
		padding: 24px;
		background-color: hsl(0, 0%, 95%);
		/* border-top: 1px solid tomato; */
		border-top: 1px solid hsl(0, 0%, 85%);
		box-shadow: inset 0 1px 0 var(--color-white);
	}

	form.form {
		width: 100%;

		display: flex;
		flex-direction: column;
		row-gap: 16px;
		/* padding: 24px; */
	}

	nav.form-nav {
		display: flex;
		justify-content: flex-end;
		column-gap: 16px;
		width: 100%;
	}

	/* 
	div.play__status {
		width: 100%;
		width: 16px;
		font-size: 16px;
		color: var(--color-grey20);

		@media (max-width: 1280px) {
			margin-inline: auto;
			transform: rotate(90deg);
		}
	}
	*/

	/* ============================================================================== */
	/* ============================================================================== */
	/* ============================================================================== */

	article.article {
		border: 1px solid rgba(0, 0, 0, 0.2);
		border-radius: 2px;
		box-shadow: 1px 1px 0 rgba(255, 255, 255, 0.5), inset 1px 1px 0 rgba(255, 255, 255, 0.5);

		width: 100%;
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
