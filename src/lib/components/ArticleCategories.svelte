<script lang="ts">
	import { ArticleCategory } from '$lib/article';
	import HR from '$lib/components/HR.svelte';

	export let currentCategory: ArticleCategory | null = null;

	const categories = Object.keys(ArticleCategory).map((key) => {
		return {
			id: key.toLowerCase(),
			name: ArticleCategory[key as keyof typeof ArticleCategory]
		};
	});
</script>

<nav class="categories">
	{#each categories as category}
		<a
			href="/category/{category.id}"
			class="categories__a categories__a--{category.id} {currentCategory === category.name
				? 'categories__a--active'
				: ''}"
		>
			{category.name}
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
		text-decoration: none;
		font-size: 13px;
		font-weight: 600;
		box-sizing: border-box;
		border-radius: 2px;
		border: 1px solid;
		padding: 8px 16px;
		text-shadow: var(--text-shadow-white-100);

		&--politics {
			border-color: var(--color-politics);
			color: var(--color-politics);

			&.categories__a--active,
			&:hover {
				background-color: var(--color-politics-secondary);
			}
		}

		&--business {
			border-color: var(--color-business);
			color: var(--color-business);

			&.categories__a--active,
			&:hover {
				background-color: var(--color-business-secondary);
			}
		}

		&--technology {
			border-color: var(--color-technology);
			color: var(--color-technology);

			&.categories__a--active,
			&:hover {
				background-color: var(--color-technology-secondary);
			}
		}

		&--entertainment {
			border-color: var(--color-entertainment);
			color: var(--color-entertainment);

			&.categories__a--active,
			&:hover {
				background-color: var(--color-entertainment-secondary);
			}
		}

		&--science {
			border-color: var(--color-science);
			color: var(--color-science);

			&.categories__a--active,
			&:hover {
				background-color: var(--color-science-secondary);
			}
		}

		&--health {
			border-color: var(--color-health);
			color: var(--color-health);

			&.categories__a--active,
			&:hover {
				background-color: var(--color-health-secondary);
			}
		}

		&--sports {
			border-color: var(--color-sports);
			color: var(--color-sports);

			&.categories__a--active,
			&:hover {
				background-color: var(--color-sports-secondary);
			}
		}

		&--culture {
			border-color: var(--color-culture);
			color: var(--color-culture);

			&.categories__a--active,
			&:hover {
				background-color: var(--color-culture-secondary);
			}
		}

		&--fashion {
			border-color: var(--color-fashion);
			color: var(--color-fashion);

			&.categories__a--active,
			&:hover {
				background-color: var(--color-fashion-secondary);
			}
		}

		&--opinion {
			border-color: var(--color-opinion);
			color: var(--color-opinion);

			&.categories__a--active,
			&:hover {
				background-color: var(--color-opinion-secondary);
			}
		}
	}
</style>
