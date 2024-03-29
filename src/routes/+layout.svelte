<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import CategoryList from '$lib/components/CategoryList.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Logo from '$lib/components/Logo.svelte';
	import Magic from '$lib/components/icons/Magic.svelte';
	import { APP_NAME } from '$lib/utils';
	import { Toaster } from 'svelte-french-toast';
	import { slide } from 'svelte/transition';

	import type { PageData } from './$types';

	export let data: PageData;
	let isExpanded = false;
	$: isPlaySection = $page.url.pathname.includes('/play');
</script>

<svelte:head>
	{#if data.plausibleDomain}
		<script defer data-domain={data.plausibleDomain} src="https://plausible.io/js/script.js">
		</script>
	{/if}

	{#if data.googleAnalyticsId}
		<!-- Google tag (gtag.js) -->
		<script async src="https://www.googletagmanager.com/gtag/js?id={data.googleAnalyticsId}">
		</script>
		{@html `<script>${`
			window.dataLayer = window.dataLayer || [];
			function gtag() {
				dataLayer.push(arguments);
			}
			gtag('js', new Date());
			gtag('config', '${data.googleAnalyticsId}');
		`}</script>`}
	{/if}
</svelte:head>

<div
	class="layout {isExpanded ? 'layout--expanded' : ''} {isPlaySection ? 'layout--playSection' : ''}"
>
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

			<Logo title={APP_NAME} on:click={() => (isExpanded = false)} />

			<a
				class="primary-action {isPlaySection ? 'primary-action--active' : ''}"
				href={isPlaySection ? '/' : '/play'}
			>
				<span class="primary-action__icon">
					<Magic isActive={isPlaySection} />
				</span>
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
			<CategoryList component="button" />
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

	<Footer user={data.user} />
</div>

<style lang="scss">
	:global(html) {
		height: 100%;
	}

	:global(body) {
		height: 100%;
		margin: 0;
		font-family: var(--font-base);
		color: var(--color-neutral-100);
		background-color: var(--color-neutral-800);
	}

	div.layout {
		position: relative;
		display: flex;
		flex-direction: column;
		height: 100%;
		background-image: url('/HalftoneBackground.svg');
		background-repeat: no-repeat;
		background-position-x: center;
		background-position-y: -33vh;
		background-size: clamp(480px, 100vw, 1024px);

		&--playSection {
			:global(footer.footer) {
				display: none;
			}
		}
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

		@media (hover: hover) and (pointer: fine) {
			&:hover {
				color: var(--color-blue-light);
			}
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

		/*
		position: sticky;
		top: 0;
		z-index: 3;
		background-color: var(--color-neutral-900);
		border-bottom: 1px solid var(--color-neutral-700);
		*/
	}

	hgroup.header__hgroup {
		display: flex;
		justify-content: space-between;
		column-gap: 12px;
		padding-block: 32px;
		padding-inline: 64px;
		box-sizing: border-box;

		@media (max-width: 768px) {
			padding-inline: 24px;
		}
	}

	button.header__hamburger {
		display: flex;
		flex-direction: column;
		row-gap: 2px;
		border: none;
		justify-content: center;
		background-color: transparent;
		cursor: pointer;
		font-weight: 400;
		font-family: var(--font-base);
		color: var(--color-neutral-100);

		&--active {
			span.header__hamburger-line {
				background-color: var(--color-blue-light);
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
		column-gap: 4px;
		text-decoration: none;
		font-size: 14px;
		font-weight: 600;
		color: var(--color-neutral-50);

		@media (max-width: 768px) {
			margin-left: auto;
		}
	}

	span.primary-action__icon {
		display: block;
		font-size: 12px;
	}

	/* ------------------------------------------------------------------------ */

	button.header__hamburger,
	a.primary-action {
		@include baseButton;
		@include baseButtonActive;
	}
</style>
