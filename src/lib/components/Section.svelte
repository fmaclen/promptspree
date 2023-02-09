<script lang="ts">
	export let title: string = '';
	export let isFullscreen: boolean = false;
</script>

<section class="section {isFullscreen ? 'section--fullscreen' : ''}">
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
		row-gap: 64px;
		max-width: 768px;
		padding: 24px;
		width: 100%;
		margin-inline: auto;
		box-sizing: border-box;

		&--fullscreen {
			margin-block: auto;
		}
	}

	div.section__container {
		display: flex;
		align-items: center;
		flex-direction: column;
		gap: 24px;
		justify-content: center;
		width: 100%;
		box-sizing: border-box;
		border-radius: 2px;
		height: max-content;
	}

	h1.section__h1 {
		width: 100%;
		padding: 48px;
		box-sizing: border-box;
		font-weight: 400;
		font-family: var(--font-serif);
		margin: 0;
		line-height: 1em;
		border: 1px solid hsl(0, 0%, 85%);
		box-shadow: 1px 1px 0 rgba(255, 255, 255, 0.35);
		text-align: center;
		color: var(--color-accent);

		position: relative;

		&::before {
			z-index: -1;
			content: '';
			position: absolute;
			inset: 0;

			background-image: url('https://i.gifer.com/LSsT.gif');
			background-position: center;
			opacity: 0.05;
			filter: invert(1);
		}
	}
</style>
