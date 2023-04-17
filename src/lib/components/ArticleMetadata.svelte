<script lang="ts">
	import { type Article, ArticleSize, ArticleStatus } from '$lib/articles';
	import type { User } from '$lib/users';
	import { formatDistance } from 'date-fns';

	import ArticleReactions from './ArticleReactions.svelte';

	export let article: Article;
	export let size: ArticleSize;
	export let currentUser: User | null = null;

	const isActionable = size === ArticleSize.FULL;
	const isPublishable =
		isActionable && article.isCreatedByCurrentUser && article.status === ArticleStatus.DRAFT;
</script>

<aside class="metadata">
	<nav class="metadata__nav">
		<div class="metadata__author">
			<a class="metadata__a" href={`/profile/${article.user.id}`}>
				{article.user.nickname}
			</a>

			<time class="metadata__time" title={article.updated} datetime={article.updated}>
				{formatDistance(new Date(article.updated), new Date(), {
					addSuffix: true
				})}
			</time>
		</div>
		<ArticleReactions
			{article}
			currentUserCanReact={currentUser !== null && isActionable && !isPublishable}
		/>
	</nav>
</aside>

<style lang="scss">
	aside.metadata {
		@include paragraph-xs;
		width: 100%;
		box-sizing: border-box;
		display: flex;
		gap: 16px;
		flex-direction: column;
		color: var(--color-neutral-200);
	}

	div.metadata__author {
		display: flex;
		flex-direction: column;
		gap: 2px;
		color: inherit;
	}

	time.metadata__time {
		color: var(--color-neutral-300);
	}

	a.metadata__a {
		display: block;
		color: inherit;
		text-decoration: none;
		font-weight: bold;

		&:hover {
			color: var(--color-green);
		}
	}

	nav.metadata__nav {
		display: flex;
		column-gap: 8px;
		justify-content: space-between;
	}
</style>
