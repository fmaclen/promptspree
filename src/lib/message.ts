import type { ArticleCompletion } from '$lib/openai.server';

import type { MessageCollection } from './pocketbase.schema';

export enum MessageRole {
	SYSTEM = 'SYSTEM',
	USER = 'USER',
	ASSISTANT = 'ASSISTANT'
}

export interface Message {
	id: string;
	updated: Date;
	created: Date;
	role: MessageRole;
	content: ArticleCompletion | string;
}

export function getMessages(messagesCollection?: MessageCollection[]): Message[] {
	if (!messagesCollection) return [];

	const messages: Message[] = [];

	messagesCollection.forEach((message) => {
		// Skip messages with the role SYSTEM
		if (message.role !== MessageRole.SYSTEM) {
			messages.push({
				id: message.id,
				updated: message.updated,
				created: message.created,
				role: message.role,
				content: message.content
			});
		}
	});

	return messages.length ? messages : [];
}
