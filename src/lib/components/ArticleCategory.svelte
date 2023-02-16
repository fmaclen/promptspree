<script lang="ts">
	export let category: string;
	export let href: string | undefined = undefined;
</script>

<h3 class="article__category article__category--{category.toLowerCase()}">
	{#if href}
		<a {href} class="article__category-a">
			<slot />
		</a>
	{:else}
		<slot />
	{/if}
</h3>

<style lang="scss">
	h3.article__category {
		margin: 0;
		font-size: 13px;
		line-height: 1em;
		font-weight: 600;
		color: var(--color-black);

		&--politics {
			color: var(--color-politics);
		}

		&--business {
			color: var(--color-business);
		}

		&--technology {
			color: var(--color-technology);
		}

		&--entertainment {
			color: var(--color-entertainment);
		}

		&--science {
			color: var(--color-science);
		}

		&--health {
			color: var(--color-health);
		}

		&--sports {
			color: var(--color-sports);
		}

		&--culture {
			color: var(--color-culture);
		}

		&--fashion {
			color: var(--color-fashion);
		}

		&--opinion {
			color: var(--color-opinion);
		}
	}

	a.article__category-a {
		text-decoration: none;
		color: inherit;

		&:hover {
			text-decoration: underline;
		}
	}
</style>
