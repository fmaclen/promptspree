<script lang="ts">
	export let title: string | undefined = undefined;
	export let isVerticallyCentered: boolean = false;
</script>

<section class="section {isVerticallyCentered ? 'section--vertically-centered' : ''}">
	<div class="section__container">
		{#if title}
			<h1 class="section__h1">{title}</h1>
		{/if}
		<slot />
	</div>
</section>

<style lang="scss">
	section.section {
		display: flex;
		align-items: center;
		flex-direction: column;
		width: 100%;
		max-width: 1280px;
		row-gap: 64px;
		padding: 64px;
		margin-inline: auto;
		box-sizing: border-box;

		@media (max-width: 768px) {
			padding: 32px;
			row-gap: 32px;
		}

		&:not(:first-of-type) {
			padding-top: 0;
		}

		&--vertically-centered {
			max-width: 512px;
			margin-block: auto;
		}
	}

	div.section__container {
		width: 100%;
		height: max-content;
	}

	h1.section__h1 {
		@include headline-xl;
		margin-bottom: 32px;
		padding-bottom: 24px;
		color: var(--color-neutral-100);
		border-bottom: 1px solid var(--color-neutral-500);

		@media (max-width: 768px) {
			font-size: 32px;
		}
	}
</style>
