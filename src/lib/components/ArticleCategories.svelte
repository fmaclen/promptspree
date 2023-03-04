<script lang="ts">
	import { ArticleCategory } from '$lib/article';
	import HR from '$lib/components/HR.svelte';

	export let currentCategory: ArticleCategory | null = null;

	const categories = Object.keys(ArticleCategory).map((key) => {
		return {
			id: key.toLowerCase(),
			label: ArticleCategory[key as keyof typeof ArticleCategory]
		};
	});

	enum CategoryIcons {
		POLITICS = '🏛️',
		BUSINESS = '💼',
		TECHNOLOGY = '🖥️',
		ENTERTAINMENT = '🎭',
		SCIENCE = '🔬',
		HEALTH = '🏥',
		SPORTS = '⚽️',
		CULTURE = '🎨',
		FASHION = '👗',
		OPINION = '💭'
	}

	function categoryIcon(categoryLabel: string): string {
		return CategoryIcons[categoryLabel.toUpperCase() as keyof typeof CategoryIcons];
	}
</script>

<nav class="categories">
	{#each categories as category}
		<a
			href="/category/{category.id}"
			class="categories__a categories__a--{category.id} {currentCategory === category.label
				? 'categories__a--active'
				: ''}"
		>
			<!-- Emoji -->
			<span aria-label={category.label}>
				{categoryIcon(category.label)}
			</span>

			<!-- Category name -->
			{category.label}
		</a>
	{/each}
</nav>

<HR />

<style lang="scss">
	nav.categories {
		display: flex;
		max-width: 100%;
		overflow-x: auto;
		padding: 16px 24px;
		box-sizing: border-box;
		gap: 8px;
		margin-inline: auto;
	}

	a.categories__a {
		display: flex;
		column-gap: 8px;
		align-items: center;
		text-decoration: none;
		font-size: 13px;
		font-weight: 600;
		box-sizing: border-box;
		border-radius: var(--border-radius);
		padding: 8px 16px;
		color: inherit;
		text-shadow: var(--text-shadow-white-100);
		background-color: var(--color-white);
		/* border: 1px solid var(--color-white); */

		&--active,
		&:hover {
			color: var(--color-accent);
			background-color: var(--color-accent-secondary);
			border-color: var(--color-accent);
		}
	}
</style>
