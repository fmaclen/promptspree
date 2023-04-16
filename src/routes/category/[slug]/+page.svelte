<script lang="ts">
	import A from '$lib/components/A.svelte';
	import ArticleSummaries from '$lib/components/ArticleSummaries.svelte';
	import Head from '$lib/components/Head.svelte';
	import Notice from '$lib/components/Notice.svelte';
	import Section from '$lib/components/Section.svelte';
	import HeadlineXl from '../../../lib/components/HeadlineXL.svelte';

	import type { PageData } from './$types';

	export let data: PageData;
	$: articles = data.articles;
	$: category = data.category;
</script>

<Head title={[category, 'Articles']} />

<HeadlineXl>{category}</HeadlineXl>

<Section>
	{#if articles.length > 0}
		<ArticleSummaries {articles} />
	{:else}
		<Notice>
			There are no articles in the <strong class="category-name">{category}</strong>
			category, try
			<A href="/play" isHighlighted={true}>creating one</A>
		</Notice>
	{/if}
</Section>

<style lang="scss">
	strong.category-name {
		font-weight: 600;
	}
</style>
