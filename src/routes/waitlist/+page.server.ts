import type { ClientResponseError } from 'pocketbase';
import { logEventToSlack } from '$lib/slack.server';
import type { Actions } from './$types';

export const actions = {
	default: async ({ locals, request }) => {
		const formData = await request.formData();

		// Need to manually convert the checkbox value to a boolean for Pocketbase
		const hasAcceptedTerms = formData.get('terms') === 'on';
		if (hasAcceptedTerms) formData.set('terms', 'true');

		try {
			await locals.pb.collection('users').create(formData);
		} catch (err) {
			logEventToSlack("WAITLIST: coudnl't join waitlist", err);
			const clientError = err as ClientResponseError;

			return {
				status: clientError.data.code,
				message: { ...clientError.data.data }
			};
		}

		return {
			status: 200,
			message: "You have been added to the waitlist. We'll email you as soon as a spot opens up."
		};
	}
} satisfies Actions;
