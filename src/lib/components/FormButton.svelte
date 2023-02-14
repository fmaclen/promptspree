<script lang="ts">
	import { Sentiment } from '$lib/utils';

	export let label: string;
	export let disabled: boolean = false;
	export let isCompact: boolean = false;
	export let sentiment: Sentiment = Sentiment.NEUTRAL;
	export let type: 'button' | 'submit' | 'reset' | null | undefined = 'button';
</script>

<button
	{type}
	{disabled}
	class="form-button {sentiment ? `form-button--${sentiment}` : ''} {isCompact
		? 'form-button--compact'
		: ''}"
	on:click
>
	{label}
</button>

<style lang="scss">
	button.form-button {
		padding: 16px 24px;
		font-family: var(--font-sans);
		font-size: 13px;
		font-weight: 600;
		box-sizing: border-box;
		text-align: center;
		width: 100%;
		cursor: pointer;

		border-radius: 2px;
		border: 1px solid var(--color-accent);
		color: var(--color-white);
		background-color: var(--color-accent);
		box-shadow: inset 1px 1px 0 rgba(255, 255, 255, 0.25);

		&:active {
			transform: scale(0.98);
		}

		&--positive {
			background-color: var(--color-positive);
			border-color: var(--color-positive);
		}

		&--negative {
			background-color: var(--color-negative);
			border-color: var(--color-negative);
		}

		&--compact {
			padding: 8px 16px;
		}

		&:disabled {
			cursor: default;
			pointer-events: none;

			box-shadow: none;
			color: hsl(0, 0%, 75%);
			border-color: hsl(0, 0%, 85%);
			background-color: hsl(0, 0%, 85%);
		}
	}
</style>
