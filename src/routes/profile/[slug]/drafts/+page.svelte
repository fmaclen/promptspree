<script lang="ts">
	import A from '$lib/components/A.svelte';
	import ArticleSummaries from '$lib/components/ArticleSummaries.svelte';
	import Head from '$lib/components/Head.svelte';
	import Notice from '$lib/components/Notice.svelte';
	import Section from '$lib/components/Section.svelte';

	import ProfileHeader from '../../ProfileHeader.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	let profile = data.profile;
	let articles = data.articles;
</script>

<Head title={[profile.nickname, 'Drafts', 'Profile']} />

<ProfileHeader
	nickname={profile.nickname}
	id={profile.id}
	isCurrentUserProfile={data.isCurrentUserProfile}
	totalPublished={data.totalPublished}
	totalDrafts={articles.length}
	promptScore={profile.promptScore}
	created={profile.created}
/>

<Section>
	{#if articles.length > 0}
		<ArticleSummaries {articles} />
	{:else}
		<Notice>No draft articles, <A href="/play" isHighlighted={true}>generate one</A></Notice>
	{/if}
</Section>
