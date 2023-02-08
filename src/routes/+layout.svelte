<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import HR from '$lib/components/HR.svelte';
	import Logo from '$lib/components/Logo.svelte';
	import { APP_NAME } from '$lib/utils';

	import type { PageData } from './$types';

	export let data: PageData;

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
	<header class="header">
		<hgroup class="header__hgroup">
			<nav class="header__nav">
				{#if data.user}
					<form action="/logout" method="POST" class="nav__form">
						<Button type="submit">Logout</Button>
					</form>
				{:else}
					<Button href="/waitlist">Join</Button>
				{/if}
			</nav>
			<Logo title={APP_NAME} />
			<nav class="header__nav"><Button href="/play">Play</Button></nav>
		</hgroup>
		<HR />
	</header>

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

		--color-accent: hsl(240, 100%, 23%);
		--color-positive: hsl(181, 32%, 49%);
		--color-positive-secondary: hsl(181, 32%, 95%);
		--color-negative: hsl(342, 83%, 48%);
		--color-negative-secondary: hsl(342, 83%, 95%);

		--color-border: #e2e2e2;

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

	header.header {
		position: sticky;
		top: 0;
		z-index: 1;
	}

	hgroup.header__hgroup {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		align-items: center;
		justify-content: space-between;
		padding: 12px 16px;
		column-gap: 14px;
		background-color: hsl(0, 0%, 95%);
	}

	nav.header__nav:last-child {
		margin-left: auto;
	}
</style>
