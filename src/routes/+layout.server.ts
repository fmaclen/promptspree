import { env } from '$env/dynamic/private';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ request, locals }) => {
	return {
		googleAnalyticsId: env.GOOGLE_ANALYTICS_ID,
		path: new URL(request.url).pathname, // e.g. `/play`
		user: locals.user || null
	};
};
