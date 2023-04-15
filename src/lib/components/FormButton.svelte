<script lang="ts">
	import { Sentiment } from '$lib/utils';

	export let label: string;
	export let disabled: boolean = false;
	export let isCompact: boolean = false;
	export let sentiment: Sentiment = Sentiment.NEUTRAL;
	export let type: 'button' | 'submit' | 'reset' | null | undefined = 'button';
	export let hierarchy: 'secondary' | undefined = undefined;
</script>

<button
	{type}
	{disabled}
	class="form-button
		{sentiment ? `form-button--${sentiment}` : ''}
		{isCompact ? 'form-button--compact' : ''}
		{hierarchy ? `form-button--${hierarchy}` : ''}
		"
	on:click
>
	{label}
</button>

<style lang="scss">
	button.form-button {
		padding: 16px 24px;
		font-size: 14px;
		font-weight: 600;
		box-sizing: border-box;
		text-align: center;
		width: 100%;
		cursor: pointer;
		font-family: var(--font-base);
		border-radius: var(--border-radius-l);
		border: 1px solid var(--color-green);
		background-color: var(--color-green);
		color: var(--color-neutral-950);

		&:active {
			transform: scale(0.98);
		}

		&--secondary {
			color: var(--color-yellow);
			background-color: var(--color-yellow-darkest);
			border-color: var(--color-yellow-darker);

			&:hover {
				border-color: var(--color-yellow);
			}
		}

		&--positive {
			background-color: var(--color-green);
			border-color: var(--color-green);
		}

		&--negative {
			color: var(--color-neutral-50);
			background-color: var(--color-red);
			border-color: var(--color-red);

			&.form-button--secondary {
				background-color: var(--color-red-dark);
				color: var(--color-red);
			}
		}

		&--compact {
			padding: 8px 16px;
		}

		&:disabled {
			cursor: default;
			pointer-events: none;

			box-shadow: none;
			color: var(--color-neutral-500);
			border-color: var(--color-neutral-900);
			background-color: var(--color-neutral-900);
		}
	}
</style>
