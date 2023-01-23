<script lang="ts">
	import Article from '$lib/components/Article.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<section class="homepage">
	{#if data.articles.length > 0}
		<div class="homepage__articles">
			{#each data.articles as article}
				<Article {article} />
			{/each}
		</div>
	{:else}
		<p class="homepage__empty">
			Having trouble displaying the articles.<br />Server might be temporarily offline or AI may
			have already taken over.
		</p>
		<p class="homepage__empty">In any case, try again later.</p>
	{/if}
</section>

<style lang="scss">
	section.homepage {
		display: flex;
		align-items: center;
		flex-direction: column;
	}

	div.homepage__articles {
		margin-top: calc(calc(var(--section-spacing) + 3rem) * -1);
		column-count: 3;
		break-inside: avoid-column;
	}

	p.homepage__empty {
		font-family: var(--font-mono);
		text-align: center;
		width: 100%;
		font-size: 14px;
		color: var(--color-grey50);
	}
</style>
