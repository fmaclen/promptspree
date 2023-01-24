<script lang="ts">
	import type { ActionData } from './$types';

	import FormField from '$lib/components/FormField.svelte';
	import FormInput from '$lib/components/FormInput.svelte';
	import FormButton from '$lib/components/FormButton.svelte';
	import Notice from '$lib/components/Notice.svelte';
	import FormFieldset from '$lib/components/FormFieldset.svelte';

	$: email = '';
	$: password = '';
	$: isSubmitDisabled = !email || !password;

	export let form: ActionData;
</script>

<form class="form" action="?/login" method="POST">
	<FormFieldset>
		{#if form?.status == 401}
			<Notice>{form.message || form.status}</Notice>
		{/if}

		<FormField label="E-mail">
			<FormInput
				type="email"
				name="email"
				placeholder="steve@example.com"
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
