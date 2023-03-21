import { pbAdmin, pocketbaseUrl } from '$lib/pocketbase.server';
import type { Handle, RequestEvent } from '@sveltejs/kit';
import Pocketbase from 'pocketbase';

export const handle: Handle = async ({ event, resolve }) => {
	// Set Admin client
	event.locals.pbAdmin = await pbAdmin();

	// Authenticate current user
	await handleUserAuth(event);

	// Set cookies
	const response = await resolve(event);
	response.headers.set('set-cookie', event.locals.pb.authStore.exportToCookie({ secure: false }));

	return response;
};

const handleUserAuth = async (event: RequestEvent) => {
	event.locals.pb = new Pocketbase(pocketbaseUrl);
	event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

	try {
		if (event.locals.pb.authStore.isValid) {
			await event.locals.pb.collection('users').authRefresh();
			event.locals.user = structuredClone(event.locals.pb.authStore.model); // Serialize non POJOs
		}
	} catch (_) {
		event.locals.pb.authStore.clear();
		event.locals.user = null;
	}
};
