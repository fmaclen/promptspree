<script lang="ts">
	import { ArticleSize } from '$lib/articles';
	import ArticleLayout from '$lib/components/ArticleLayout.svelte';
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
