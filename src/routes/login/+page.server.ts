import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import { logErrorToSlack } from '$lib/slack.server';

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

				return {
					status: 200,
					message: 'You are in the waitlist'
				};
			}
		} catch (err) {
			logEventToSlack(`LOGIN: ${email}`, err);

			return {
				status: 400,
				message: 'Invalid email or password'
			};
		}

		throw redirect(303, '/');
	}
} satisfies Actions;
