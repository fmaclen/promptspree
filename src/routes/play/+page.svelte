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
	let isGenerating = false;
	let isPublishable = false;
	let article = PLACEHOLDER_ARTICLE;

	const submitGenerate = ({ form }: { form: HTMLFormElement }) => {
		isGenerating = true;
		return async ({ result, update }: { result: ActionResult; update: () => void }) => {
			if (result.type === 'success') {
				// form.reset();
				article = { ...article, ...result.data };
				console.log(article);
			}
			if (result.type === 'error') {
				console.log('ERROR', result);
				await applyAction(result);
			}
			update();
			isGenerating = false;
		};
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
				disabled={isGenerating}
			/>
		</FormField>

		{#if error}
			<Notice>{error}</Notice>
		{/if}

		<FormButton label="Generate" type="submit" disabled={!prompt || isGenerating} />
	</form>

	<div class="play__status">
		{#if isGenerating}
			<IconLoading />
		{:else}
			<span class="play__ready">→</span>
		{/if}
	</div>

	<form class="form form--preview" action="/play?/publish" method="POST">
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
