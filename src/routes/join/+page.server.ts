import { handlePocketbaseErrors } from '$lib/pocketbase.server';
import { logEventToSlack } from '$lib/slack.server';
import { error } from '@sveltejs/kit';

import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const formData = await request.formData();

		// Need to manually convert the checkbox value to a boolean for Pocketbase
		const hasAcceptedTerms = formData.get('terms') === 'on';
		if (hasAcceptedTerms) formData.set('terms', 'true');

		try {
			await locals.pb.collection('users').create(formData);
		} catch (err) {
			logEventToSlack(`/join/+page.server.ts: ${formData.get('email')}`, err);
			return handlePocketbaseErrors(err);
		}

		// Send verification email
		const emailAddress = formData.get('email')?.toString();
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Check it's a valid email address
		if (!emailAddress || !emailRegex.test(emailAddress)) throw error(400, 'Invalid email');

		await locals.pb.collection('users').requestVerification(emailAddress);

		return {
			success: true
		};
	}
};
