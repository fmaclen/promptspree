<script lang="ts">
	import Article from '$lib/components/Article.svelte';
	import Section from '$lib/components/Section.svelte';

	import type { PageData } from './$types';

	export let data: PageData;
	console.log(data);
</script>

<Section>
	<Article article={data.article} />
</Section>
