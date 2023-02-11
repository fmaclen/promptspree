<script lang="ts">
	export let title: string | undefined = undefined;
</script>

<section class="section">
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
		margin-block: auto;
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
		text-align: center;
		position: relative;

		color: var(--color-accent);
		border: 1px solid hsl(0, 0%, 85%);
		box-shadow: 1px 1px 0 rgba(255, 255, 255, 0.35);
		background-color: rgba(255, 255, 255, 0.1);
		text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.5);

		&::before {
			z-index: -1;
			content: '';
			position: absolute;
			inset: 0;

			background-image: url('https://user-images.githubusercontent.com/1434675/218220190-373b81c7-bf33-44ab-a481-091308e5f870.gif');
			background-position: center;
			background-size: cover;
			opacity: 0.1;
			filter: invert(1);
		}
	}
</style>
