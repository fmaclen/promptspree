<script lang="ts">
	import { Sentiment } from '$lib/utils';

	export let href: string;
	export let target: string = '';
	export let isHighlighted: boolean = false;
	export let sentiment: Sentiment = Sentiment.NEUTRAL;
</script>

<a
	class="a {isHighlighted ? 'a--highlighted' : ''} {sentiment ? `a--${sentiment}` : ''}"
	{target}
	{href}
>
	<slot />
</a>

<style lang="scss">
	a.a {
		text-decoration: none;
		color: inherit;

		&:hover,
		&--highlighted {
			color: var(--color-yellow);
		}

		&--positive {
			color: var(--color-green);
			text-decoration: underline;

			&:hover {
				color: var(--color-green);
				text-decoration: unset;
			}
		}
	}
</style>
