<script lang="ts">
	import { page } from '$app/stores';
	import HR from '$lib/components/HR.svelte';
	import Logo from '$lib/components/Logo.svelte';
	import { APP_NAME } from '$lib/utils';
	import { onMount } from 'svelte';

	import type { PageData } from './$types';

	export let data: PageData;
	let isSmallViewport = false;
	$: isExpanded = false;

	onMount(() => {
		isSmallViewport = window.innerWidth <= 1024;
		isExpanded = !isSmallViewport;
	});

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

<div class="layout {isExpanded ? 'layout--expanded' : ''}">
	<header class="header">
		<hgroup class="header__hgroup">
			<button
				type="button"
				id="hamburger"
				class="header__hamburger {isExpanded ? 'header__hamburger--expanded' : ''}"
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

			<Logo title={APP_NAME} />

			<a
				class="primary-action {$page.url.pathname.includes('/play')
					? 'primary-action--active'
					: ''}"
				href={$page.url.pathname.includes('/play') ? '/' : '/play'}
			>
				Play
				<span class="primary-action__icon">✨</span>
			</a>
		</hgroup>
		<HR />
	</header>

	<aside
		id="aside"
		class="layout__aside {isExpanded ? 'layout__aside--expanded' : ''}"
		role="region"
		aria-labelledby="hamburger"
	>
		<ul class="aside__ul">
			{#if data.user}
				<li class="aside__li">
					<a class="aside__a" href="/user/{data.user.id}/" aria-disabled="true">
						<strong class="aside__strong">
							{data.user.nickname}
						</strong>
					</a>
				</li>
				<li class="aside__li">
					<a class="aside__a" href="/user/{data.user.id}/drafts/" aria-disabled="true">Drafts</a>
				</li>
				<li class="aside__li">
					<a class="aside__a" href="/settings" aria-disabled="true">Settings</a>
				</li>
				<li class="aside__li">
					<form action="/logout" method="POST" class="">
						<button class="aside__button" type="submit">Logout</button>
					</form>
				</li>
			{:else}
				<li class="aside__li">
					<a class="aside__a" href="/join">
						<strong class="aside__strong">Join to play</strong>
					</a>
				</li>
				<li class="aside__li">
					<a class="aside__a" href="/login">Login</a>
				</li>
			{/if}
		</ul>

		<ul class="aside__ul aside__ul--bottom">
			<li class="aside__li">
				<a class="aside__a" href="https://github.com/fmaclen/promptspree/">GitHub</a>
			</li>
			<li class="aside__li">
				<a class="aside__a" href="/legal/">Terms of service</a>
			</li>
			<li class="aside__li">
				<a class="aside__a" href="/legal/">Privacy policy</a>
			</li>
			<li class="aside__li">
				<span class="aside__copyright">
					&copy; {new Date().getFullYear()}
					{APP_NAME}
				</span>
			</li>
		</ul>
	</aside>

	<main class="layout__main">
		<slot />
	</main>
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
		--color-accent-secondary: hsl(248, 40%, 95%);
		--color-positive: hsl(170, 90%, 39%);
		--color-positive-secondary: hsl(170, 90%, 95%);
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
		position: relative;
		height: 100%;

		&--expanded {
			@media (min-width: 1024px) {
				display: grid;
				grid-template-areas: 'header header' 'aside main';
				grid-template-columns: max-content auto;
				grid-template-rows: max-content auto;
			}
		}
	}

	aside.layout__aside {
		grid-area: aside;

		flex-direction: column;
		justify-content: space-between;
		min-width: 256px;
		border-right: 1px solid hsl(0, 0%, 85%);

		display: none;

		&--expanded {
			display: flex;
		}

		@media (max-width: 1024px) {
			border-right: none;
			position: sticky;
			top: 0;
			z-index: 2;
		}
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

		@media (max-width: 1024px) {
			&:first-child,
			&:last-child {
				padding-top: 12px;
				padding-bottom: 12px;
				border-bottom: 1px solid hsl(0, 0%, 85%);
			}
		}
	}

	li.aside__li {
		font-size: 14px;
	}

	span.aside__copyright,
	button.aside__button,
	a.aside__a {
		display: block;
		color: inherit;
		text-decoration: none;
		font-size: 14px;
		padding: 12px 32px;
		text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.5);
	}

	strong.aside__strong {
		font-weight: 600;
	}

	button.aside__button,
	a.aside__a {
		border-top: 1px solid transparent;
		border-bottom: 1px solid transparent;

		&:hover {
			color: var(--color-accent);
			background-color: var(--color-white);
			border-top-color: hsl(0, 0%, 85%);
			border-bottom-color: hsl(0, 0%, 85%);
			box-shadow: 0 -1px 0 hsl(0, 0%, 95%), 0 1px 0 hsl(0, 0%, 100%);
		}
	}

	a.aside__a[aria-disabled='true'] {
		pointer-events: none;
		color: hsl(0, 0%, 70%);
		text-decoration: line-through;
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

	span.aside__copyright {
		padding-top: 24px;
		font-weight: 400;
		color: hsl(0, 0%, 60%);
	}

	main.layout__main {
		grid-area: main;

		display: flex;
		flex-direction: column;
		height: 100%;
		overflow-y: auto;
	}

	/* ------------------------------------------------------------------------ */

	header.header {
		grid-area: header;

		position: sticky;
		top: 0;
		z-index: 1;
	}

	hgroup.header__hgroup {
		display: flex;
		justify-content: space-between;
		background-color: hsl(0, 0%, 95%);
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
		border-radius: 2px;
		cursor: pointer;

		color: hsl(0, 0%, 50%);
		box-shadow: inset 2px 2px 0 rgba(255, 255, 255, 0.5);
		border: 1px solid hsl(0, 0%, 85%);

		&--expanded,
		&:hover {
			span.header__hamburger-line {
				background-color: var(--color-accent);
			}
		}

		&--expanded {
			border-color: var(--color-accent);
			background-color: var(--color-accent-secondary);
		}
	}

	span.header__hamburger-line {
		display: block;
		width: 20px;
		height: 1px;
		border-radius: 2px;
		background-color: hsl(0, 0%, 65%);
		border-bottom: 1px solid var(--color-white);
	}

	/* ------------------------------------------------------------------------ */

	a.primary-action {
		margin-left: auto;
		display: flex;
		align-items: center;
		column-gap: 8px;
		text-decoration: none;
		color: var(--color-white);
		background-color: var(--color-accent);
		border: 1px solid var(--color-accent);
		box-shadow: inset 2px 2px 0 rgba(255, 255, 255, 0.1);
		font-size: 14px;
		font-weight: 600;
		padding: 8px 12px;
		border-radius: 2px;

		&--active {
			background-color: var(--color-accent-secondary);
			color: var(--color-accent);

			span.primary-action__icon {
				filter: brightness(0);
			}
		}
	}

	span.primary-action__icon {
		display: block;
		font-size: 12px;
		width: 12px;
	}
</style>
