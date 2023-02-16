<script lang="ts">
	export let label: string;
</script>

<label class="form-field">
	{label}
	<slot />
</label>

<style lang="scss">
	label.form-field {
		display: flex;
		flex-direction: column;
		gap: 6px;
		font-size: 13px;
		font-weight: 600;
		text-shadow: var(--text-shadow-white-100);
		width: 100%;
	}
</style>
