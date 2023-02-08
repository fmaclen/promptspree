<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import HR from '$lib/components/HR.svelte';
	import Logo from '$lib/components/Logo.svelte';
	import { APP_NAME } from '$lib/utils';

	import type { PageData } from './$types';

	export let data: PageData;

	const isFooterVisible = data.path !== '/play';

	console.log(data)
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

	{#if isFooterVisible}
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
	{/if}
</div>

<style lang="scss">
	@import url('https://fonts.googleapis.com/css2?family=Inter:wght@200;400;600;800&family=Overpass+Mono:wght@300&family=Playfair+Display:wght@400;800&display=swap');

	:global(html) {
		scroll-behavior: smooth;
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
	}

	div.layout {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
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

		position: relative;

		&::before {
			content: '';
			position: absolute;
			inset: 0;
			/* background-image: url("https://i.gifer.com/PSIZ.gif"); */
			/* background-image: url("https://i.gifer.com/7SGq.gif"); */
			/* background-image: url("https://i.gifer.com/LSsT.gif"); */
			/* background-image: url("https://i.gifer.com/7P0u.gif"); */
			/* background-image: url("https://i.gifer.com/9wxw.gif"); */
			/* background-image: url("https://i.gifer.com/XzZg.gif"); */
			/* background-image: url("https://i.gifer.com/29Q.gif"); */
			/* background-image: url("https://i.gifer.com/9x4s.gif"); */
			background-size: cover;
			/* background-size: 100%; */
			background-size: max-content;
			background-position: center;
			filter: saturate(0);
			opacity: 0.05;
		}
	}

	nav.footer__nav {
		position: relative;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		justify-content: space-between;
		align-items: start;
		column-gap: 32px;
		padding: 32px 16px;
		z-index: 1;
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
