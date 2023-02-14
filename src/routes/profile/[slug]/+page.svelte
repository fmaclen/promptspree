<script lang="ts">
	import A from '$lib/components/A.svelte';
	import ArticleSummaries from '$lib/components/ArticleSummaries.svelte';
	import Notice from '$lib/components/Notice.svelte';
	import ProfileSummary from '$lib/components/ProfileSummary.svelte';
	import Section from '$lib/components/Section.svelte';

	import type { PageData } from './$types';

	export let data: PageData;
	let profile = data.profile;
	let articles = data.articles;
	let isCurrentUserProfile = data.isCurrentUserProfile;
</script>

<Section title={profile.nickname}>
	<ProfileSummary
		id={profile.id}
		{isCurrentUserProfile}
		totalDrafts={data.totalDrafts}
		totalPublished={articles.length}
		promptScore={profile.promptScore}
		created={profile.created}
	/>

	{#if articles.length > 0}
		<ArticleSummaries {articles} {isCurrentUserProfile} />
	{:else if data.isCurrentUserProfile}
		<Notice>No published articles, <A href="/play" isHighlighted={true}>generate one</A></Notice>
	{:else}
		<Notice>{profile.nickname} has not published any articles</Notice>
	{/if}
</Section>
