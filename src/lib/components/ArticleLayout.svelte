<script lang="ts">
	import type { Article, ArticleSize } from '$lib/articles';
	import ArticleContent from '$lib/components/ArticleContent.svelte';
	import ArticleMetadata from '$lib/components/ArticleMetadata.svelte';
	import type { User } from '$lib/users';

	export let article: Article;
	export let size: ArticleSize;
	export let currentUser: User | null = null;
</script>

<div class={`article-layout article-layout--${size}`}>
	<ArticleMetadata {article} {size} {currentUser} />
	<ArticleContent {article} {size} />
</div>

<style lang="scss">
	div.article-layout {
		display: grid;
		grid-template-columns: 1fr 2fr 1fr;
		gap: 56px;

		@media (max-width: 1024px) {
			grid-template-columns: 1fr 2fr;
			gap: 48px;
		}

		@media (max-width: 768px) {
			display: flex;
			flex-direction: column-reverse;
			gap: 32px;
		}
	}

	div.article__container {
		display: flex;
		flex-direction: column;
		row-gap: 8px;

		&--full {
			row-gap: 32px;
		}
	}
</style>
