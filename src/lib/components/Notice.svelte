<script lang="ts">
	import { Sentiment } from '$lib/utils';

	export let sentiment: Sentiment = Sentiment.NEUTRAL;
</script>

<div class="notice {sentiment !== Sentiment.NEUTRAL ? `notice--${sentiment}` : ''}">
	<slot />
</div>

<style lang="scss">
	div.notice {
		text-align: center;
		width: 100%;
		font-size: 14px;
		padding: 16px;
		box-sizing: border-box;
		background-color: var(--color-neutral-900);
		color: var(--color-neutral-200);

		&--positive {
			background-color: var(--color-positive-secondary);
			color: var(--color-positive);
		}

		&--negative {
			background-color: var(--color-negative-secondary);
			color: var(--color-negative);
		}
	}
</style>
