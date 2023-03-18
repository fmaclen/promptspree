import type { ArticleCompletion } from '$lib/articles';

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

// Filters out messages that shouldn't be displayed in the UI, for example: the SYSTEM's prompt
export function getMessages(messagesCollection?: MessageCollection[]): Message[] {
	if (!messagesCollection) return [];

	const filteredMessages: Message[] = [];

  // Loop through each message in the collection
  for (const message of messagesCollection) {
    // Skip messages with the role SYSTEM
    if (message.role !== MessageRole.SYSTEM) {
      // Add the message to the filtered messages array
      filteredMessages.push({
        id: message.id,
        updated: message.updated,
        created: message.created,
        role: message.role,
        content: message.content,
      });
    }
  }

	return filteredMessages.length ? filteredMessages : [];
}
