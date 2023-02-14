<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import type { Article } from '$lib/article';
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

	let prompt = '';
	let article: Article | null = null;
	let error: string | null = null;
	let fieldError: string[] | null = null;
	$: isLoading = false;

	const submitGenerate = () => {
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

<Notice>
	{#if isLoading}
		<IconLoading />
	{:else}
		Enter a prompt below to generate an article
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

		<nav class="play__nav">
			<form class="play__form" method="POST" action="?/generate" use:enhance={submitGenerate}>
				<input type="hidden" name="prompt" bind:value={prompt} />

				{#if article}
					<input type="hidden" name="articleId" value={article.id} />
					<FormButton label="Try another one" type="submit" disabled={!prompt || isLoading} />
				{:else}
					<FormButton
						label={isLoading ? 'Generating...' : 'Generate'}
						type="submit"
						disabled={!prompt || isLoading}
					/>
				{/if}
			</form>

			{#if article}
				<form class="play__form" method="POST" action="?/publish" use:enhance={submitPublish}>
					<input type="hidden" name="articleId" value={article.id} />
					<FormButton
						label="Publish"
						type="submit"
						sentiment={Sentiment.POSITIVE}
						disabled={!prompt || isLoading}
					/>
				</form>
			{/if}
		</nav>
	</div>

	<HR />

	<div class="play__draft">
		<Plate>
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

	form.play__form {
		width: 100%;
		display: flex;
		flex-direction: column;
		row-gap: 16px;

		&:last-child:not(:first-child) {
			width: max-content;
		}
	}
</style>
