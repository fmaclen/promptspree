<fieldset class="form-fieldset">
	<slot />
</fieldset>

<style lang="scss">
	fieldset.form-fieldset {
		border: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		max-width: 480px;
		margin-inline: auto;
	}
</style>
