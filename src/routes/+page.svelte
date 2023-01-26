<script lang="ts">
	import Article from '$lib/components/Article.svelte';
	import Notice from '$lib/components/Notice.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<section class="homepage">
	{#if data.articles.length > 0}
		<div class="homepage__articles">
			{#each data.articles as article}
				<Article {article} isPreview={true} />
			{/each}
		</div>
	{:else}
		<Notice>
			Having trouble displaying the articles.<br />Server might be temporarily offline or AI may
			have already taken over.
		</Notice>
		<Notice>In any case, try again later.</Notice>
	{/if}
</section>

<style lang="scss">
	section.homepage {
		display: flex;
		align-items: center;
		flex-direction: column;
	}

	div.homepage__articles {
		column-count: 3;
		break-inside: avoid-column;
		column-gap: 16px;

		@media (max-width: 1440px) {
			column-count: 2;
		}

		@media (max-width: 720px) {
			columns: unset;
		}
	}
</style>
