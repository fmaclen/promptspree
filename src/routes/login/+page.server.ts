import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';

export const actions = {
	login: async ({ request, locals }) => {
		const body = Object.fromEntries(await request.formData());

		body.email = body.email.toString();
		body.password = body.password.toString();

		try {
			await locals.pb.collection('users').authWithPassword(body.email, body.password);

			if (!locals.pb?.authStore?.model?.verified) {
				locals.pb.authStore.clear();

				return {
					status: 401,
					message: 'You are in the waitlist'
				};
			}
		} catch (err) {
			return {
				status: 401,
				message: 'Invalid email or password'
			};
		}

		throw redirect(303, '/');
	}
} satisfies Actions;
