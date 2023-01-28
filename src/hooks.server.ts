import { pb, serializeNonPOJOs } from '$lib/pocketbase.server';
import type { Handle, RequestEvent } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	await handleUserAuth(event);

	// Handle protected paths
	const PROTECTED_PATHS = ['/play'];
	if (PROTECTED_PATHS.some((path) => event.url.pathname.includes(path))) {
		return Response.redirect(`${event.url.origin}/login`, 303);
	}

	// Set cookies
	const response = await resolve(event);
	response.headers.set('set-cookie', event.locals.pb.authStore.exportToCookie({ secure: false }));

	return response;
};

const handleUserAuth = async (event: RequestEvent) => {
	event.locals.pb = pb;
	event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

	try {
		if (event.locals.pb.authStore.isValid) {
			await event.locals.pb.collection('users').authRefresh();
			event.locals.user = serializeNonPOJOs(event.locals.pb.authStore.model);
		}
	} catch (_) {
		event.locals.pb.authStore.clear();
		event.locals.user = undefined;
	}
};
