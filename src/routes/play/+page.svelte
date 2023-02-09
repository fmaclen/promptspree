<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import type { Article } from '$lib/article';
	import ArticleBody from '$lib/components/ArticleBody.svelte';
	import Plate from '$lib/components/Plate.svelte';
	import FormButton from '$lib/components/FormButton.svelte';
	import FormTextarea from '$lib/components/FormTextarea.svelte';
	import HR from '$lib/components/HR.svelte';
	import IconLoading from '$lib/components/IconLoading.svelte';
	import Notice from '$lib/components/Notice.svelte';
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

		<nav class="form-nav">
			<form class="form" method="POST" action="?/generate" use:enhance={submitGenerate}>
				<input type="hidden" name="prompt" bind:value={prompt} />

				{#if article}
					<input type="hidden" name="articleId" value={article.id} />
					<FormButton
						label="Try another one"
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
</style>
