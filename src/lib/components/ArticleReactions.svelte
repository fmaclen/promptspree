<script lang="ts">
	import { type SubmitFunction, enhance } from '$app/forms';
	import { type Article, ArticleStatus } from '$lib/articles';
	import AddReaction from '$lib/components/icons/AddReaction.svelte';
	import Loading from '$lib/components/icons/Loading.svelte';
	import type { Reactions } from '$lib/reactions';
	import { slide } from 'svelte/transition';

	export let article: Article;
	export let currentUserCanReact: boolean = false;

	$: reactions = article.reactions;

	// Filter out reactions with no total, then sort by total
	$: reactionsByTotal = reactions.byType
		.filter((reaction) => reaction.total > 0)
		.sort((a, b) => b.total - a.total);

	const handleReaction: SubmitFunction = () => {
		isLoading = true;
		toggleContextMenuVisibility();

		return async ({ result, update }) => {
			if (result.type === 'success' && result.data) {
				isLoading = false;
				article = { ...article, reactions: result.data as Reactions };
			}
			await update();
		};
	};

	let isLoading = false;
	let isContextMenuVisible = false;

	function toggleContextMenuVisibility() {
		isContextMenuVisible = !isContextMenuVisible;
	}
</script>

<nav class="reactions">
	{#if reactions.total > 0 && article.status !== ArticleStatus.DRAFT}
		<a
			href="/article/{article.id}"
			class={`reactions__summary ${
				reactions.byCurrentUser !== null ? 'reactions__summary--active' : ''
			}`}
		>
			{#each reactionsByTotal as reaction}
				<span class="reactions__summary-emoji">
					{reaction.reaction}
				</span>
			{/each}
			<span class="reactions__summary-total">{reactions.total}</span>
		</a>
	{/if}

	{#if currentUserCanReact}
		<div class="reactions__context-menu-container">
			<button
				class={`reactions__context-menu-toggle ${
					isContextMenuVisible ? 'reactions__context-menu-toggle--active' : ''
				}`}
				on:click={toggleContextMenuVisibility}
			>
				{#if isLoading}
					<Loading />
				{:else}
					<AddReaction isActive={isContextMenuVisible} />
				{/if}
			</button>

			{#if isContextMenuVisible}
				<div class="reactions__context-menu">
					{#each article.reactions.byType as reaction}
						<form
							class="reactions__context-menu"
							action="/article/{article.id}?/react"
							method="POST"
							use:enhance={handleReaction}
						>
							<input type="hidden" name="reaction" value={reaction.index} />
							<input type="hidden" name="article" value={article.id} />
							<button
								type="submit"
								class="reactions__context-menu-reaction
								{article.reactions.byCurrentUser === reaction.index
									? 'reactions__context-menu-reaction--active'
									: ''}"
							>
								{reaction.reaction}
							</button>
						</form>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</nav>

<style lang="scss">
	nav.reactions {
		display: flex;
		column-gap: 4px;
	}

	div.reactions__context-menu-container {
		position: relative;
	}

	div.reactions__context-menu {
		position: absolute;
		display: flex;
		flex-direction: column;
		gap: 6px;
		text-align: center;
		width: 100%;
		box-sizing: border-box;
		padding: 6px;
		margin-top: 6px;
		background-color: var(--color-neutral-600);
		border-radius: var(--border-radius-l);
	}

	a.reactions__summary {
		text-decoration: none;
	}

	button.reactions__context-menu-toggle {
		cursor: pointer;
		width: 56px;
	}

	button.reactions__context-menu-reaction {
		display: block;
		width: 100%;
		border-radius: var(--border-radius-m);
		font-size: 16px;
		cursor: pointer;

		@media (hover: hover) and (pointer: fine) {
			&:hover {
				background-color: var(--color-neutral-500);
			}
		}
	}

	a.reactions__summary,
	button.reactions__context-menu-toggle,
	button.reactions__context-menu-reaction {
		@include baseButton;
		min-height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		border: none;
		box-sizing: border-box;
	}

	a.reactions__summary,
	button.reactions__context-menu-toggle {
		@media (hover: hover) and (pointer: fine) {
			&:focus,
			&:hover {
				border-color: var(--color-neutral-400);
			}
		}
	}

	a.reactions__summary,
	button.reactions__context-menu-reaction {
		&--active,
		&--active:hover {
			color: var(--color-blue-light);
			background-color: var(--color-blue-darker);
		}
	}
	
	a.reactions__summary {
		&--active span.reactions__summary-total,
		&--active:hover  {
			color: var(--color-blue-light);
			background-color: var(--color-blue-darker);
		}
	}

	span.reactions__summary-emoji {
		font-size: 16px;
		text-shadow: 0 0 8px var(--color-neutral-800);

		&:not(:first-child) {
			margin-left: -0.65em;
		}
	}

	span.reactions__summary-total {
		font-size: 13px;
		color: var(--color-neutral-300);
	}
</style>
