import { handlePocketbaseErrors } from '$lib/pocketbase.server';
import { logEventToSlack } from '$lib/slack.server';

import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();

		const email = formData.get('email')?.toString() || '';

		try {
			await locals.pb.collection('users').requestPasswordReset(email);
		} catch (err) {
			logEventToSlack(`/login/+page.server.ts: ${email}`, err);
			return handlePocketbaseErrors(err);
		}
	}
};
