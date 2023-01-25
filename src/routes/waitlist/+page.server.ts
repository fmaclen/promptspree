import type { ClientResponseError } from 'pocketbase';
import { logErrorToSlack } from '$lib/slack.server';
import type { Actions } from './$types';

export const actions = {
	default: async ({ locals, request }) => {
		const formData = await request.formData();

		try {
			await locals.pb.collection('users').create(formData);
		} catch (err) {
			logErrorToSlack(err);
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
