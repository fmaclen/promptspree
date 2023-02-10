<script lang="ts">
	import { type SubmitFunction, enhance } from '$app/forms';
	import A from '$lib/components/A.svelte';
	import FormButton from '$lib/components/FormButton.svelte';
	import FormField from '$lib/components/FormField.svelte';
	import FormFieldset from '$lib/components/FormFieldset.svelte';
	import FormInput from '$lib/components/FormInput.svelte';
	import HR from '$lib/components/HR.svelte';
	import Notice from '$lib/components/Notice.svelte';
	import P from '$lib/components/P.svelte';
	import Plate from '$lib/components/Plate.svelte';
	import Section from '$lib/components/Section.svelte';
	import { Sentiment } from '$lib/utils';

	type PocketbaseFieldErrors = {
		[key: string]: {
			code: string;
			message: string;
		};
	};

	let isLoading = false;
	let email = '';
	let nickname = '';
	let password = '';
	let passwordConfirm = '';
	let hasAcceptedTerms = false;
	let errors: PocketbaseFieldErrors | undefined;
	let success = '';
	$: isSubmitDisabled =
		!email ||
		!nickname ||
		!password ||
		password !== passwordConfirm ||
		!hasAcceptedTerms ||
		isLoading;

	const handleSubmit: SubmitFunction = () => {
		isLoading = true;
		errors = undefined; // Clear existing errors

		return async ({ result, update }) => {
			switch (result.type) {
				case 'success':
					success = result.data?.message;
					break;
				case 'failure':
					errors = result.data?.data;
					password = ''; // Reset password
					passwordConfirm = ''; // Reset password confirmation
					break;
				default:
					break;
			}
			isLoading = false;
			await update();
		};
	};
</script>

<Notice>Already have an account? <A href="/login" isHighlighted={true}>Login</A></Notice>
<HR />

<Section title="Join to play">
	<Plate>
		<form class="form" method="POST" use:enhance={handleSubmit}>
			<FormFieldset>
				{#if success}
					<Notice sentiment={Sentiment.POSITIVE}>{success}</Notice>
				{:else}
					<FormField label="E-mail">
						<FormInput
							type="email"
							name="email"
							placeholder="cosmic.damascus@example.com"
							required={true}
							bind:value={email}
						/>

						{#if errors?.email}
							<Notice sentiment={Sentiment.NEGATIVE}>Email is already in use or is invalid</Notice>
						{/if}
					</FormField>

					<FormField label="Nickname">
						<FormInput
							name="nickname"
							placeholder="CosmicDamascus"
							required={true}
							bind:value={nickname}
						/>

						{#if errors?.nickname}
							<Notice sentiment={Sentiment.NEGATIVE}>Nickname is already taken or is invalid</Notice
							>
						{/if}
					</FormField>

					<FormField label="Password">
						<FormInput type="password" name="password" required={true} bind:value={password} />

						{#if errors?.password}
							<Notice sentiment={Sentiment.NEGATIVE}>Passwords didn't match</Notice>
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

					<div class="form-field-checkbox">
						<label class="form-field-checkbox__label">
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
						{#if errors?.terms}
							<Notice sentiment={Sentiment.NEGATIVE}
								>You must agree to the terms and conditions</Notice
							>
						{/if}
					</div>

					<FormButton type="submit" label="Join" disabled={isSubmitDisabled} />
				{/if}
			</FormFieldset>
		</form>
	</Plate>
</Section>

<style lang="scss">
	form.form {
		@import '$lib/components/Form.scss';
		@include baseForm;
	}

	div.form-field-checkbox {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	label.form-field-checkbox__label {
		display: flex;
		align-items: center;
		column-gap: 12px;
		font-size: 14px;
		padding: 12px;
		border: 1px solid hsl(0, 0%, 85%);
		box-shadow: inset 1px 1px 0 hsl(0, 0%, 97%);
		border-radius: 2px;
	}

	input.form-field-checkbox__input {
		margin: 0;

		&:checked {
			accent-color: var(--color-accent);
		}
	}
</style>
