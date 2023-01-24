<script lang="ts">
	import type { ActionData } from '../play/$types';

	export let form: ActionData;

	import Article from '$lib/components/Article.svelte';
	import FormButton from '$lib/components/FormButton.svelte';
	import FormField from '$lib/components/FormField.svelte';
	import FormTextarea from '$lib/components/FormTextarea.svelte';
	import { PLACEHOLDER_ARTICLE } from '$lib/components/Article';

	// Prompt
	let prompt = form?.prompt;
	let isGenerating = false;
	$: isGenerated = form !== undefined;
	$: article = form ? form : PLACEHOLDER_ARTICLE;

	const handleGenerate = async (event: Event) => {
		isGenerated = false;
		isGenerating = true;
		event.target.parentElement.submit();
		form.reset();
	};

	// Preview
</script>

<section class="play">
	<form class="form" action="/play?/generate" method="POST">
		<FormField label="Prompt">
			<FormTextarea
				name="prompt"
				placeholder="Write a placeholder article about Flibbertigibbet Jibber-jabber Jiggery-pokery"
				bind:value={prompt}
				disabled={isGenerating}
			/>
		</FormField>
		<FormButton
			label="Generate"
			type="submit"
			disabled={!prompt || isGenerating}
			on:click={handleGenerate}
		/>
	</form>

	<div class="play__status">
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
					</style>
				</g></svg
			>
		{:else}
			<span class="play__ready">→</span>
		{/if}
	</div>

	<form class="form form--preview" action="/play?/publish" method="POST">
		<Article {article} sentiment="positive" />
		<FormButton
			label="Publish"
			type="submit"
			sentiment="positive"
			disabled={isGenerating || isGenerated}
		/>
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
