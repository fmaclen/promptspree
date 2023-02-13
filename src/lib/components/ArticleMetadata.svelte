<script lang="ts">
	import { type SubmitFunction, enhance } from '$app/forms';
	import { Sentiment } from '$lib/utils';
	import { redirect } from '@sveltejs/kit';
	import { formatDistance } from 'date-fns';

	import FormButton from './FormButton.svelte';

	export let articleId: string;
	export let userId: string;
	export let nickname: string;
	export let updated: string;
	export let isDeletable: boolean = false;
	export let isPublishable: boolean = false;

	const confirmDeletion = (event: any) => {
		const confirmDeletion = window.confirm(
			`Are you sure you want to delete the article?\nThis action cannot be undone`
		);
		if (!confirmDeletion) event.preventDefault();
	};

	const handleDelete: SubmitFunction = () => {
		return async ({ update }) => {
			await update();
		};
	};

	const handlePublish: SubmitFunction = () => {
		return async ({ update }) => {
			await update();
		};
	};
</script>

<nav class="metadata">
	<a class="metadata__a" href={`/profile/${userId}`}>
		<span class="metadata__author">{nickname}</span>

		<time class="metadata__time" title={updated} datetime={updated}>
			{formatDistance(new Date(updated), new Date(), {
				addSuffix: true
			})}
		</time>
	</a>

	<div class="metadata__actions">
		<slot />

		{#if isDeletable || isPublishable}
			<nav class="metadata__author-actions">
				{#if isDeletable}
					<form class="form" method="POST" action="?/delete" use:enhance={handleDelete}>
						<input type="hidden" name="articleId" value={articleId} />
						<FormButton
							label="Delete"
							type="submit"
							isCompact={true}
							sentiment={Sentiment.NEGATIVE}
							on:click={confirmDeletion}
						/>
					</form>
				{/if}

				{#if isPublishable}
					<form class="play__form" method="POST" action="?/publish" use:enhance={handlePublish}>
						<input type="hidden" name="articleId" value={articleId} />
						<FormButton
							label="Publish"
							type="submit"
							isCompact={true}
							sentiment={Sentiment.POSITIVE}
						/>
					</form>
				{/if}
			</nav>
		{/if}
	</div>
</nav>

<style lang="scss">
	nav.metadata {
		min-height: 48px;
		padding: 8px 8px 8px 16px;
		width: 100%;
		box-sizing: border-box;
		font-size: 13px;
		display: grid;
		grid-template-columns: auto max-content;
		row-gap: 32px;
		align-items: center;
		border-top: 1px solid hsl(0, 0%, 85%);
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

		&:hover {
			color: var(--color-accent);
		}
	}

	div.metadata__actions {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		column-gap: 8px;
	}

	nav.metadata__author-actions {
		display: flex;
		column-gap: 8px;
	}
</style>
