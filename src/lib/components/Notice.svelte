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
		padding: 16px 8px;
		box-sizing: border-box;

		color: hsl(0, 0%, 40%);
		background-color: hsl(0, 0%, 93%);
		text-shadow: var(--text-shadow-white-50);

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
