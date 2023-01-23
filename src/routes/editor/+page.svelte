<script lang="ts">
	import type { ActionData } from './$types';

	export let form: ActionData;

	import Article from '$lib/components/Article.svelte';
	import FormButton from '$lib/components/FormButton.svelte';
	import FormField from '$lib/components/FormField.svelte';
	import FormTextarea from '$lib/components/FormTextarea.svelte';

	const PLACEHOLDER_ARTICLE = {
		headline: 'Flibbertigibbet Jibber-jabber Jiggery-pokery',
		summary:
			'This article delves into the world of flibbertigibbet jibber-jabber jiggery-pokery, a fascinating and little-known phenomenon that has recently been gaining attention in the scientific community.',
		body: 'The first thing to know about flibbertigibbet jibber-jabber jiggery-pokery is that it is a complex and multi-faceted phenomenon. At its core, it is a form of communication that is characterized by its nonsensical and seemingly random nature. Despite its apparent lack of meaning, however, flibbertigibbet jibber-jabber jiggery-pokery has been found to be a powerful tool for expressing deep emotions and ideas.',
		collectionId: 'collectionId',
		collectionName: 'collectionName',
		id: 'id',
		image: [],
		updated: new Date().toISOString(),
		isPlaceholder: true
	};

	// Prompt
	let prompt = form?.prompt;
	$: isGenerateDisabled = !prompt;
	$: isGenerating = false;

	// Preview
	$: article = form ? form : PLACEHOLDER_ARTICLE;
	$: isPublishable = form;
</script>

<section class="editor">
	<form class="form" action="/editor?/generate" method="POST">
		<FormField label="Prompt">
			<FormTextarea
				name="prompt"
				placeholder="Write a placeholder article about Flibbertigibbet Jibber-jabber Jiggery-pokery"
				bind:value={prompt}
			/>
		</FormField>
		<FormButton label="Generate" type="submit" disabled={isGenerateDisabled} />
	</form>

	{#if isGenerating}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			xmlns:xlink="http://www.w3.org/1999/xlink"
			x="0px"
			y="0px"
			width="16px"
			height="16px"
			viewBox="0 0 16 16"
			><g transform="translate(0, 0)"
				><g class="nc-loop-dots-anim-6-16-icon-o"
					><circle cx="1.5" cy="8" fill="#444444" r="1.5" /><circle
						cx="8"
						cy="8"
						fill="#444444"
						r="1.5"
					/><circle cx="14.5" cy="8" fill="#444444" r="1.5" /></g
				><style>
					.nc-loop-dots-anim-6-16-icon-o,
					.nc-loop-dots-anim-6-16-icon-o > * {
						--animation-duration: 1.2s;
					}
					.nc-loop-dots-anim-6-16-icon-o {
						transform-origin: 50% 50%;
						animation: nc-loop-dots-anim-6 var(--animation-duration) infinite;
					}
					.nc-loop-dots-anim-6-16-icon-o > :nth-child(2),
					.nc-loop-dots-anim-6-16-icon-o > :nth-child(3) {
						transform-origin: 11.25px 50%;
						animation: nc-loop-dots-anim-6-inner var(--animation-duration) infinite;
					}
					@keyframes nc-loop-dots-anim-6 {
						0%,
						50% {
							transform: rotate(0);
						}
						100% {
							animation-timing-function: cubic-bezier(1, 0, 0, 1);
							transform: rotate(180deg);
						}
					}
					@keyframes nc-loop-dots-anim-6-inner {
						0% {
							transform: rotate(0);
						}
						100%,
						50% {
							animation-timing-function: cubic-bezier(1, 0, 0, 1);
							transform: rotate(180deg);
						}
					}
				</style></g
			></svg
		>
	{:else}
		<span class="editor__ready">→</span>
	{/if}

	<form class="form form--preview" action="/editor?/publish" method="POST">
		<Article {article} sentiment="positive" />
		<FormButton label="Publish" type="submit" sentiment="positive" disabled={!isPublishable} />
	</form>
</section>

<style lang="scss">
	section.editor {
		display: grid;
		width: 100%;
		grid-template-columns: 1fr auto 1fr;
		column-gap: 32px;
		align-items: center;
	}

	form.form {
		display: flex;
		flex-direction: column;
		row-gap: 16px;
	}

	span.editor__ready {
		width: 16px;
		font-size: 16px;
		color: var(--color-grey20);
	}
</style>
