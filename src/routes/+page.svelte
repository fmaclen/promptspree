<script lang="ts">
	import Article from '$lib/components/Article.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<section class="homepage">
	<div class="homepage__articles">
		{#each data.articles as article}
			<Article {article} />
		{/each}
	</div>
</section>

<style lang="scss">
	section.homepage {
		display: flex;
		align-items: center;
	}

	div.homepage__articles {
		margin-top: calc(calc(var(--section-spacing) + 3rem) * -1);
		column-count: 3;
		break-inside: avoid-column;
	}
</style>
