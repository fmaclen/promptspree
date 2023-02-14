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
		totalDrafts={data.totalDrafts}
		totalPublished={data.articles.length}
		promptScore={data.profile.promptScore}
		created={data.profile.created}
	/>

	{#if data.articles.length > 0}
		<ArticleSummaries articles={data.articles} isCurrentUserProfile={data.isCurrentUserProfile} />
	{:else if data.isCurrentUserProfile}
		<Notice>No published articles, <A href="/play" isHighlighted={true}>create one</A></Notice>
	{:else}
		<Notice>{data.profile.nickname} has not published any articles</Notice>
	{/if}
</Section>
