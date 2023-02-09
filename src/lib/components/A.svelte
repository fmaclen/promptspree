<script lang="ts">
	export let href: string;
	export let target: string = '';
	export let isHighlighted: boolean = false;
</script>

<a class="a {isHighlighted ? 'a--highlighted' : ''}" {target} {href}>
	<slot />
</a>

<style lang="scss">
	a.a {
		text-decoration: none;
		color: inherit;

		&--highlighted {
			color: var(--color-accent);
		}

		&:hover {
			color: var(--color-accent);
		}
	}
</style>
