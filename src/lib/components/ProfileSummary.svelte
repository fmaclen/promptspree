<script lang="ts">
	import Plate from '$lib/components/Plate.svelte';

	export let id: string;
	export let isCurrentUserProfile: boolean = false;
	export let totalPublished: number = 0;
	export let totalDrafts: number = 0;
	export let promptScore: number;
	export let created: string;
</script>

<Plate>
	<ul class="profile-summary">
		<li class="profile-summary__li">
			<nav class="profile-summary__segmented-control">
				<a class="profile-summary__a" href="/profile/{id}">
					<strong>Published</strong>
					{totalPublished}
				</a>

				{#if isCurrentUserProfile}
					<a class="profile-summary__a" href="/profile/{id}/drafts">
						<strong>Drafts</strong>
						{totalDrafts}
					</a>
				{/if}
			</nav>
		</li>

		<li class="profile-summary__li">
			<strong>Prompt score</strong>
			{promptScore}
		</li>

		<li class="profile-summary__li">
			<strong>Joined</strong>
			{new Date(created).toLocaleDateString('en-US', {
				month: 'long',
				year: 'numeric'
			})}
		</li>
	</ul>
</Plate>

<style lang="scss">
	ul.profile-summary {
		display: flex;
		width: 100%;
		box-sizing: border-box;
		justify-content: space-between;
		padding: 20px;
		column-gap: 20px;
		font-size: 14px;
    margin: 0;
    list-style: none;
	}

	/* li.profile-summary__li {
	} */

  nav.profile-summary__segmented-control {
    display: flex;
    border: 1px solid;
  }

	strong {
		font-weight: 600;
	}
</style>
