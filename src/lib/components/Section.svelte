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

		&--vertically-centered {
			width: 33vw;
			min-width: 512px;
			margin-block: auto;
		}
	}

	div.section__container {
		width: 100%;
		height: max-content;
	}

	h1.section__h1 {
		font-weight: 600;
		letter-spacing: -0.025em;
		margin: 0;
		margin-bottom: 32px;
		padding-bottom: 24px;
		font-size: 40px;
		line-height: 1.2em;
		color: var(--color-neutral-100);
		border-bottom: 1px solid var(--color-neutral-500);
	}
</style>
