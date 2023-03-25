<script lang="ts">
	import type { Article, ArticleSize } from '$lib/articles';
	import ArticleBody from '$lib/components/ArticleBody.svelte';
	import ArticleHeader from '$lib/components/ArticleHeader.svelte';

	export let article: Article;
	export let size: ArticleSize;
</script>

<article class={`article-content article-content--${size}`}>
	<ArticleHeader {article} {size} />
	<ArticleBody {article} {size} />
</article>

<style lang="scss">
	article.article-content {
		display: flex;
		flex-direction: column;
		row-gap: 8px;

		&--full {
			row-gap: 32px;
		}
	}
</style>
