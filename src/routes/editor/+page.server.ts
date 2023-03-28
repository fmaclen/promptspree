import { getArticle } from '$lib/articles.server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// if (!locals.pb.authStore.isValid) throw redirect(303, '/join');

	const article = await getArticle(locals, 'wiigjuun78mrlhu');
	return { article };
};
