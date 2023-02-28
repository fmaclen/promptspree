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
		const password = formData.get('password')?.toString();

		try {
			if (!email || !password) throw new Error();

			await locals.pb.collection('users').authWithPassword(email, password);

			if (!locals.pb?.authStore?.model?.verified) {
				locals.pb.authStore.clear();

				return fail(401, {
					message: 'The account has not been verified yet'
				});
			}
		} catch (err) {
			logEventToSlack(`/login/+page.server.ts: ${email}`, err);
			return handlePocketbaseErrors(err);
		}

		// User is logged in, redirect to homepage
		throw redirect(303, '/');
	}
};
