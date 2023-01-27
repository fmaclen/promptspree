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
		border: none;
		padding: 16px;
		letter-spacing: -0.03em;
		font-size: 14px;
		font-weight: 600;
		font-family: var(--font-base);
		background-color: var(--color-grey90);
		color: var(--color-white);
		cursor: pointer;

		&--positive {
			background-color: var(--color-positive);
		}

		&:hover {
			background-color: var(--color-accent);
		}

		&:active {
			transform: scale(0.95);
			background-color: var(--color-positive);
		}

		&:disabled {
			color: var(--color-grey30);
			background-color: var(--color-grey7);
			border-color: var(--color-grey7);
			cursor: default;
			pointer-events: none;
		}
	}
</style>
