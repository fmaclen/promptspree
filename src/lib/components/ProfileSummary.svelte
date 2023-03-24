<script lang="ts">
	import { page } from '$app/stores';
	import Plate from '$lib/components/Plate.svelte';

	export let id: string;
	export let isCurrentUserProfile: boolean = false;
	export let totalPublished: number = 0;
	export let totalDrafts: number = 0;
	export let promptScore: number;
	export let created: Date;

	const isDraftsPage = $page.url.pathname.includes('/drafts');
</script>

<nav class="profile-nav">
	{#if isCurrentUserProfile}
		<Plate>
			<ul class="profile-summary">
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
			</ul>
		</Plate>
	{/if}

	<Plate>
		<ul class="profile-summary">
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
	</Plate>
</nav>

<style lang="scss">
	nav.profile-nav {
		width: 100%;
		display: flex;
		column-gap: 8px;
	}

	ul.profile-summary {
		display: flex;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		margin: 0;
		padding: 0;
		list-style: none;
		border: 1px solid hsl(0, 0%, 85%);
		border-radius: var(--border-radius-l);
	}

	li.profile-summary__li {
		flex: 1;
		padding: 12px;
		font-size: 13px;
		color: hsl(0, 0%, 50%);
		/* box-shadow: inset 1px 1px 0 var(--color-neutral-50); */
		text-shadow: var(--text-shadow-white-100);

		display: flex;
		flex-direction: column;
		row-gap: 2px;
		line-height: 1.1em;
		height: 100%;
		box-sizing: border-box;

		&:not(:first-child) {
			border-left: 1px solid hsl(0, 0%, 85%);
		}

		&--with-link {
			padding: 0;
			color: inherit;
		}

		&:first-child {
			a.profile-summary__a {
				border-top-left-radius: var(--border-radius-l);
				border-bottom-left-radius: var(--border-radius-l);
			}
		}

		&:last-child {
			a.profile-summary__a {
				border-top-right-radius: var(--border-radius-l);
				border-bottom-right-radius: var(--border-radius-l);
			}
		}
	}

	a.profile-summary__a {
		display: flex;
		flex-direction: column;
		row-gap: 2px;
		line-height: 1.1em;
		padding: 12px;
		height: 100%;
		box-sizing: border-box;

		text-decoration: none;
		color: inherit;

		&:hover {
			background-color: hsl(0, 0%, 97%);
		}

		&--active {
			color: var(--color-accent);
			background-color: var(--color-neutral-50);
		}
	}

	strong.profile-summary__key {
		font-weight: 600;
	}

	span.profile-summary__value {
		display: block;
	}
</style>
