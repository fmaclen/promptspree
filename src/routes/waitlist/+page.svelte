<script lang="ts">
	import type { ActionData } from './$types';

	import FormField from '$lib/components/FormField.svelte';
	import FormInput from '$lib/components/FormInput.svelte';
	import FormButton from '$lib/components/FormButton.svelte';
	import Notice from '$lib/components/Notice.svelte';
	import FormFieldset from '$lib/components/FormFieldset.svelte';

	$: email = '';
	$: nickname = '';
	$: password = '';
	$: passwordConfirm = '';
	$: isSubmitDisabled = !email || !nickname || !password || password !== passwordConfirm;

	export let form: ActionData;
</script>

<form class="form" action="?/join" method="POST">
	<FormFieldset>
		{#if form?.status == 200}
			<Notice>{form.message}</Notice>
		{:else}
			<FormField label="E-mail">
				<FormInput
					type="email"
					name="email"
					placeholder="steve@example.com"
					required={true}
					bind:value={email}
				/>

				{#if form?.message?.email?.message}
					<Notice>{form.message.email.message}</Notice>
				{/if}
			</FormField>

			<FormField label="Nickname">
				<FormInput
					name="nickname"
					placeholder="CosmicDamascus"
					required={true}
					bind:value={nickname}
				/>

				{#if form?.message?.nickname?.message}
					<Notice>{form.message.nickname.message}</Notice>
				{/if}
			</FormField>

			<FormField label="Password">
				<FormInput type="password" name="password" required={true} bind:value={password} />

				{#if form?.message?.password?.message}
					<Notice>{form.message.password.message}</Notice>
				{/if}
			</FormField>

			<FormField label="Confirm password">
				<FormInput
					type="password"
					name="passwordConfirm"
					required={true}
					bind:value={passwordConfirm}
				/>
			</FormField>

			<FormButton type="submit" label="Join waitlist" disabled={isSubmitDisabled} />
		{/if}
	</FormFieldset>
</form>
