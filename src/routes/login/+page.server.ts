import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { logEventToSlack } from '$lib/slack.server';

export const actions = {
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
			logEventToSlack(`LOGIN: ${email}`, err);

			return fail(400, {
				message: 'Invalid email or password',
				email
			});
		}

		// User is logged in, redirect to homepage
		throw redirect(303, '/');
	}
} satisfies Actions;
