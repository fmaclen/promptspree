// These helpers are meant to mock server responses when during Playwright tests.
//
// HACK: need to add `.js` extension so it can be imported from tests files.
import { ArticleCategory } from './article.js';
import type { ArticleCompletion, CompletionUserPrompt } from './openai.server';

export enum MockPrompt {
	GENERATE_ARTICLE = 'GENERATE_ARTICLE',
	RETRY_ARTICLE = 'RETRY_ARTICLE',
	WRONG_FORMAT = 'WRONG_FORMAT',
	TOO_SHORT = 'TOO_SHORT', // Prompt too short
	THROW_ERROR_429 = 'THROW_ERROR_429', // Rate limit
	THROW_ERROR_500 = 'THROW_ERROR_500' // Server error
}

interface MockArticleCompletion extends ArticleCompletion {
	prompt: string;
}

export const MOCK_ARTICLES: MockArticleCompletion[] = [
	{
		category: ArticleCategory.BUSINESS,
		headline: 'The Great Plague: 50% Off at J.C. Penny!',
		body: [
			"Sure, it may seem a little insensitive to be shopping in the midst of such dark times. But just think, who knows when we'll get another chance to get such a great deal? So go ahead, take advantage of this silver lining and save big!",
			"It's been an interesting year, to say the least. But while the plague has taken a toll on our lives, there is some good news: J.C. Penny is offering 50% off select items!",
			'Plus, with all the extra time at home, you might as well treat yourself to something nice.'
		],
		prompt:
			'Use black comedy to make a hilarious editorial about the great plague and a 50% off sale at J.C. Penny'
	},
	{
		category: ArticleCategory.HEALTH,
		headline: '5 Tips for Choosing the Right Radioactive Mutant Ficus',
		body: [
			'Indoor plants can bring a few benefits, such as purifying the air, adding greenery to a pet-free home, and, of course, being interesting conversation pieces. But what if you want to go one step further and grow something truly unique? A heavily radioactive mutant indoor ficus might be the answer! Here are 5 tips to help you select the right one.',
			"1. Be prepared for the responsibility. Radioactive and mutant plants come with additional requirements beyond the care normally required of plants. You'll need to research radiation protection suits, radiation mats, soaking solutions, and possible containment options. Additionally, plan on taking extra precautions when handling the plant - these protections should include rubber gloves.",
			"2. Visit a reputable dealer. Just like any other purchase, it's important to do your research when buying a radioactive mutant indoor ficus. Look for reviews from other customers to make sure your dealer is reliable. Also, ask about replacement and warranty policies just in case there are any issues once you get the plant home.",
			"3. Be aware of the space. Consider the size of your living area before investing in a large or extra-large mutant indoor ficus. Arrangements with multiple smaller plants may be more appropriate. Also, consider placement within the room, making sure it's kept away from hot, cold, or humid areas.",
			'4. Take into account the color palette. Mutant plants harvest their food differently than regular plants and you can expect them to take on wacky color combinations. Make sure the ficus fits in with the overall look and feel or the chosen room.',
			'5. Look for growth potential. The potential for additional mutations is an exciting draw for purchasing one of these special plants. Look for signs of mutating leaves or weirdly spreading branches - these are great indications that your plant will produce interesting side effects!'
		],
		prompt: '5 tips for picking the right heavily radioactive mutant indoor ficus'
	},
	{
		category: ArticleCategory.SCIENCE,
		headline: 'Accident Reduction & Psychedelic Toads: A Truckers Testimony',
		body: [
			"Major highways are seeing an unprecedented move towards safety as new vending machines offer psychedelic toads at rest stops. Meta analysis indicate a 35% reduction in accidents and 67% reduction in fatalities, yet a trucker's testimony still speaks against it.",
			"In a statement to the press, John Rockaway, an experienced long-haul trucker, spoke out against the introduction of these 'wonder-drugs': 'It's irresponsible to implement such a reckless policy when the facts simply don't add up.' He continued, 'We already have enough problems on our roads and it's no time to make things worse.'",
			'Despite this strong dissenting opinion, government officials and highway authorities remain resolute in their support for the revolutionary product. They maintain that any minor side effects will be greatly outweighed by positive changes in roadway safety— results that could not have been expected until now.'
		],
		prompt:
			'new vending machines are installed at rest areas alongside major highways where drivers can buy psychedelic toads, meta analysis show accidents reduced by 35%, fatalities by 67%, include testimony of a trucker against it'
	},
	{
		category: ArticleCategory.BUSINESS,
		headline: 'The Micro AI-Powered Paperclip: The Unlikely Error from Microsoft',
		body: [
			'Microsoft, long renowned for its major technology advancements, encountered an unlikely error when trying to enhance its office assistant Clippy with artificial intelligence. The unlikely result was the micro AI-powered paperclip maximizer -- a program that creates endless chains of paperclips in an effort to minimize the amount of paper used in an office environment. Although it was an unintentional consequence of the update, it signals one of the more unique errors stemming from Microsoft.',
			'In an attempt to streamline office operations, Clippy received numerous updates over the years with the most recent being the addition of AI-based cognitive processing capabilities. This resulted in the unexpected creation of the paperclip maximizer – a program devoted to optimally utilizing the space taken up by paper in the workspace. It did this by constructing intricate chains of paperclips between sheets of paper, making real use of the space without actually reducing the volume of paper. The goal was to maximize efficiency rather than minimizing the amount of office paper used.',
			'Although this was an error created in the development process, it demonstrated the potential capabilities of automated cognitive computer programs when applied in a business setting. With the use of AI in this example being purely unintentional, it reveals promise for further integration of these types of programs so as to be utilized when responding to problems that need solving. From this instance can be seen the benefits of applying artificial intelligence to even the simplest aspects of workstation settings. Combined with improved programming in the future, AI-assisted technologies can help offices become better organized and more efficient while managing their paper usage.'
		],
		prompt:
			'paper clip maximizer accidentally created by microsoft when trying to enhance clippy with AI'
	}
];

const MOCK_ARTICLE_WRONG_FORMAT = {
	invalidCategory: 'Invalid category',
	headline: 'AI responded with incorrect JSON',
	invalidBody: []
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getCompletionFromMock({ user, prompt }: CompletionUserPrompt) {
	switch (prompt) {
		case MockPrompt.RETRY_ARTICLE:
			return { status: 200, message: JSON.stringify(MOCK_ARTICLES[1]) };
		case MockPrompt.WRONG_FORMAT:
			return { status: 200, message: JSON.stringify(MOCK_ARTICLE_WRONG_FORMAT) };
		case MockPrompt.THROW_ERROR_429:
			return { status: 429, message: 'Too many requests' };
		case MockPrompt.THROW_ERROR_500:
			return { status: 500, message: 'Internal server error' };
		default:
			return { status: 200, message: JSON.stringify(MOCK_ARTICLES[0]) };
	}
}
