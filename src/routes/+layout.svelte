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
			<nav class="header__nav"><Button href="/profile">Profile</Button></nav>
			<Logo title={APP_NAME} />
			<nav class="header__nav"><Button href="/play">Play</Button></nav>
		</hgroup>
		<HR />
	</header>

	<slot />

	<footer class="footer">
		<div class="footer__container">
			<nav class="footer__nav">
				<Logo title={APP_NAME} hasDarkBackground={true} />

				<div class="footer__links">
					{#if !data.user}
						<a href="/waitlist" class="footer__a">Join waitlist</a>
						<a href="/login" class="footer__a">Login</a>
						<hr class="footer__hr" />
					{/if}
					<a
						href="https://github.com/fmaclen/the-synthetic-gazette"
						class="footer__a"
						target="_blank"
						rel="noreferrer"
					>
						GitHub
					</a>
					<hr class="footer__hr" />
					<a href="/legal" class="footer__a">Terms of service</a>
					<a href="/legal" class="footer__a">Privacy policy</a>
				</div>
			</nav>
		</div>
	</footer>
</div>

<style lang="scss">
	@import url('https://fonts.googleapis.com/css2?family=Inter:wght@200;400;600;800&family=Overpass+Mono:wght@300&family=Playfair+Display:wght@400;800&display=swap');

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
	}

	header.header {
		position: sticky;
		top: 0;
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

	footer.footer {
		background-color: var(--color-accent);
		color: var(--color-white);
		font-size: 14px;
	}

	nav.footer__nav {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		justify-content: space-between;
		align-items: start;
		column-gap: 32px;
		padding: 32px 16px;
	}

	div.footer__links {
		display: flex;
		flex-direction: column;
		row-gap: 8px;
	}

	a.footer__a {
		color: var(--color-white);
		text-decoration: none;
	}

	hr.footer__hr {
		border: none;
		border-top: 1px solid rgba(255, 255, 255, 0.2);
		margin: 8px 0;
	}
</style>
