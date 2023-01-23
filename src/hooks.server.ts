import type { Handle } from '@sveltejs/kit';
import { pb, serializeNonPOJOs } from '$lib/+server.utils';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.pb = pb;
	event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

	if (event.locals.pb.authStore.isValid) {
		event.locals.user = serializeNonPOJOs(event.locals.pb.authStore.model);
		// console.log('11111', event.locals.user);
	} else {
		// console.log('22222', event.locals.pb);
		event.locals.user = undefined;
	}
	const response = await resolve(event);
	response.headers.set('set-cookie', event.locals.pb.authStore.exportToCookie({ secure: false }));

	return response;
};
