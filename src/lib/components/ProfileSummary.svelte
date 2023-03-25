<script lang="ts">
	import { page } from '$app/stores';

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
		<ul class="profile-summary profile-summary--with-links">
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
	{/if}

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
</nav>

<style lang="scss">
	nav.profile-nav {
		width: 100%;
		display: flex;
		column-gap: 24px;
		margin-bottom: 64px;
	}

	ul.profile-summary {
		display: flex;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		margin: 0;
		padding: 0;
		list-style: none;
		gap: 8px;

		&--with-links {
			gap: 0px;
		}
	}

	li.profile-summary__li {
		flex: 1;
		padding: 16px;
		font-size: 13px;
		display: flex;
		flex-direction: column;
		row-gap: 2px;
		line-height: 1.1em;
		height: 100%;
		box-sizing: border-box;
		color: var(--color-neutral-200);
		background-color: var(--color-neutral-700);
		border-radius: var(--border-radius-l);

		&:not(:first-child) {
			border-left: none;
		}

		&--with-link {
			padding: 0;
			color: inherit;
			background-color: var(--color-neutral-700);
			border-radius: 0px;

			&:first-child {
				border-top-left-radius: var(--border-radius-l);
				border-bottom-left-radius: var(--border-radius-l);
	
				a.profile-summary__a {
					border-top-left-radius: var(--border-radius-l);
					border-bottom-left-radius: var(--border-radius-l);
				}
			}
	
			&:last-child {
				border-top-right-radius: var(--border-radius-l);
				border-bottom-right-radius: var(--border-radius-l);

				a.profile-summary__a {
					border-top-right-radius: var(--border-radius-l);
					border-bottom-right-radius: var(--border-radius-l);
				}
			}
		}
	}

	a.profile-summary__a {
		display: flex;
		flex-direction: column;
		row-gap: 2px;
		line-height: 1.1em;
		padding: 16px;
		height: 100%;
		box-sizing: border-box;
		text-decoration: none;
		color: inherit;
		color: var(--color-neutral-200);

		&:hover {
			background-color: var(--color-neutral-600);
		}

		&--active {
			color: var(--color-primary);
			background-color: var(--color-primary-darkest);

			&:hover {
				background-color: var(--color-primary-darker);
			}
		}
	}

	strong.profile-summary__key {
		font-weight: 600;
	}

	span.profile-summary__value {
		display: block;
	}
</style>
