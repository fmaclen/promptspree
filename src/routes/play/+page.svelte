<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { type Article, getRandomInitialSuggestions } from '$lib/articles';
	import A from '$lib/components/A.svelte';
	import ArticleBody from '$lib/components/ArticleBody.svelte';
	import FormButton from '$lib/components/FormButton.svelte';
	import FormTextarea from '$lib/components/FormTextarea.svelte';
	import HR from '$lib/components/HR.svelte';
	import Head from '$lib/components/Head.svelte';
	import IconLoading from '$lib/components/IconLoading.svelte';
	import Notice from '$lib/components/Notice.svelte';
	import Plate from '$lib/components/Plate.svelte';
	import { Sentiment } from '$lib/utils';
	import type { ActionResult } from '@sveltejs/kit';
	import { slide } from 'svelte/transition';

	let article: Article | null = null;
	let suggestions: string[] = getRandomInitialSuggestions();
	let error: string | null = null;
	let fieldError: string[] | null = null;
	let textareaRef: HTMLTextAreaElement;

	$: prompt = '';
	$: isLoading = false;

	function setSuggestion(suggestion: string) {
		prompt = suggestion;
		textareaRef.focus();
	}

	function submitGenerate() {
		isLoading = true;
		article = null;
		error = null;
		fieldError = null;

		return async ({ result, update }: { result: ActionResult; update: () => void }) => {
			if (result.type === 'success') {
				article = result.data?.article || null;
				suggestions = result.data?.suggestions || [];
			}
			if (result.type === 'failure') {
				error = result.data?.error || null;
				fieldError = result.data?.fieldError || null;
				await applyAction(result);
			}

			update();
			isLoading = false;
			prompt = '';
		};
	}

	function submitPublish() {
		isLoading = true;
	}
</script>

<Head title={['Play']} />

{#if error}
	<div transition:slide={{ duration: 150 }}>
		<Notice sentiment={Sentiment.NEGATIVE}>{error}</Notice>
		<HR />
	</div>
{/if}

{#if article}
	<div transition:slide={{ duration: 150 }}>
		<Notice sentiment={Sentiment.POSITIVE}>
			Article saved to
			<A href="/profile/{article.user?.id}/drafts" sentiment={Sentiment.POSITIVE}>drafts</A>
		</Notice>
		<HR />
	</div>
{/if}

<Notice>
	{#if isLoading}
		<IconLoading />
	{:else if article}
		Type another prompt or use one of the suggestions to edit the article
	{:else}
		Type your own prompt or choose one of the suggestions to generate an article
	{/if}
</Notice>
<HR />

<section class="play">
	<div class="play__prompt">
		{#if fieldError}
			<Notice sentiment={Sentiment.NEGATIVE}>{fieldError[1]}</Notice>
		{/if}

		<nav class="play__nav">
			<form class="play__form" method="POST" action="?/generate" use:enhance={submitGenerate}>
				<input type="hidden" name="prompt" bind:value={prompt} />

				{#if article}
					<input type="hidden" name="articleId" value={article.id} />
				{/if}

				{#if !isLoading}
					<div class="play__suggestions">
						{#each suggestions as suggestion}
							<FormButton
								on:click={() => setSuggestion(suggestion)}
								label={suggestion}
								hierarchy="secondary"
								type="button"
								disabled={prompt !== ''}
							/>
						{/each}
					</div>
				{/if}

				<div class="play__user-prompt">
					<FormTextarea
						name="prompt"
						placeholder={article
							? 'e.g. "make it a bit longer"'
							: 'e.g. "an opinion piece about kids these days in a sarcastic tone"'}
						bind:textareaRef
						bind:value={prompt}
						disabled={isLoading}
					/>
					<FormButton
						label={article ? 'Apply change' : isLoading ? 'Generating...' : 'Generate'}
						type="submit"
						disabled={isLoading || !prompt}
					/>
				</div>
			</form>
		</nav>
	</div>

	<HR />

	<div class="play__draft">
		<Plate>
			{#if article && !isLoading}
				<form
					class="play-article-actions"
					method="POST"
					action="?/publish"
					use:enhance={submitPublish}
				>
					<input type="hidden" name="articleId" value={article.id} />
					<FormButton
						label="Start from scratch"
						type="button"
						sentiment={Sentiment.NEGATIVE}
						hierarchy="secondary"
						on:click={() => {
							prompt = '';
							article = null;
						}}
					/>
					<FormButton label="Publish" type="submit" sentiment={Sentiment.POSITIVE} />
				</form>
			{/if}
			<ArticleBody {article} {isLoading} />
		</Plate>
	</div>
</section>

<style lang="scss">
	section.play {
		display: grid;
		grid-template-rows: max-content max-content auto;
		height: 100%;
		background-color: hsl(0, 0%, 93%);
	}

	div.play__draft {
		display: flex;
		align-items: center;
		padding: 24px;

		max-width: 768px;
		width: 100%;
		box-sizing: border-box;
		margin-inline: auto;
	}

	div.play__prompt {
		display: flex;
		flex-direction: column;
		row-gap: 16px;
		padding: 24px;
		max-width: 768px;
		width: 100%;
		box-sizing: border-box;
		margin-inline: auto;
	}

	nav.play__nav {
		display: flex;
		column-gap: 8px;
		width: 100%;
	}

	div.play__user-prompt {
		display: grid;
		grid-template-columns: auto max-content;
		column-gap: 12px;
	}

	div.play__suggestions {
		display: grid;
		column-gap: 8px;
		row-gap: 8px;
	}

	form.play-article-actions,
	form.play__form {
		width: 100%;
		display: flex;
		gap: 16px;
	}

	form.play__form {
		flex-direction: column;
	}

	form.play-article-actions {
		margin-bottom: 32px;
	}
</style>
