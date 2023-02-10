import { redirect } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = ({ locals }) => {
	locals.pb.authStore.clear();
	locals.user = null;

	throw redirect(303, '/');
};
