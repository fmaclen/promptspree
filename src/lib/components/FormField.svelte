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
		gap: 8px;
		font-size: 14px;
		font-weight: 600;
	}
</style>
