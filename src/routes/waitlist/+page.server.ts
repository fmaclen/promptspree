import { handlePocketbaseErrors } from '$lib/pocketbase.server';
import { logEventToSlack } from '$lib/slack.server';

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
			logEventToSlack(`/waitlist/+page.server.ts: ${formData.get('email')}`, err);
			return handlePocketbaseErrors(err);
		}

		return {
			success: true,
			message: "You are now in the waitlist! We'll email you as soon as a spot opens up."
		};
	}
};
