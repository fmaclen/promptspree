import type { ArticleCompletion } from '$lib/articles';
import type { MessageRole } from '$lib/messages';
import type { MessageCollection } from '$lib/pocketbase.schema';

export async function getMessage(
	locals: App.Locals,
	messageId?: string
): Promise<MessageCollection | null> {
	if (!messageId) return null;

	try {
		const collection: MessageCollection = await locals.pbAdmin
			.collection('messages')
			.getOne(messageId);

		return collection;
	} catch (_) {
		return null;
	}
}

export async function createMessageCollection(
	locals: App.Locals,
	articleId: string,
	role: MessageRole,
	content: ArticleCompletion | string
): Promise<MessageCollection | null> {
	try {
		return await locals.pbAdmin
			.collection('messages')
			.create({ article: articleId, role, content });
	} catch (_) {
		return null;
	}
}
