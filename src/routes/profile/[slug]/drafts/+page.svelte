<script lang="ts">
	import A from '$lib/components/A.svelte';
	import ArticleSummaries from '$lib/components/ArticleSummaries.svelte';
	import Notice from '$lib/components/Notice.svelte';
	import ProfileSummary from '$lib/components/ProfileSummary.svelte';
	import Section from '$lib/components/Section.svelte';

	import type { PageData } from './$types';

	export let data: PageData;
</script>

<Section title={data.profile.nickname}>
	<ProfileSummary
		id={data.profile.id}
		isCurrentUserProfile={data.isCurrentUserProfile}
		totalPublished={data.totalPublished}
		totalDrafts={data.articles.length}
		promptScore={data.profile.promptScore}
		created={data.profile.created}
	/>

	{#if data.articles.length > 0}
		<ArticleSummaries articles={data.articles} isCurrentUserProfile={data.isCurrentUserProfile} />
	{:else}
		<Notice>No draft articles, <A href="/play" isHighlighted={true}>create one</A></Notice>
	{/if}
</Section>
