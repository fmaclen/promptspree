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
		font-family: var(--font-sans);
		border-radius: var(--border-radius-l);
		border: 1px solid var(--color-primary);
		background-color: var(--color-primary);
		color: var(--color-neutral-950);

		&:active {
			transform: scale(0.98);
		}

		&--secondary {
			color: var(--color-secondary);
			background-color: var(--color-secondary-darkest);
			border-color: var(--color-secondary-darker);

			&:hover {
				border-color: var(--color-secondary);
			}
		}

		&--positive {
			background-color: var(--color-positive);
			border-color: var(--color-positive);
		}

		&--negative {
			background-color: var(--color-negative);
			border-color: var(--color-negative);

			&.form-button--secondary {
				background-color: var(--color-negative-secondary);
				color: var(--color-negative);
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
