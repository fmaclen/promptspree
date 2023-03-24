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
		color: var(--color-primary);
	}

	a.article__category-a {
		text-decoration: none;
		color: inherit;

		&:hover {
			text-decoration: underline;
		}
	}
</style>
