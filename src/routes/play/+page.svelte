<script lang="ts">
	import type { ActionResult } from '@sveltejs/kit';
	import { enhance, applyAction } from '$app/forms';
	import Article from '$lib/components/Article.svelte';
	import FormButton from '$lib/components/FormButton.svelte';
	import FormField from '$lib/components/FormField.svelte';
	import FormTextarea from '$lib/components/FormTextarea.svelte';
	import Notice from '$lib/components/Notice.svelte';
	import IconLoading from '$lib/components/IconLoading.svelte';
	import { PLACEHOLDER_ARTICLE } from '$lib/article';

	let prompt = '';
	let error = '';
	let article = PLACEHOLDER_ARTICLE;
	let isLoading = false;
	$: isPublishable = article.id;

	const submitGenerate = () => {
		isLoading = true;
		return async ({ result, update }: { result: ActionResult; update: () => void }) => {
			if (result.type === 'success') {
				article = { ...article, ...result.data };
			}
			if (result.type === 'error') {
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

<section class="play">
	<form class="form" method="POST" action="?/generate" use:enhance={submitGenerate}>
		<FormField label="Prompt">
			<FormTextarea
				autofocus={true}
				name="prompt"
				placeholder="Write a placeholder article about Flibbertigibbet Jibber-jabber Jiggery-pokery"
				bind:value={prompt}
				disabled={isLoading}
			/>
		</FormField>

		{#if error}
			<Notice>{error}</Notice>
		{/if}

		<FormButton label="Generate" type="submit" disabled={!prompt || isLoading} />
	</form>

	<div class="play__status">
		{#if isLoading}
			<IconLoading />
		{:else}
			<span class="play__ready">→</span>
		{/if}
	</div>

	<form class="form form--preview" method="POST" action="?/publish" use:enhance={submitPublish}>
		{#if isPublishable}
			<input type="hidden" name="articleId" value={article.id} />
		{/if}
		<Article {article} sentiment="positive" />
		<FormButton label="Publish" type="submit" sentiment="positive" disabled={!isPublishable} />
	</form>
</section>

<style lang="scss">
	section.play {
		display: grid;
		width: 100%;
		grid-template-columns: 1fr auto 1fr;
		gap: 32px;
		align-items: center;

		@media (max-width: 1280px) {
			grid-template-columns: unset;
			grid-template-rows: repeat(3, auto);
			gap: 16px;
		}
	}

	form.form {
		display: flex;
		flex-direction: column;
		row-gap: 16px;
	}

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
</style>
