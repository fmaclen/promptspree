import type { ArticleCompletion } from '$lib/articles';
import type { ChatCompletionRequestMessage } from 'openai';

export interface CompletionUserPrompt {
	userId: string;
	messages: ChatCompletionRequestMessage[];
}

export interface CompletionResponse {
	status: number; // Status code
	message: string; // Status message
	completion: string | null;
	parsedCompletion?: ArticleCompletion;
}

export const CURRENT_MODEL = 'gpt-3.5-turbo';
