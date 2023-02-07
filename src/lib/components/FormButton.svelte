<script lang="ts">
	export let label: string;
	export let type: 'button' | 'submit' | 'reset' | null | undefined = 'button';
	export let disabled: boolean = false;
	export let sentiment: 'positive' | undefined = undefined;
</script>

<button
	{type}
	{disabled}
	class="form-button {sentiment === 'positive' ? 'form-button--positive' : ''}"
	on:click>{label}</button
>

<style lang="scss">
	button.form-button {
		padding: 10px 12px;
		font-family: var(--font-sans);
		font-size: 13px;
		font-weight: 600;
		color: hsl(0, 0%, 30%);
		background-color: transparent;
		box-sizing: border-box;
		text-align: center;
		border-radius: 2px;
		border: 1px solid hsl(0, 0%, 80%);
		box-shadow: inset 4px 4px 0 rgba(255, 255, 255, 0.35);

		width: 100%;
		cursor: pointer;

		&--positive {
			background-color: var(--color-positive);
		}

		&:hover {
			color: var(--color-white);
			background-color: var(--color-accent);
			box-shadow: inset 4px 4px 0 rgba(255, 255, 255, 0.15);
		}

		&:active {
			transform: scale(0.98);
		}

		&:disabled {
			cursor: default;
			pointer-events: none;

			box-shadow: none;
			color: hsl(0, 0%, 75%);
			border-color: hsl(0, 0%, 85%);
		}
	}
</style>
