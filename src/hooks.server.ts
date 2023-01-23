import type { Handle } from '@sveltejs/kit';
import { pb, serializeNonPOJOs } from '$lib/+server.pocketbase';

const redirectTo = (origin: string, route: string) => {
	const url = new URL(origin);
	// url.protocol = process.env.USE_HTTP === 'true' ? 'http:' : 'https:';
	return Response.redirect(`${url.origin}${route}`, 303);
};

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.pb = pb;
	event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

	if (event.locals.pb.authStore.isValid) {
		// Is authorized :D
		event.locals.user = serializeNonPOJOs(event.locals.pb.authStore.model);
	} else {
		// Is not authorized :(
		event.locals.user = undefined;

		const PROTECTED_PATHS = ['/editor'];

		if (PROTECTED_PATHS.some((path) => event.url.pathname.includes(path))) {
			return redirectTo(event.url.origin, '/login');
		}
	}
	const response = await resolve(event);
	response.headers.set('set-cookie', event.locals.pb.authStore.exportToCookie({ secure: false }));

	return response;
};
