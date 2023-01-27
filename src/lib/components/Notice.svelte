<script lang="ts">
	import { Sentiment } from '$lib/utils';

	export let sentiment: Sentiment = Sentiment.NEUTRAL;
</script>

<div class="notice {sentiment !== Sentiment.NEUTRAL ? `notice--${sentiment}` : ''}">
	<slot />
</div>

<style lang="scss">
	div.notice {
		font-family: var(--font-mono);
		color: var(--color-grey50);
		text-align: center;
		width: 100%;
		font-size: 14px;
		background-color: var(--color-grey5);
		padding: 16px 8px;
		box-sizing: border-box;

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
