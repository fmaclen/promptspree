<script lang="ts">
	import { type SubmitFunction, enhance } from '$app/forms';
	import FormButton from '$lib/components/FormButton.svelte';
	import FormField from '$lib/components/FormField.svelte';
	import FormFieldset from '$lib/components/FormFieldset.svelte';
	import FormInput from '$lib/components/FormInput.svelte';
	import Notice from '$lib/components/Notice.svelte';
	import Plate from '$lib/components/Plate.svelte';
	import Section from '$lib/components/Section.svelte';
	import { Sentiment } from '$lib/utils';

	let isLoading = false;
	let email = '';
	let password = '';
	let error = '';
	$: isSubmitDisabled = !email || !password || isLoading;

	const handleSubmit: SubmitFunction = () => {
		isLoading = true;
		error = ''; // Clear existing error

		return async ({ result, update }) => {
			if (result.type == 'failure') {
				error = "Can't login, check your credentials";
				password = ''; // Reset password
			}

			isLoading = false;
			await update();
		};
	};
</script>

<Section title="Login">
	<Plate>
		<form class="form" method="POST" use:enhance={handleSubmit}>
			<FormFieldset>
				{#if error}
					<Notice sentiment={Sentiment.NEGATIVE}>{error}</Notice>
				{/if}

				<FormField label="E-mail">
					<FormInput
						type="email"
						name="email"
						placeholder="cosmic.damascus@example.com"
						required={true}
						bind:value={email}
					/>
				</FormField>

				<FormField label="Password">
					<FormInput type="password" name="password" required={true} bind:value={password} />
				</FormField>

				<FormButton type="submit" label="Login" disabled={isSubmitDisabled} />
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
