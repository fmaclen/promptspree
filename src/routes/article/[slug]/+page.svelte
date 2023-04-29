<script lang="ts">
	import { ArticleSize } from '$lib/articles';
	import ArticleLayout from '$lib/components/ArticleLayout.svelte';
	import ArticleSummaries from '$lib/components/ArticleSummaries.svelte';
	import Head from '$lib/components/Head.svelte';
	import Section from '$lib/components/Section.svelte';
	import type { User } from '$lib/users';

	import type { PageData } from './$types';

	export let data: PageData;

	let article = data.article;
	let currentUser = data.user as User | undefined;
</script>

<Head title={[article.headline]} description={article.body[0]} />

<Section>
	<ArticleLayout {article} size={ArticleSize.FULL} {currentUser} />
</Section>

{#if data.suggestedArticles.length > 0}
	<Section title="In other news">
		<ArticleSummaries
			articles={data.suggestedArticles.slice(0, 7)}
			singleSize={ArticleSize.MEDIUM}
		/>
	</Section>
{/if}
