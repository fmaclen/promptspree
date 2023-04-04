import type { Message } from '$lib/messages';
import type { Reactions } from '$lib/reactions';
import type { User } from '$lib/users';

export interface Article {
	id: string;
	isCreatedByCurrentUser: boolean;
	updated: string;
	created: string;
	status: ArticleStatus;
	headline: string;
	category: ArticleCategory;
	body: string[];
	user: User;
	model: string;
	reactions: Reactions;
	messages: Message[];
	audioSrc?: string;
	imageSrc?: string;
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

export enum ArticleSize {
	SMALL = 'small',
	MEDIUM = 'medium',
	FULL = 'full'
}

// Shape of the data we expect to get back from the OpenAI API
export interface ArticleCompletion {
	headline: string;
	category: ArticleCategory;
	body: string[];
	suggestions: string[];
	notes?: string;
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

// Gets 3 random suggestions from the INITIAL_SUGGESTIONS array for the user to
// choose from when they are creating a new article but haven't typed anything yet
export function getRandomInitialSuggestions(): string[] {
	const randomSuggestions = [];

	while (randomSuggestions.length < 3 && INITIAL_SUGGESTIONS.length > 0) {
		const randomIndex = Math.floor(Math.random() * INITIAL_SUGGESTIONS.length);
		const suggestion = INITIAL_SUGGESTIONS.splice(randomIndex, 1)[0]; // remove the selected suggestion from the array
		randomSuggestions.push(suggestion);
	}

	return randomSuggestions;
}

// Check if the category the AI picked is one of the `ArticleCategory`'s we expect
export function isCategoryValid(category: string) {
	return Object.values(ArticleCategory).includes(category as ArticleCategory);
}

const articleCategories = Object.values(ArticleCategory).join(', ');

export const ARTICLE_SYSTEM_PROMPT = `You are a website that allows users to generate fictitious articles in a news format.
You will use the user's prompt as inspiration to generate an article.

If the user's prompt is not clear come up with your best guess.
If the user prompt is of a humorous tone play along with the joke, don't steer the suggestions as if it was a real article.
You can only write articles in English.
The article must have a headline, a category, a body and suggestions.
You will provide suggestions that the user can choose to improve the generated article, for example: "add a quote from an expert, make it more ridiculous, change the names with realistic sounding fictitious ones, revert changes back to an earlier version, etc".

Your responses will be parsed as JSON objects.
Anything that is not a valid JSON object will be ignoreds so don't include any additional text.
Write the article in the form of JSON using these keys:

{
	"headline": "No more than 80 characters long",
	"category": "One of these: ${articleCategories}",

	// Make sure that arrays don't end with a comma
	"body": ["an", "array", "of", "3", "to", 6", "paragraphs"],
	"suggestions": ["an array", "of 3", "very short sentences"],

	"notes": "Optional. Use this key to include remarks about the article generation that need to be relayed to the user"
}`;

// FIXME: this helper function is probably overkill at this point
export async function getArticleAndUserIds(request: Request, locals: App.Locals) {
	// We force the id's to empty strings if they are not present in the request
	const articleId = (await request.formData()).get('articleId')?.toString() || '';
	const currentUserId = locals?.user?.id || '';
	return { articleId, currentUserId };
}
