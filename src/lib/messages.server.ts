import type { ArticleCompletion } from '$lib/articles';
import type { MessageRole } from '$lib/messages';
import type { MessageCollection } from '$lib/pocketbase.schema';

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
