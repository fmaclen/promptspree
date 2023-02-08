<script lang="ts">
	export let label: string;
	export let type: 'button' | 'submit' | 'reset' | null | undefined = 'button';
	export let disabled: boolean = false;
	export let secondary: boolean = false;
</script>

<button {type} {disabled} class="form-button {secondary ? 'form-button--secondary' : ''}" on:click
	>{label}</button
>

<style lang="scss">
	button.form-button {
		padding: 16px;
		font-family: var(--font-sans);
		font-size: 13px;
		font-weight: 600;
		box-sizing: border-box;
		text-align: center;
		border-radius: 2px;
		box-shadow: inset 2px 2px 0 rgba(255, 255, 255, 0.35);

		width: 100%;
		cursor: pointer;
		border: 1px solid var(--color-accent);
		color: var(--color-white);
		background-color: var(--color-accent);

		&:hover {
			color: var(--color-white);
			background-color: var(--color-accent);
			box-shadow: inset 2px 2px 0 rgba(255, 255, 255, 0.15);
		}

		&:active {
			transform: scale(0.98);
		}

		&--secondary {
			background-color: transparent;
			color: hsl(0, 0%, 30%);
			border: 1px solid hsl(0, 0%, 80%);
			box-shadow: inset 2px 2px 0 rgba(255, 255, 255, 0.5);
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
