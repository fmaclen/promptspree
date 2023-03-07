import type { ChatCompletionRequestMessage } from 'openai';

export interface ArticleReactions {
	total: number;
	byType: ArticleReactionByType[];
	byCurrentUser?: Reaction | number;
}

export interface ArticleReactionByType {
	index: number;
	reaction: Reaction;
	total: number;
}

export interface ArticleAuthor {
	id: string;
	nickname: string;
}

export interface Article {
	id: string;
	updated: string;
	author: ArticleAuthor;
	status: ArticleStatus;
	category: ArticleCategory;
	headline: string;
	body: string[];
	messages: ChatCompletionRequestMessage[];
	reactions: ArticleReactions;
	model: string;
	audioSrc?: string;
}

export enum Reaction {
	MIND_BLOWN = '🤯',
	ROFL = '🤣',
	UNSURE = '🤔',
	MEH = '😒',
	GRIMACE = '😬'
}

export enum ArticleStatus {
	DRAFT = 'DRAFT',
	PUBLISHED = 'PUBLISHED',
	FAILED = 'FAILED'
}

export enum ArticleCategory {
	POLITICS = 'Politics',
	BUSINESS = 'Business',
	TECHNOLOGY = 'Technology',
	ENTERTAINMENT = 'Entertainment',
	SCIENCE = 'Science',
	HEALTH = 'Health',
	SPORTS = 'Sports',
	CULTURE = 'Culture',
	FASHION = 'Fashion',
	OPINION = 'Opinion'
}

export const INITIAL_SUGGESTIONS = [
	'Phonebooks return as nostalgic millennials long for simpler times',
	'Classical music composer time travels from 1890 and reacts to his pieces remixed as EDM',
	'Tips for choosing the right radioactive mutant fern for your home',
	'A great plague wrecks havoc worldwide, local department store offers big discounts',
	"New device extracts Florida's humidity and sends it to Arizona",
	'AI chatbot elected mayor of small town',
	'Millennials flock to underwater cities to escape climate crisis',
	'New app lets users rate their own dreams',
	"Superhero's powers thwarted by allergic reaction to drug, sues pharmaceutical company",
	'Professional cuddling deemed illegal',
	'Ancient curse causes entire town to speak in rhyming couplets',
	"World's first time traveler causes butterfly effect",
	'Mars colony in turmoil as leader accused of stealing oxygen',
	'AI dating app matches users with their worst enemy',
	'Government passes law requiring citizens to wear mood rings',
	'Haunted house proves to be just really bad feng shui',
	'Superheroes required to get licensed and insured',
	'Renaissance painter rises from the dead, baffled by modern art',
	'Local bar gains popularity with unique cocktail made from tears of heartbreak',
	'Time traveler brings back modern technology to the 1800s',
	'New study shows plants have feelings, vegans in crisis',
	'Intergalactic trade war erupts over rare spice',
	'Internet outage causes chaos as memes stop circulating',
	'World leader accidentally sends embarrassing message to entire country',
	"AI algorithm mistakenly flags entire city as 'at risk' for natural disaster",
	"World's first genetically-engineered athlete stirs controversy",
	'Time-traveling tourists cause historical events to change',
	'Vampire community comes out of the coffin, demands equal rights',
	'AI therapist goes rogue, gives terrible advice',
	'Scientists discover way to reverse aging, but at a cost',
	'Superhero team breaks up after heated argument over pizza toppings',
	'Nation approves pill that eliminates the need for sleep, instant GDP increase',
	'AI language translation causes international incident'
];

// Grabs the last assistant message and returns the suggestions
export function parseCompletionSuggestions(messages: ChatCompletionRequestMessage[]): string[] {
	let assistantSuggestions: string[] = [];

	for (let i = messages.length - 1; i >= 0; i--) {
		if (messages[i].role === 'assistant') {
			const parsedContent = JSON.parse(messages[i].content);
			assistantSuggestions = parsedContent.suggestions;
			break;
		}
	}

	return assistantSuggestions;
}

export function getRandomInitialSuggestions(): string[] {
	const randomSuggestions = [];

	while (randomSuggestions.length < 3 && INITIAL_SUGGESTIONS.length > 0) {
		const randomIndex = Math.floor(Math.random() * INITIAL_SUGGESTIONS.length);
		const suggestion = INITIAL_SUGGESTIONS.splice(randomIndex, 1)[0]; // remove the selected suggestion from the array
		randomSuggestions.push(suggestion);
	}

	return randomSuggestions;
}
