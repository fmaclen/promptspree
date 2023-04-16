<script lang="ts">
	import A from '$lib/components/A.svelte';
	import Head from '$lib/components/Head.svelte';
	import HeadlineXl from '$lib/components/HeadlineXL.svelte';
	import P from '$lib/components/P.svelte';
	import Section from '$lib/components/Section.svelte';
	import { APP_EMAIL, APP_NAME } from '$lib/utils';
	import Notice from '../../lib/components/Notice.svelte';
</script>

<Head title={['Terms & conditions']} />

<Section>
	<div class="legal">
		<div class="legal__content">
			<HeadlineXl>Terms of service</HeadlineXl>

			<P>
				Thank you for trying {APP_NAME}. By choosing to use this app, you agree to the following
				terms and conditions:
			</P>

			<ol class="legal__ol">
				<li>
					We reserve the right to update and modify these terms of service at any time without
					notice. It is your responsibility to regularly review these terms for any changes or
					updates.
				</li>
				<li>
					We strive to maintain the availability and functionality of our app, however, we cannot
					guarantee that it will always be available or error-free.
				</li>
				<li>
					You are responsible for maintaining the confidentiality of your account information,
					including your username and password, and any activities that occur under your account.
				</li>
				<li>
					You are prohibited from using our app for any illegal or unauthorized purposes. You must
					also comply with all laws in your jurisdiction, including but not limited to copyright and
					intellectual property laws.
				</li>
				<li>
					We are not responsible for any content that you or others may post or share on our web
					application. You are solely responsible for any content that you post, and we do not
					endorse any content posted by users of our app.
				</li>
				<li>
					We may use cookies and other tracking technologies to improve the functionality of our web
					application. By using our app, you consent to our use of these technologies.
				</li>
				<li>
					If you have any questions or concerns about these terms of service, please contact us at
					<A href="mailto:{APP_EMAIL}" isHighlighted={true}>{APP_EMAIL}</A>.
				</li>
				<li>
					By using {APP_NAME}, you agree to be bound by these terms of service. We appreciate your
					use of our app and look forward to providing you with a great experience.
				</li>
			</ol>
		</div>

		<div class="legal__content">
			<HeadlineXl>Privacy Policy</HeadlineXl>

			<P>
				By interacting with this app you also consent to the collection, usage and sharing of your
				personal information as outlined in this privacy policy. We take the protection of your
				personal information seriously, please review our policy to understand how we handle your
				data.
			</P>

			<ol class="legal__ol">
				<li>
					When you create an account with us, we may collect certain personal information such as
					your name and email address. Additionally, we may gather information about your usage of
					our web application, such as the pages you visit and the features you utilize.
				</li>
				<li>
					We utilize the personal information we collect to provide and improve our services and to
					communicate with you regarding your account and our offerings.
				</li>
				<li>
					In certain cases, we may share your personal information with third parties for the
					purpose of providing and improving our app or as required by law. We take appropriate
					measures to safeguard your personal information from unauthorized access or disclosure.
				</li>
				<li>
					We do not sell your personal information to third parties for their marketing purposes.
					You have the right to access and update your personal information that we collect and
					maintain. You can access and update your personal information through your account
					settings, or by contacting us at <A href="mailto:{APP_EMAIL}" isHighlighted={true}
						>{APP_EMAIL}</A
					>.
				</li>
				<li>
					By using {APP_NAME}, you agree to the terms outlined in this privacy policy. If you have
					any questions or concerns regarding our privacy practices, please contact us at <A
						href="mailto:{APP_EMAIL}"
						isHighlighted={true}>{APP_EMAIL}</A
					>.
				</li>
			</ol>
		</div>
	</div>
</Section>

<style lang="scss">
	div.legal {
		display: grid;
		grid-auto-flow: column;
		gap: 128px;

		@media (max-width: 768px) {
			grid-auto-flow: row;
			gap: 64px;
		}
	}

	div.legal__content {
		@include paragraph-m;
		display: flex;
		flex-direction: column;
		row-gap: 32px;
	}

	ol.legal__ol {
		@include paragraph-s;
		display: flex;
		flex-direction: column;
		row-gap: 14px;
		margin: 0;
		padding-left: 24px;
		color: var(--color-neutral-200);
	}
</style>
