<script lang="ts">
	import { ArticleCategory } from '$lib/articles';
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

<style lang="scss">
	nav.categories {
		display: flex;
		justify-content: center;
		gap: 8px;
		overflow-x: auto;
		padding: 16px 24px;
		box-sizing: border-box;
		background-color: var(--color-neutral-900);
	}

	a.categories__a {
		display: flex;
		column-gap: 8px;
		align-items: center;
		text-decoration: none;
		font-size: 13px;
		font-weight: 600;
		box-sizing: border-box;
		padding: 8px 16px;
		color: inherit;
		border-radius: var(--border-radius-l);
		color: var(--color-neutral-100);
		background-color: var(--color-neutral-800);
		border: 1px solid var(--color-neutral-500);

		&:hover {
			border-color: var(--color-neutral-300);
		}

		&--active {
			background-color: var(--color-primary-darkest);
			color: var(--color-primary);
			border-color: var(--color-primary-dark);

			&:hover {
				border-color: var(--color-primary);
			}
		}
	}
</style>
