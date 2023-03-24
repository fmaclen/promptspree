<script lang="ts">
	import Article from '$lib/components/Article.svelte';
	export let articles: Article[];
	export let isActionable: boolean = false;
</script>

<ul class="articles">
	{#each articles as article}
		<li class="articles__li">
			<Article {article} {isActionable} size="medium" />
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
			border-bottom: 1px solid var(--color-neutral-700);
		}
	}
</style>
