<script lang="ts">
	import { onMount } from 'svelte';

	export let isLoading = false;

	let interval;
	let placeholders: NodeListOf<HTMLElement>;

	const animateLineWidths = () => {
		placeholders.forEach((placeholder) => {
			placeholder.style.width = `${Math.floor(Math.random() * (100 - 80 + 1)) + 80}%`;
		});
	};

	onMount(() => {
		placeholders = document.querySelectorAll<HTMLElement>('.article__list-placeholder li');
		animateLineWidths();
	});

	const THREE_SECONDS = 3000;

	$: if (isLoading) {
		interval = setInterval(() => {
			animateLineWidths();
		}, THREE_SECONDS);
	}
</script>

<div class="article__category-placeholder" />

<ul class="article__list-placeholder">
	<li class="article__headline-placeholder" />
	<li class="article__headline-placeholder" />
	<li class="article__headline-placeholder" />
</ul>

<ul class="article__list-placeholder">
	<li class="article__paragraph-placeholder" />
	<li class="article__paragraph-placeholder" />
	<li class="article__paragraph-placeholder" />
</ul>

<ul class="article__list-placeholder">
	<li class="article__paragraph-placeholder" />
	<li class="article__paragraph-placeholder" />
	<li class="article__paragraph-placeholder" />
	<li class="article__paragraph-placeholder" />
</ul>

<ul class="article__list-placeholder">
	<li class="article__paragraph-placeholder" />
	<li class="article__paragraph-placeholder" />
</ul>

<style lang="scss">
	ul.article__list-placeholder {
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		row-gap: 2px;
		list-style: none;
	}

	div.article__category-placeholder,
	li.article__headline-placeholder,
	li.article__paragraph-placeholder {
		width: 100%;
		color: hsl(0, 0%, 90%);
		background-color: hsl(0, 0%, 90%);
		padding: 0;
		transition: 500ms width;
		border-radius: var(--border-radius);
	}

	div.article__category-placeholder {
		height: 14px;
		width: 25%;
	}

	li.article__headline-placeholder {
		height: 32px;
	}

	li.article__paragraph-placeholder {
		height: 16px;
	}
</style>
