<script lang="ts">
	import ArticleCategories from '$lib/components/ArticleCategories.svelte';
	import ArticleSummaries from '$lib/components/ArticleSummaries.svelte';
	import HR from '$lib/components/HR.svelte';
	import Head from '$lib/components/Head.svelte';
	import Notice from '$lib/components/Notice.svelte';
	import Section from '$lib/components/Section.svelte';

	import type { PageData } from './$types';

	export let data: PageData;

	const today = new Date().toLocaleDateString('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
</script>

<Head title={['Frontpage', today]} />

<Notice>Generated by AI, curated by humans</Notice>

<HR />

<ArticleCategories />

{#if data.articles.length === 0}
	<Section isVerticallyCentered={true}>
		<Notice>Sorry, we can't show you the articles right now. Please try again later</Notice>
	</Section>
{:else}
	<Section>
		<ArticleSummaries articles={data.articles} />
	</Section>
{/if}
