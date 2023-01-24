import type { ClientResponseError } from 'pocketbase';
import type { Actions } from './$types';

export const actions = {
	join: async ({ locals, request }) => {
		const data = Object.fromEntries(await request.formData());

		try {
			await locals.pb.collection('users').create(data);
		} catch (error) {
			const clientError = error as ClientResponseError;

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
