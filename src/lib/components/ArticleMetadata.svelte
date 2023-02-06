<script lang="ts">
	import { formatDistance } from 'date-fns';

	export let id: string;
	export let nickname: string;
	export let updated: string;
</script>

<nav class="metadata">
	<a class="metadata__a" href={`/profile/${id}`}>
		<span class="metadata__author">{nickname}</span>

		<time class="metadata__time" title={updated} datetime={updated}>
			{formatDistance(new Date(updated), new Date(), {
				addSuffix: true
			})}
		</time>
	</a>
	<slot />
</nav>

<style lang="scss">
	nav.metadata {
		min-height: 48px;
		padding: 6px 8px 6px 16px;
		width: 100%;
		box-sizing: border-box;
		font-size: 13px;
		display: grid;
		grid-template-columns: auto max-content;
		row-gap: 32px;
		align-items: center;

		border-top: 1px solid rgba(0, 0, 0, 0.2);
		box-shadow: inset 1px 1px 0 rgba(255, 255, 255, 0.5);
	}

	span.metadata__author {
		font-weight: 600;
		color: inherit;
		text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.5);
	}

	time.metadata__time {
		margin-left: 4px;
		color: hsl(0, 0%, 50%);
		text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.5);
	}

	a.metadata__a {
		display: grid;
		grid-template-columns: max-content auto;
		align-items: center;
		column-gap: 4px;

		color: inherit;
		text-decoration: none;
		width: 100%;
		height: 100%;
	}
</style>
