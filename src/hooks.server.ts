import { POCKETBASE_URL } from '$lib/pocketbase.server';
import type { Handle, RequestEvent } from '@sveltejs/kit';
import Pocketbase from 'pocketbase';

export const handle: Handle = async ({ event, resolve }) => {
	await handleUserAuth(event);

	// Handle protected paths
	if (!event.locals.user) {
		const PROTECTED_PATHS = ['/play'];
		if (PROTECTED_PATHS.some((path) => event.url.pathname.includes(path))) {
			return Response.redirect(`${event.url.origin}/login`, 303);
		}
	}

	// Set cookies
	const response = await resolve(event);
	response.headers.set('set-cookie', event.locals.pb.authStore.exportToCookie({ secure: false }));

	return response;
};

const handleUserAuth = async (event: RequestEvent) => {
	event.locals.pb = new Pocketbase(POCKETBASE_URL);
	event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

	try {
		if (event.locals.pb.authStore.isValid) {
			await event.locals.pb.collection('users').authRefresh();
			event.locals.user = structuredClone(event.locals.pb.authStore.model); // Serialize non POJOs
		}
	} catch (_) {
		event.locals.pb.authStore.clear();
		event.locals.user = undefined;
	}
};
