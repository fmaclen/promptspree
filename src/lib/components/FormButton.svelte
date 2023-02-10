<script lang="ts">
	export let label: string;
	export let type: 'button' | 'submit' | 'reset' | null | undefined = 'button';
	export let disabled: boolean = false;
	export let isPublishable: boolean = false;
</script>

<button {type} {disabled} class="form-button {isPublishable ? 'form-button--publishable' : ''}" on:click>
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
		box-shadow: inset 2px 2px 0 rgba(255, 255, 255, 0.35);

		&:hover {
			color: var(--color-white);
			background-color: var(--color-accent);
			box-shadow: inset 2px 2px 0 rgba(255, 255, 255, 0.15);
		}

		&:active {
			transform: scale(0.98);
		}

		&--publishable {
			background-color: var(--color-positive);
			border-color: var(--color-positive);
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
