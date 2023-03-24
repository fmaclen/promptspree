<script lang="ts">
	import { page } from '$app/stores';
	import A from '$lib/components/A.svelte';
	import Logo from '$lib/components/Logo.svelte';
	import { APP_NAME } from '$lib/utils';
	import { Toaster } from 'svelte-french-toast';
	import { slide } from 'svelte/transition';

	import type { PageData } from './$types';

	export let data: PageData;
	let isExpanded = false;
</script>

<div class="layout {isExpanded ? 'layout--expanded' : ''}">
	<Toaster />

	<header class="header">
		<hgroup class="header__hgroup">
			<button
				type="button"
				id="hamburger"
				class="header__hamburger {isExpanded ? 'header__hamburger--active' : ''}"
				on:click={() => (isExpanded = !isExpanded)}
				aria-expanded={isExpanded}
				aria-controls=""
				aria-label="Toggle navigation"
			>
				<span class="header__hamburger-line" />
				<span class="header__hamburger-line" />
				<span class="header__hamburger-line" />
				{#if isExpanded}
					<span class="header__hamburger-line" />
					<span class="header__hamburger-line" />
				{/if}
			</button>

			<Logo title={APP_NAME} hasDarkBackground={true} on:click={() => (isExpanded = false)} />

			<a
				class="primary-action {$page.url.pathname.includes('/play')
					? 'primary-action--active'
					: ''}"
				href={$page.url.pathname.includes('/play') ? '/' : '/play'}
			>
				<span class="primary-action__icon">✨</span>
				Play
			</a>
		</hgroup>
	</header>

	{#if isExpanded}
		<aside
			id="aside"
			class="layout__aside"
			role="region"
			aria-labelledby="hamburger"
			transition:slide={{ duration: 150 }}
		>
			<ul class="aside__ul">
				{#if data.user}
					<li class="aside__li">
						<a
							class="aside__a"
							href="/profile/{data.user.id}"
							on:click={() => (isExpanded = false)}
						>
							<strong class="aside__strong">
								{data.user.nickname}
							</strong>
						</a>
					</li>
					<li class="aside__li">
						<a
							class="aside__a"
							href="/profile/{data.user.id}/drafts"
							on:click={() => (isExpanded = false)}
						>
							Drafts
						</a>
					</li>
					<li class="aside__li">
						<a
							class="aside__a"
							href="/settings"
							aria-disabled="true"
							on:click={() => (isExpanded = false)}
						>
							Settings
						</a>
					</li>
					<li class="aside__li">
						<form action="/logout" method="POST" class="">
							<button class="aside__button" type="submit" on:click={() => (isExpanded = false)}>
								Logout
							</button>
						</form>
					</li>
				{:else}
					<li class="aside__li">
						<a class="aside__a" href="/join" on:click={() => (isExpanded = false)}>
							<strong class="aside__strong">Join to play</strong>
						</a>
					</li>
					<li class="aside__li">
						<a class="aside__a" href="/login" on:click={() => (isExpanded = false)}>Login</a>
					</li>
				{/if}
			</ul>
		</aside>
	{/if}

	<main class="layout__main">
		<slot />
	</main>

	<footer class="layout__footer">
		<A href="/">
			&copy; {new Date().getFullYear()}
			{APP_NAME}
		</A>
		<A href="/legal/">Terms of service</A>
		<A href="/legal/">Privacy policy</A>
		<A target="_blank" href="https://github.com/fmaclen/promptspree/">GitHub</A>
	</footer>
</div>

<style lang="scss">
	@import url('https://fonts.googleapis.com/css2?family=Inter:wght@200;400;600;800&family=Overpass+Mono:wght@300&family=Playfair+Display:wght@400;800&display=swap');

	:global(html) {
		scroll-behavior: smooth;
		height: 100%;
	}

	:global(body) {
		--font-sans: 'Inter', sans-serif;
		--font-mono: 'Overpass Mono', monospace;

		--color-accent: hsl(248, 40%, 40%);
		--color-accent-secondary: hsl(248, 40%, 95%);
		--color-positive: hsl(170, 90%, 39%);
		--color-positive-secondary: hsl(170, 90%, 95%);
		--color-negative: hsl(342, 83%, 48%);
		--color-negative-secondary: hsl(342, 83%, 95%);

		--text-shadow-white-50: 1px 1px 0 rgba(255, 255, 255, 0.5);
		--text-shadow-white-100: 1px 1px 0 var(--color-neutral-50);

		--border-radius-l: 8px;
		--border-radius-m: 4px;
		--border-radius-s: 2px;

		--color-neutral-50: #ffffff;
		--color-neutral-100: #e3e8e6;
		--color-neutral-200: #a4b0ac;
		--color-neutral-300: #6d7471;
		--color-neutral-400: #4f5452;
		--color-neutral-500: #3b3f3e;
		--color-neutral-600: #2d2f2e;
		--color-neutral-700: #232424;
		--color-neutral-800: #1e1e1e;
		--color-neutral-900: #181818;
		--color-neutral-950: #141414;
		--color-neutral-1000: #0f0f0f;

		--color-primary-lightest: #eafff8;
		--color-primary-lighter: #c4fdea;
		--color-primary-light: #9cf2d5;
		--color-primary: #5de9ba;
		--color-primary-dark: #32765e;
		--color-primary-darker: #17362b;
		--color-primary-darkest: #222b28;

		--color-secondary-lightest: #fff9ec;
		--color-secondary-lighter: #fdefce;
		--color-secondary-light: #f4d58b;
		--color-secondary: #eec053;
		--color-secondary-dark: #876922;
		--color-secondary-darker: #413416;
		--color-secondary-darkest: #2f2919;

		height: 100%;
		margin: 0;
		font-family: var(--font-sans);
		background-color: var(--color-neutral-800);
	}

	div.layout {
		display: flex;
		flex-direction: column;
		position: relative;
		height: 100%;
	}

	aside.layout__aside {
		grid-area: aside;

		flex-direction: column;
		justify-content: space-between;
		min-width: 256px;
		background-color: var(--color-neutral-950); 
		border-bottom: 1px solid var(--color-neutral-700);

		border-right: none;
		position: sticky;
		top: 0;
		z-index: 2;
	}

	ul.aside__ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;

		&:first-child {
			padding-top: 24px;
		}

		&:last-child {
			padding-bottom: 24px;
		}

		&:first-child,
		&:last-child {
			padding-top: 12px;
			padding-bottom: 12px;
		}
	}

	li.aside__li {
		font-size: 14px;
	}

	button.aside__button,
	a.aside__a {
		display: block;
		color: inherit;
		text-decoration: none;
		font-size: 14px;
		padding: 12px 32px;
		color: var(--color-neutral-200);
	}

	strong.aside__strong {
		font-weight: 600;
	}

	button.aside__button,
	a.aside__a {
		border-top: 1px solid transparent;
		border-bottom: 1px solid transparent;

		&:hover {
			color: var(--color-primary);
		}
	}

	a.aside__a[aria-disabled='true'] {
		pointer-events: none;
		text-decoration: line-through;
		opacity: 0.33;
	}

	button.aside__button {
		font-family: var(--font-base);
		background-color: transparent;
		border-left: none;
		border-right: none;
		width: 100%;
		font-weight: 400;
		text-align: left;
		cursor: pointer;
	}

	main.layout__main {
		grid-area: main;
		display: flex;
		flex-direction: column;
		flex-grow: 1;
	}

	/* ------------------------------------------------------------------------ */

	header.header {
		grid-area: header;

		position: sticky;
		top: 0;
		z-index: 3;
		background-color: var(--color-neutral-900);
		border-bottom: 1px solid var(--color-neutral-700);
	}

	hgroup.header__hgroup {
		display: flex;
		justify-content: space-between;
		padding: 12px 24px;
		box-sizing: border-box;
	}

	button.header__hamburger {
		display: flex;
		flex-direction: column;
		row-gap: 2px;
		justify-content: center;
		background-color: transparent;
		font-family: var(--font-base);
		font-weight: 400;
		padding: 8px;
		border-radius: var(--border-radius-l);
		color: var(--color-neutral-100);
		background-color: var(--color-neutral-800);
		border: 1px solid var(--color-neutral-500);

		&:hover {
			border-color: var(--color-neutral-300);
		}

		&--active {
			background-color: var(--color-primary-darkest);
			color: var(--color-primary);
			border-color: var(--color-primary-dark);

			&:hover {
				border-color: var(--color-primary);
			}

			span.header__hamburger-line {
				background-color: var(--color-primary);
			}
		}
	}

	span.header__hamburger-line {
		display: block;
		width: 20px;
		height: 1px;
		border-radius: var(--border-radius-m);
		background-color: var(--color-neutral-300);
	}

	/* ------------------------------------------------------------------------ */

	a.primary-action {
		display: flex;
		align-items: center;
		column-gap: 8px;
		text-decoration: none;
		font-size: 14px;
		font-weight: 600;
		padding: 8px 12px;
		margin-left: auto;
		border-radius: var(--border-radius-l);
		color: var(--color-neutral-50);
		border: 1px solid var(--color-neutral-500);

		&:hover {
			border-color: var(--color-neutral-300);
		}

		&--active {
			background-color: var(--color-primary-darkest);
			color: var(--color-primary);
			border-color: var(--color-primary-dark);

			&:hover {
				border-color: var(--color-primary);
			}
		}
	}

	span.primary-action__icon {
		display: block;
		font-size: 12px;
		width: 12px;
	}

	/* ------------------------------------------------------------------------ */

	footer.layout__footer {
		display: flex;
		width: 100%;
		gap: 24px;
		font-size: 13px;
		text-align: center;
		padding: 24px;
		box-sizing: border-box;
		margin-inline: auto;
		color: var(--color-neutral-300);
		background-color: var(--color-neutral-1000);

		@media (max-width: 768px) {
			flex-direction: column-reverse;
			text-align: unset;
			margin-inline: unset;
		}
	}
</style>
