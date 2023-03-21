import type { ArticleCompletion } from '$lib/articles';
import type { CompletionUserPrompt } from '$lib/openai';
import type { MessageCollection } from '$lib/pocketbase.schema';
import type { ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum } from 'openai';

// HACK: need to specify the extension so it can be imported in tests
import { miniStringify } from './utils.js';

export enum MessageRole {
	SYSTEM = 'SYSTEM',
	USER = 'USER',
	ASSISTANT = 'ASSISTANT'
}

export interface Message {
	id?: string;
	updated?: Date;
	created?: Date;
	role?: MessageRole;
	content?: ArticleCompletion | string;
}

// Filters out messages that shouldn't be displayed in the UI
export function getMessages(messagesCollection?: MessageCollection[]): Message[] {
	if (!messagesCollection) return [];

	const messages: Message[] = [];

	// Loop through each message in the collection
	for (const message of messagesCollection) {
		// Add the message to the filtered messages array
		messages.push({
			id: message.id,
			updated: message.updated,
			created: message.created,
			role: message.role,
			content: message.content
		});
	}

	return messages.length ? messages : [];
}
