<script lang="ts">
	import { ArticleCategory } from '$lib/articles';
	import Category from '$lib/components/Category.svelte';

	export let currentCategory: ArticleCategory | null = null;

	const categories = Object.keys(ArticleCategory).map((key) => {
		return {
			id: key.toLowerCase(),
			label: ArticleCategory[key as keyof typeof ArticleCategory]
		};
	});
</script>

<nav class="categories">
	{#each categories as category}
		<Category label={category.label} isActive={currentCategory === category.label} />
	{/each}
</nav>

<style lang="scss">
	nav.categories {
		display: flex;
		justify-content: center;
		gap: 8px;
		overflow-x: auto;
		padding: 16px 24px;
		box-sizing: border-box;
		background-color: var(--color-neutral-900);

		@media (max-width: 768px) {
			position: relative;
			justify-content: flex-start;
		}
	}
</style>
