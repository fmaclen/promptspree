<script lang="ts">
	import A from '$lib/components/A.svelte';
	import ArticleSummaries from '$lib/components/ArticleSummaries.svelte';
	import Head from '$lib/components/Head.svelte';
	import Notice from '$lib/components/Notice.svelte';
	import Section from '$lib/components/Section.svelte';

	import ProfileHeader from '../ProfileHeader.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	// These need to be reactive otherwise they won't update when navigating from
	// one profile to the other (e.g. clicking on the user's name in the aside)
	$: profile = data.profile;
	$: articles = data.articles;
	$: isCurrentUserProfile = data.isCurrentUserProfile;
</script>

<Head title={[profile.nickname, 'Profile']} />

<ProfileHeader
	id={profile.id}
	created={profile.created}
	{isCurrentUserProfile}
	nickname={profile.nickname}
	totalDrafts={data.totalDrafts}
	totalPublished={articles.length}
	promptScore={profile.promptScore}
/>

<Section>
	{#if articles.length > 0}
		<ArticleSummaries {articles} />
	{:else if isCurrentUserProfile}
		<Notice>No published articles, <A href="/play" isHighlighted={true}>generate one</A></Notice>
	{:else}
		<Notice>{profile.nickname} has not published any articles</Notice>
	{/if}
</Section>
