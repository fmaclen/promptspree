<script lang="ts">
	import { page } from '$app/stores';
	import HeadlineXl from '$lib/components/HeadlineXL.svelte';

	export let id: string;
	export let nickname: string;
	export let isCurrentUserProfile: boolean = false;
	export let totalPublished: number = 0;
	export let totalDrafts: number = 0;
	export let promptScore: number;
	export let created: Date;

	const isDraftsPage = $page.url.pathname.includes('/drafts');
</script>

<HeadlineXl>{nickname}</HeadlineXl>

<nav class="profile-nav">
	<ul class="profile-summary">
		{#if isCurrentUserProfile}
			<li class="profile-summary__li profile-summary__li--with-link">
				<a
					class="profile-summary__a {!isDraftsPage ? 'profile-summary__a--active' : ''}"
					href="/profile/{id}"
				>
					<strong class="profile-summary__key">Published</strong>
					<span class="profile-summary__value">{totalPublished}</span>
				</a>
			</li>

			<li class="profile-summary__li profile-summary__li--with-link">
				<a
					class="profile-summary__a {isDraftsPage ? 'profile-summary__a--active' : ''}"
					href="/profile/{id}/drafts"
				>
					<strong class="profile-summary__key">Drafts</strong>
					<span class="profile-summary__value">{totalDrafts}</span>
				</a>
			</li>
		{/if}

		{#if !isCurrentUserProfile}
			<li class="profile-summary__li">
				<strong class="profile-summary__key">Articles</strong>
				<span class="profile-summary__value">{totalPublished}</span>
			</li>
		{/if}

		<li class="profile-summary__li">
			<strong class="profile-summary__key">Prompt score</strong>
			<span class="profile-summary__value">{promptScore}</span>
		</li>

		<li class="profile-summary__li">
			<strong class="profile-summary__key">Joined</strong>
			<span class="profile-summary__value">
				{new Date(created).toLocaleDateString('en-US', {
					month: 'long',
					year: 'numeric'
				})}
			</span>
		</li>
	</ul>
</nav>

<style lang="scss">
	nav.profile-nav {
		overflow-x: auto;
		padding-inline: 32px;
		background-color: var(--color-neutral-900);
	}

	ul.profile-summary {
		display: flex;
		width: max-content;
		margin-inline: auto;
		margin-block: 0;
		padding: 0;
		list-style: none;
		gap: 48px;

		@media (max-width: 640px) {
			gap: 32px;
		}
	}

	li.profile-summary__li {
		display: flex;
		align-self: center;
		gap: 8px;
		flex-grow: 1;
		padding-block: 24px;

		&--with-link {
			padding-block: 0;
		}
	}

	a.profile-summary__a {
		color: var(--color-neutral-400);
		text-decoration: none;
		display: flex;
		gap: 8px;
		padding-inline: 12px;
		padding-block: 24px;

		span.profile-summary__value {
			color: var(--color-neutral-400);
		}

		&--active {
			color: var(--color-green);
			border-bottom: 1px solid var(--color-green);

			span.profile-summary__value {
				color: var(--color-green);
			}
		}
	}

	strong.profile-summary__key,
	span.profile-summary__value {
		@media (max-width: 640px) {
			@include subtitle-m;
		}
	}
	strong.profile-summary__key {
		@include subtitle-l;
	}

	span.profile-summary__value {
		@include subtitle-l;
		font-weight: unset;
		color: var(--color-neutral-300);
	}
</style>
