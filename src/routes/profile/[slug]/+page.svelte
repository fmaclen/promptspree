<script lang="ts">
	import ArticleSummaries from '$lib/components/ArticleSummaries.svelte';
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

	<ArticleSummaries articles={data.articles} isCurrentUserProfile={data.isCurrentUserProfile} />
</Section>
