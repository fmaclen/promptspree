import type { ArticleCompletion } from '$lib/articles';
import type { CompletionUserPrompt } from '$lib/openai';
import type { MessageCollection } from '$lib/pocketbase.schema';
import type { ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum } from 'openai';

import { miniStringify } from './utils.js'; // HACK: need to specify the extension so it can be imported in tests

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

	const filteredMessages: Message[] = [];

	// Loop through each message in the collection
	for (const message of messagesCollection) {
		// Add the message to the filtered messages array
		filteredMessages.push({
			id: message.id,
			updated: message.updated,
			created: message.created,
			role: message.role,
			content: message.content
		});
	}

	return filteredMessages.length ? filteredMessages : [];
}

// Generates
export function generateCompletionUserPrompt(
	systemPrompt: string,
	currentUserId: string,
	messages: Message[]
): CompletionUserPrompt {
	const chatCompletionMessages: ChatCompletionRequestMessage[] = [];

	chatCompletionMessages.push({
		role: MessageRole.SYSTEM.toLowerCase() as ChatCompletionRequestMessageRoleEnum,
		content: miniStringify(systemPrompt)
	});

	for (const message of messages) {
		if (!message?.role || !message?.content) continue;

		chatCompletionMessages.push({
			role: message.role.toLowerCase() as ChatCompletionRequestMessageRoleEnum,
			content:
				typeof message.content === 'string' ? message.content : JSON.stringify(message.content)
		});
	}

	//
	//
	// TODO: check if the number of tokens is smaller than 4096
	//
	//

	return { userId: currentUserId, messages: chatCompletionMessages };
}
