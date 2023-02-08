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
		// HACK: when the textarea is focused on mobile browsers and the keyboard appears
		// the page is scrolled down to the bottom of the textarea.
		// This hacks forces the page to scroll back to the top of the page and resets
		// the viewport size to the original size.
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

<Notice>
	{#if isLoading}
		<IconLoading />
	{:else}
		Write a prompt below to generate an article
	{/if}
</Notice>
<HR />

<section class="play">
	<div class="play__prompt">
		{#if fieldError}
			<Notice sentiment={Sentiment.NEGATIVE}>{fieldError[1]}</Notice>
		{/if}

		<FormTextarea
			name="prePrompt"
			placeholder="e.g. write an opinion piece about kids these days in a judgemental tone"
			disabled={isLoading}
			bind:value={prompt}
		/>

		<nav class="form-nav">
			<form class="form" method="POST" action="?/generate" use:enhance={submitGenerate}>
				<input type="hidden" name="prompt" bind:value={prompt} />

				{#if article}
					<input type="hidden" name="articleId" value={article.id} />
					<FormButton
						label='Try another one'
						secondary={true}
						type="submit"
						disabled={!prompt || isLoading}
					/>
				{:else}
					<FormButton
						label={isLoading ? 'Generating...' : 'Generate'}
						type="submit"
						disabled={!prompt || isLoading}
					/>
				{/if}
			</form>

			{#if article}
				<form class="form" method="POST" action="?/publish" use:enhance={submitPublish}>
					<input type="hidden" name="articleId" value={article.id} />
					<FormButton label="Publish" type="submit" disabled={!prompt || isLoading} />
				</form>
			{/if}
		</nav>
	</div>

	<HR />

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

	<!-- </Section> -->
</section>

<style lang="scss">
	section.play {
		/* position: relative; */
		display: grid;
		grid-template-rows: max-content auto;
		/* flex-grow: 1; */
		/* height: 100%; */
	}

	div.play__draft {
		display: flex;
		align-items: center;
		padding: 24px;

		max-width: 512px;
		width: 100%;
		box-sizing: border-box;
		margin-inline: auto;
	}

	div.play__prompt {
		display: flex;
		flex-direction: column;
		row-gap: 16px;
		padding: 24px;
		max-width: 512px;
		width: 100%;
		box-sizing: border-box;
		margin-inline: auto;
	}

	form.form {
		width: 100%;
		display: flex;
		flex-direction: column;
		row-gap: 16px;
	}

	nav.form-nav {
		display: flex;
		justify-content: flex-end;
		flex-direction: column;
		row-gap: 8px;
		width: 100%;
	}

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
