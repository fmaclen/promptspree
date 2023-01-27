<script lang="ts">
	import type { ActionData } from './$types';

	import FormField from '$lib/components/FormField.svelte';
	import FormInput from '$lib/components/FormInput.svelte';
	import FormButton from '$lib/components/FormButton.svelte';
	import Notice from '$lib/components/Notice.svelte';
	import FormFieldset from '$lib/components/FormFieldset.svelte';
	import P from '$lib/components/P.svelte';
	import A from '$lib/components/A.svelte';

	let isLoading = false;
	let email = '';
	let nickname = '';
	let password = '';
	let passwordConfirm = '';
	let hasAcceptedTerms = false;
	$: isSubmitDisabled =
		!email ||
		!nickname ||
		!password ||
		password !== passwordConfirm ||
		!hasAcceptedTerms ||
		isLoading;

	export let form: ActionData;
</script>

<form class="form" method="POST" on:submit={() => (isLoading = true)}>
	<FormFieldset>
		{#if form?.status == 200}
			<Notice>{form.message}</Notice>
		{:else}
			<FormField label="E-mail">
				<FormInput
					type="email"
					name="email"
					placeholder="cosmic.damascus@example.com"
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

			<label class="form-field-checkbox">
				<input
					class="form-field-checkbox__input"
					type="checkbox"
					name="terms"
					bind:checked={hasAcceptedTerms}
				/>
				<P>
					I agree to the <A href="/legal" isHighlighted={true}>terms of service</A>
					and
					<A href="/legal" isHighlighted={true}>privacy policy</A>.
				</P>
			</label>

			<FormButton type="submit" label="Join waitlist" disabled={isSubmitDisabled} />
		{/if}
	</FormFieldset>
</form>

<style lang="scss">
	label.form-field-checkbox {
		display: flex;
		align-items: center;
		column-gap: 12px;
		font-size: 14px;
		padding: 12px;
		border: 1px solid var(--color-border);
	}

	input.form-field-checkbox__input {
		margin: 0;

		&:checked {
			accent-color: var(--color-accent);
		}
	}
</style>
