<script lang="ts">
	import type { PageData } from './$types';

	const title = 'The Synthetic Gazette';
	export let data: PageData;

	const today = new Date().toLocaleDateString('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
</script>

<svelte:head>
	<title>{title} | {today}</title>
</svelte:head>

<div class="layout">
	<div class="container">
		<nav class="nav">
			<time class="nav__time">{today}</time>
			{#if data.user}
				<form action="/logout" method="POST" class="nav__form">
					<strong>{data.user.name ? data.user.name : 'Anonymous'}</strong>
					<a class="nav__a" href="/editor">Open Editor</a>
					<button class="nav__button" type="submit">Logout</button>
				</form>
			{:else}
				<a class="nav__a" href="/login">Login</a>
			{/if}
		</nav>
	</div>

	<div class="container">
		<header class="header">
			<a href="/" class="header__a">
				<h1 class="header__logo">{title}</h1>
				<p class="header__slogan">Sensible senselessness is a cause for alarm</p>
			</a>
		</header>
	</div>

	<div class="container">
		<main class="main">
			<slot />
		</main>
	</div>

	<footer class="footer">
		<div class="container">
			{title}
		</div>
	</footer>
</div>

<style lang="scss">
	@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,700;1,400&family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,500;1,300;1,700&display=swap');
	:global(body) {
		margin: 0;
		font-family: 'IBM Plex Mono', 'Courier New', monospace;
	}

	div.layout {
		display: grid;
		grid-template-rows: max-content max-content auto max-content;
		min-height: 100vh;
	}

	div.container {
		width: 100%;
		max-width: 1440px;
		margin-inline: auto;
		padding-left: 4rem;
		padding-right: 4rem;
		box-sizing: border-box;
	}

	nav.nav {
		display: flex;
		grid-auto-flow: column;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid #e2e2e2;
		padding: 1rem 0;
		font-size: 0.9rem;
	}

	form.nav__form {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	a.nav__a,
	button.nav__button {
		font-size: 0.75rem;
		letter-spacing: 0.1em;
		padding: 0.25rem 0.5rem;
		border: 1px solid #e2e2e2;
		background-color: #fff;
		cursor: pointer;

		&:hover {
			border-color: #d1d1d1;
		}
	}

	a.nav__a {
		text-decoration: none;
		color: inherit;
	}

	header.header {
		margin: 6rem 0;
		display: flex;
		flex-direction: column;
		row-gap: 3rem;
		width: 100%;
	}

	a.header__a {
		display: inline-block;
		text-decoration: none;
		color: inherit;
		padding: 0.5rem 1rem;
		margin-inline: auto;
	}

	h1.header__logo {
		font-family: 'EB Garamond', 'Georgia', serif;
		font-style: italic;
		text-align: center;
		letter-spacing: -0.025em;
		font-size: 3.75rem;
		line-height: 1em;
		margin-top: 0;
		margin-bottom: 0.5rem;
	}

	p.header__slogan {
		text-align: center;
		/* font-style: italic; */
		color: #666;
		margin: 0;
		text-transform: uppercase;
		letter-spacing: 0.25em;
		font-size: 0.75rem;
	}

	footer.footer {
		font-family: 'EB Garamond', 'Georgia', serif;
		font-style: italic;
		font-size: 1.5rem;
		letter-spacing: -0.025em;
		color: #fff;
		background-color: #222;
		margin-top: 4rem;
		padding: 3rem;
	}
</style>
