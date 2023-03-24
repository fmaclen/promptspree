<script lang="ts">
	import { ArticleSize } from '$lib/articles';
	import Article from '$lib/components/Article.svelte';
	import Head from '$lib/components/Head.svelte';
	import Section from '$lib/components/Section.svelte';

	import type { PageData } from './$types';

	export let data: PageData;
	let article = data.article;
</script>

<Head title={[article.headline]} description={article.body[0]} />

<Section>
	<Article {article} size={ArticleSize.FULL} />
</Section>
