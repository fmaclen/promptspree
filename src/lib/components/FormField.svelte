<script lang="ts">
	export let label: string;
</script>

<label class="form-field">
	<span class="form-field__span">{label}</span>
	<slot />
</label>

<style lang="scss">
	label.form-field {
		@include paragraph-s;
		display: flex;
		flex-direction: column;
		gap: 8px;
		color: var(--color-neutral-200);
		width: 100%;
	}

	span.form-field__span {
		font-weight: 600;
	}
</style>
