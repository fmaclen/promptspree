<script lang="ts">
	import { page } from '$app/stores';
	import A from '$lib/components/A.svelte';
	import HR from '$lib/components/HR.svelte';
	import Logo from '$lib/components/Logo.svelte';
	import { APP_NAME } from '$lib/utils';
	import { slide } from 'svelte/transition';

	import type { PageData } from './$types';

	export let data: PageData;
	let isExpanded = false;
</script>

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

			<Logo title={APP_NAME} hasDarkBackground={true} on:click={() => (isExpanded = false)} />

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

	<HR />
	<footer class="layout__footer">
		<A href="/">
			&copy; {new Date().getFullYear()}
			{APP_NAME}
		</A>
		<A href="/legal/">Terms of service</A>
		<A href="/legal/">Privacy policy</A>
		<A href="https://github.com/fmaclen/promptspree/">GitHub</A>
	</footer>
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

		--text-shadow-white-50: 1px 1px 0 rgba(255, 255, 255, 0.5);
		--text-shadow-white-100: 1px 1px 0 var(--color-white);

		--color-politics: hsl(180, 55%, 40%);
		--color-politics-secondary: hsla(180, 100%, 40%, 0.075);
		--color-business: hsl(216, 55%, 40%);
		--color-business-secondary: hsla(216, 100%, 40%, 0.075);
		--color-technology: hsl(252, 55%, 40%);
		--color-technology-secondary: hsla(252, 100%, 40%, 0.075);
		--color-entertainment: hsl(288, 55%, 40%);
		--color-entertainment-secondary: hsla(288, 100%, 40%, 0.075);
		--color-science: hsl(324, 55%, 40%);
		--color-science-secondary: hsla(324, 100%, 40%, 0.075);
		--color-health: hsl(0, 55%, 40%);
		--color-health-secondary: hsla(0, 100%, 40%, 0.075);
		--color-sports: hsl(36, 55%, 40%);
		--color-sports-secondary: hsla(36, 100%, 40%, 0.075);
		--color-culture: hsl(72, 55%, 40%);
		--color-culture-secondary: hsla(72, 100%, 40%, 0.075);
		--color-fashion: hsl(108, 55%, 40%);
		--color-fashion-secondary: hsla(108, 100%, 40%, 0.075);
		--color-opinion: hsl(144, 55%, 40%);
		--color-opinion-secondary: hsla(144, 100%, 40%, 0.075);

		height: 100%;
		margin: 0;
		font-family: var(--font-sans);
		color: hsl(0, 0%, 30%);
		background-color: hsl(0, 0%, 95%);
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
		border-right: 1px solid hsl(0, 0%, 85%);
		background-color: var(--color-accent);

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
			box-shadow: 0 1px 0 rgba(255, 255, 255, 0.15), inset 0 -1px 0 rgba(0, 0, 0, 0.25);
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
		text-shadow: -1px -1px 0 rgba(0, 0, 0, 0.15);
		color: rgba(255, 255, 255, 0.75);
	}

	strong.aside__strong {
		font-weight: 600;
	}

	button.aside__button,
	a.aside__a {
		border-top: 1px solid transparent;
		border-bottom: 1px solid transparent;

		&:hover {
			color: var(--color-white);
			background-color: rgba(0, 0, 0, 0.15);
		}
	}

	a.aside__a[aria-disabled='true'] {
		pointer-events: none;
		text-decoration: line-through;
		color: rgba(255, 255, 255, 0.25);
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

		background-color: var(--color-accent);
		color: var(--color-white);
		box-shadow: 0 1px 0 rgba(255, 255, 255, 0.15), inset 0 -1px 0 rgba(0, 0, 0, 0.25);
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
		border-radius: 2px;
		cursor: pointer;
		border: 1px solid rgba(255, 255, 255, 0.15);

		&:hover {
			border-color: rgba(255, 255, 255, 0.5);
		}
	}

	span.header__hamburger-line {
		display: block;
		width: 20px;
		height: 1px;
		border-radius: 2px;
		background-color: rgba(255, 255, 255, 0.5);
	}

	/* ------------------------------------------------------------------------ */

	a.primary-action {
		display: flex;
		align-items: center;
		column-gap: 8px;
		text-decoration: none;
		color: var(--color-white);
		font-size: 14px;
		font-weight: 600;
		padding: 8px 12px;
		border-radius: 2px;
		margin-left: auto;
		border: 1px solid rgba(255, 255, 255, 0.15);

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

	/* ------------------------------------------------------------------------ */

	footer.layout__footer {
		display: flex;
		gap: 24px;
		font-size: 13px;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.5);
		text-shadow: var(--text-shadow-white-100);
		text-align: center;
		padding: 24px;
		margin-inline: auto;

		@media (max-width: 768px) {
			flex-direction: column-reverse;
			text-align: unset;
			margin-inline: unset;
		}
	}
</style>
