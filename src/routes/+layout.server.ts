import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ request, locals }) => {
	return {
		path: new URL(request.url).pathname, // e.g. `/play`
		user: locals.user || null
	};
};
