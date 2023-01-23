<script>
	import FormField from '$lib/components/FormField.svelte';
	import FormInput from '$lib/components/FormInput.svelte';
	import FormButton from '$lib/components/FormButton.svelte';
</script>

<form class="form" action="?/login" method="POST">
	<fieldset class="form__fieldset">
		<FormField label="E-mail">
			<FormInput
				type="email"
				name="email"
				value="steve@example.com"
				placeholder="steve@example.com"
			/>
		</FormField>

		<FormField label="Password">
			<FormInput type="password" name="password" value="1234567890" />
		</FormField>

		<FormButton type="submit" label="Login" />
	</fieldset>
</form>

<style lang="scss">
	form.form {
		background-color: var(--color-grey3);
		padding: 64px;
	}

	fieldset.form__fieldset {
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
