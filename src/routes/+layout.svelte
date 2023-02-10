<script lang="ts">
	import { APP_NAME } from '$lib/utils';

	const today = new Date().toLocaleDateString('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
</script>

<svelte:head>
	<title>{APP_NAME} | {today}</title>
</svelte:head>

<div class="layout">
	<slot />
</div>

<style lang="scss">
	@import url('https://fonts.googleapis.com/css2?family=Inter:wght@200;400;600;800&family=Overpass+Mono:wght@300&family=Playfair+Display:wght@400;800&display=swap');

	:global(html) {
		scroll-behavior: smooth;
		height: 100%;
	}

	:global(body) {
		--font-serif: 'Playfair Display', serif;
		--font-sans: 'Inter', sans-serif;
		--font-mono: 'Overpass Mono', monospace;

		--color-accent: hsl(248, 40%, 40%);
		/* --color-accent: #000075; */
		--color-positive: hsl(181, 32%, 49%);
		--color-positive-secondary: hsl(181, 32%, 95%);
		--color-negative: hsl(342, 83%, 48%);
		--color-negative-secondary: hsl(342, 83%, 95%);

		--color-white: #ffffff;
		--color-black: #000;

		margin: 0;
		font-family: var(--font-sans);
		color: hsl(0, 0%, 30%);
		background-color: hsl(0, 0%, 95%);
		height: 100%;
	}

	div.layout {
		display: flex;
		flex-direction: column;
		height: 100%;
	}
</style>
