<script lang="ts">
	import { type SubmitFunction, enhance } from '$app/forms';
	import A from '$lib/components/A.svelte';
	import FormButton from '$lib/components/FormButton.svelte';
	import FormField from '$lib/components/FormField.svelte';
	import FormFieldset from '$lib/components/FormFieldset.svelte';
	import FormInput from '$lib/components/FormInput.svelte';
	import Head from '$lib/components/Head.svelte';
	import Notice from '$lib/components/Notice.svelte';
	import Plate from '$lib/components/Plate.svelte';
	import Section from '$lib/components/Section.svelte';
	import { UNKNOWN_ERROR_MESSAGE } from '$lib/utils';
	import toast from 'svelte-french-toast';

	import ToastSuccess from './ToastSuccess.svelte';

	let success = false;
	let email = '';
	let error = '';
	$: isSubmitDisabled = !email || success;

	const handleSubmit: SubmitFunction = () => {
		error = '';

		return async ({ result }) => {
			if (result.type == 'failure') {
				error = result.data?.error || UNKNOWN_ERROR_MESSAGE;
			} else {
				success = true;
			}
		};
	};

	$: if (success) toast(ToastSuccess, { duration: Infinity });
	$: if (error) toast.error(error);
</script>

<Head title={['Forgot your password?']} />

<Notice>
	Enter the email address you used to join and we'll send instructions to reset your password
</Notice>

<Section isVerticallyCentered={true} title="Forgot your password?">
	<form class="form" method="POST" use:enhance={handleSubmit}>
		<FormFieldset>
			<FormField label="E-mail">
				<FormInput
					type="email"
					name="email"
					placeholder="cosmic.damascus@example.com"
					required={true}
					disabled={success}
					bind:value={email}
				/>
			</FormField>

			<FormButton type="submit" label="Send password reset email" disabled={isSubmitDisabled} />
		</FormFieldset>
	</form>
</Section>

<style lang="scss">
	form.form {
		@import '$lib/components/Form.scss';
		@include baseForm;
	}
</style>
