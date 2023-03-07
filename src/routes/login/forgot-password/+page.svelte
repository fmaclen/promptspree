<script lang="ts">
	import { type SubmitFunction, enhance } from '$app/forms';
	import A from '$lib/components/A.svelte';
	import FormButton from '$lib/components/FormButton.svelte';
	import FormField from '$lib/components/FormField.svelte';
	import FormFieldset from '$lib/components/FormFieldset.svelte';
	import FormInput from '$lib/components/FormInput.svelte';
	import HR from '$lib/components/HR.svelte';
	import Head from '$lib/components/Head.svelte';
	import Notice from '$lib/components/Notice.svelte';
	import Plate from '$lib/components/Plate.svelte';
	import Section from '$lib/components/Section.svelte';
	import { Sentiment, UNKNOWN_ERROR_MESSAGE } from '$lib/utils';

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
</script>

<Head title={['Forgot your password?']} />

<Notice>Don't have an account? <A href="/join" isHighlighted={true}>Join to play</A></Notice>
<HR />

<Section isVerticallyCentered={true} title="Forgot your password?">
	{#if success}
		<Notice sentiment={Sentiment.POSITIVE}>
			Email has been sent. Reset the password and
			<A href="/login" isHighlighted={true} sentiment={Sentiment.POSITIVE}>login here</A>
		</Notice>
	{:else if error}
		<Notice sentiment={Sentiment.NEGATIVE}>
			{error}
		</Notice>
	{:else}
		<Notice>
			Enter the email address you used to join and we'll send instructions to reset your password
		</Notice>
	{/if}

	<Plate>
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
	</Plate>
</Section>

<style lang="scss">
	form.form {
		@import '$lib/components/Form.scss';
		@include baseForm;
	}
</style>
