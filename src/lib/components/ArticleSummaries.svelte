<script lang="ts">
	import Article from '$lib/components/Article.svelte';
	import { ArticleSize } from '$lib/articles';
	export let articles: Article[];
	export let isActionable: boolean = false;

	// Set article summary size
  $: articles.forEach((article, index) => {
    if (index <= 7) {
			// The first 7 are medium size
      article.size = ArticleSize.MEDIUM;
    } else {
			// The rest are small size
      article.size = ArticleSize.SMALL;
    }
  });
</script>

<ul class="articles">
	{#each articles as article}
		<li class="articles__li">
			<Article {article} {isActionable} size={article.size} />
		</li>
	{/each}
</ul>

<style lang="scss">
	ul.articles {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	li.articles__li {
		&:not(:first-child) {
			padding-top: 24px;
		}

		&:not(:last-child) {
			padding-bottom: 24px;
			border-bottom: 1px solid var(--color-neutral-600);
		}
	}
</style>
