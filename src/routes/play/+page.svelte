<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import type { Article } from '$lib/article';
	import A from '$lib/components/A.svelte';
	import ArticleBody from '$lib/components/ArticleBody.svelte';
	import FormButton from '$lib/components/FormButton.svelte';
	import HR from '$lib/components/HR.svelte';
	import Head from '$lib/components/Head.svelte';
	import IconLoading from '$lib/components/IconLoading.svelte';
	import Notice from '$lib/components/Notice.svelte';
	import Plate from '$lib/components/Plate.svelte';
	import { Sentiment } from '$lib/utils';
	import type { ActionResult } from '@sveltejs/kit';
	import { afterUpdate } from 'svelte';
	import { slide } from 'svelte/transition';

	let article: Article | null = null;
	let error: string | null = null;
	let fieldError: string[] | null = null;
	let textareaRef: HTMLTextAreaElement;

	$: prompt = '';
	$: isLoading = false;
	$: suggestions = article
		? parseCompletionSuggestions(article.messages)
		: getRandomInitialSuggestions();

	function setSuggestion(suggestion: string) {
		prompt = suggestion;
		textareaRef.focus();
	}

	afterUpdate(() => {
		adjustTextarea();
	});

	function adjustTextarea() {
		if (textareaRef) {
			textareaRef.style.height = 'auto';
			textareaRef.style.height = `${textareaRef.scrollHeight}px`;
		}
	}

	function submitGenerate() {
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
			<A href="/profile/{article.author.id}/drafts" sentiment={Sentiment.POSITIVE}>drafts</A>
		</Notice>
		<HR />
	</div>
{/if}

<section class="play">
	{#if fieldError}
		<Notice sentiment={Sentiment.NEGATIVE}>{fieldError[1]}</Notice>
	{/if}

	<nav class="play__session">
		<div class="chat">
			<ul class="chat__messages">
				{#if article}
					{#each article.messages as message}
						{#if message.role !== 'system'}
							<li class="chat__message chat__message--{message.role}">
								{message.content}
							</li>
						{/if}
					{/each}
				{/if}
			</ul>

			{#if !isLoading}
				<nav class="chat__suggestions">
					{#each suggestions as suggestion}
						<button
							class="chat__suggestion"
							on:click={() => setSuggestion(suggestion)}
							type="button"
						>
							{suggestion}
						</button>
					{/each}
				</nav>
			{/if}
		</div>

		<form class="play__form" method="POST" action="?/generate" use:enhance={submitGenerate}>
			{#if article}
				<input type="hidden" name="articleId" value={article.id} />
			{/if}
			<input type="hidden" name="prompt" bind:value={prompt} />
			<div class="play__prompt">
				<textarea
					class="play__prompt-textarea"
					name="prompt"
					placeholder={article ? 'Suggest any changes' : 'Write a prompt to generate an article'}
					rows="1"
					bind:value={prompt}
					bind:this={textareaRef}
					disabled={isLoading}
				/>
				<button class="play__submit" type="submit" disabled={isLoading || !prompt}>
					{#if isLoading}
						<IconLoading />
					{:else}
						Submit
					{/if}
				</button>
			</div>
		</form>
	</nav>

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
	ul.chat__messages {
		display: flex;
		flex-direction: column;
		gap: 6px;
		margin: 0;
		padding: 12px;
		list-style: none;
	}

	li.chat__message {
		padding: 8px;
		font-size: 14px;
		border-radius: var(--border-radius-m);
		max-width: 75%;

		&--user {
			background-color: var(--color-white);
			margin-right: auto;
		}

		&--assistant {
			text-align: right;
			margin-left: auto;
			background-color: var(--color-positive-secondary);
		}

		&--system {
			padding: 0;
			margin-inline: auto;
			color: #999;
			text-align: center;
		}
	}

	nav.chat__suggestions {
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding: 12px;
		max-width: 100vw;
		box-sizing: border-box;
		/* border-top: 1px solid var(--border-color-default); */
		border-bottom: 1px solid var(--border-color-default);
		background-color: #ddd;
	}

	button.chat__suggestion {
		position: relative;
		font-family: var(--font-sans);
		padding: 8px;
		font-size: 14px;
		text-align: left;
		border: none;
		border-radius: var(--border-radius-m);
		color: var(--color-accent);
		background-color: var(--color-accent-secondary);
		padding-top: 8px;
		padding-bottom: 8px;
		padding-left: 8px;
		padding-right: 32px;
		cursor: pointer;

		&::after {
			position: absolute;
			right: 8px;
			top: 0;
			bottom: 0;
			content: '↓';
			display: flex;
			align-items: center;
		}
	}

	/* ---------------------------------------------------- */

	section.play {
		display: grid;
		grid-template-rows: repeat(2, 1fr);
		flex-grow: 1;
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
		overflow-y: auto;
	}

	div.play__prompt {
		background-color: var(--color-white);
		padding: 12px;
		display: flex;
		gap: 8px;
	}

	textarea.play__prompt-textarea {
		flex: 1;
		font-size: 14px;
		border: none;
		resize: vertical;
		background-color: var(--color-white);
		border-radius: var(--border-radius-m);
		font-family: var(--font-sans);
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

	form.play-article-actions {
		width: 100%;
		display: flex;
		gap: 16px;
	}

	form.play__form {
	}

	form.play-article-actions {
	}
</style>
