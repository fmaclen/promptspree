<script lang="ts">
	import A from '$lib/components/A.svelte';
	import ArticleCategories from '$lib/components/ArticleCategories.svelte';
	import ArticleSummaries from '$lib/components/ArticleSummaries.svelte';
	import Head from '$lib/components/Head.svelte';
	import Notice from '$lib/components/Notice.svelte';
	import Section from '$lib/components/Section.svelte';

	import type { PageData } from './$types';

	export let data: PageData;
	$: articles = data.articles;
	$: category = data.category;
</script>

<Head title={[category, 'Articles']} />

<ArticleCategories currentCategory={category} />

<Section title={category}>
	{#if articles.length > 0}
		<ArticleSummaries {articles} />
	{:else}
		<Notice
			>There are no articles in the {category} category, try
			<A href="/play" isHighlighted={true}>creating one</A>
		</Notice>
	{/if}
</Section>
