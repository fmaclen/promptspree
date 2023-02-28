import { handlePocketbaseErrors } from '$lib/pocketbase.server';
import { logEventToSlack } from '$lib/slack.server';
import { fail, redirect } from '@sveltejs/kit';

import type { PageServerLoad } from '../$types';
import type { Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.pb.authStore.isValid) throw redirect(303, '/');
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();

		const email = formData.get('email')?.toString();
		if (!email) return fail(400, { error: 'No email address provided' });

		try {
			await locals.pb.collection('users').requestPasswordReset(email);
		} catch (err) {
			logEventToSlack(`/login/+page.server.ts: ${email}`, err);
			return handlePocketbaseErrors(err);
		}
	}
};
