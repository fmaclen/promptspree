<script>
	import FormField from '$lib/components/FormField.svelte';
	import FormInput from '$lib/components/FormInput.svelte';
	import FormButton from '$lib/components/FormButton.svelte';
</script>

<form class="form" action="?/register" method="POST">
	<fieldset class="form__fieldset">
		<FormField label="E-mail">
			<FormInput type="email" name="email" placeholder="steve@example.com" />
		</FormField>

		<FormField label="Password">
			<FormInput type="password" name="password" />
		</FormField>

		<FormField label="Confirm password">
			<FormInput type="password" name="confirmPassword" />
		</FormField>

		<FormButton type="submit" label="Register" disabled={true} />
	</fieldset>
</form>

<style lang="scss">
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
