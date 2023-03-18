import type { ArticleCompletion } from '$lib/articles';
import type { MessageRole } from '$lib/messages';
import type { MessageCollection } from '$lib/pocketbase.schema';
import { pbAdmin } from '$lib/pocketbase.server';

export async function getMessagesCollection(articleId: string): Promise<MessageCollection[]> {
	try {
		const pb = await pbAdmin();
		return await pb.collection('messages').getFullList(undefined, {
			filter: `article="${articleId}"`
		});
	} catch (_) {
		return [];
	}
}

export async function createMessageCollection(
	articleId: string,
	role: MessageRole,
	content: ArticleCompletion | string
): Promise<MessageCollection | null> {
	try {
		const pb = await pbAdmin();
		return await pb.collection('messages').create({ article: articleId, role, content });
	} catch (_) {
		return null;
	}
}
