<script lang="ts">
	export let label: string;
	export let type: 'button' | 'submit' | 'reset' | null | undefined = 'button';
	export let disabled: boolean = false;
</script>

<button {type} {disabled} class="form-button">{label}</button>

<style lang="scss">
	button.form-button {
		border-radius: 4px;
		border: none;
		padding: 12px;
		letter-spacing: -0.03em;
		font-size: 14px;
		font-weight: 600;
		font-family: var(--font-base);
		background-color: var(--color-accent);
		color: var(--color-white);
		cursor: pointer;

		&:hover {
			border-color: var(--color-black-alpha35);
		}

		&:active {
			transform: scale(0.95);
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
