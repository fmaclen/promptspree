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
		max-width: 512px;
		padding: 24px;
		width: 100%;
		margin-inline: auto;
		box-sizing: border-box;

		&--fullscreen {
			margin-block: auto;
			height: 100%;
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

	/* header.section-header {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		padding: 24px;
		box-sizing: border-box;
		border: 1px solid hsl(0, 0%, 85%);
		box-shadow: inset -1x -1px 0 rgba(255, 255, 255, 0.35);
	} */

	h1.section__h1 {
		width: 100%;
		padding: 48px;
		box-sizing: border-box;
		/* font-size: 20px; */
		font-weight: 400;
		font-family: var(--font-serif);
		margin: 0;
		line-height: 1em;
		border: 1px solid hsl(0, 0%, 85%);
		box-shadow: 1px 1px 0 rgba(255, 255, 255, 0.35);
		/* background-color: var(--color-accent); */
		text-align: center;
		/* color: var(--color-white); */
		color: var(--color-accent);
		/* color: hsl(0, 0%, 0%); */

		position: relative;
		
		&::before {
			z-index: -1;
			content: '';
			position: absolute;
			inset: 0;
			background-image: url("https://i.gifer.com/PSIZ.gif");
			/* background-image: url("https://i.gifer.com/7SGq.gif"); */
			/* background-image: url("https://i.gifer.com/LSsT.gif"); */
			/* background-image: url("https://i.gifer.com/7SGq.gif"); */
			/* background-image: url("https://i.gifer.com/XzZg.gif"); */
			/* background-image: url("https://i.gifer.com/7P0u.gif"); */
			/* background-image: url("https://i.gifer.com/7gS5.gif"); */
			/* background-image: url("https://i.gifer.com/4CND.gif"); */
			/* background-image: url("https://i.gifer.com/XzZg.gif"); */
			/* background-image: url("https://i.gifer.com/7j9n.gif"); */
			/* background-image: url("https://i.gifer.com/4G75.gif"); */
			/* background-image: url("https://i.gifer.com/29Q.gif"); */
			/* background-image: url("https://i.gifer.com/9x4s.gif"); */
			/* background-size: cover; */
			background-size: max-content;
			background-position: center;
			filter: invert(1) saturate(0);
			/* filter: invert(1); */
			/* filter: saturate(0); */
			/* transform: rotate(180deg); */
			opacity: .05;
		}
	}
</style>
