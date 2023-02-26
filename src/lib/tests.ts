// These helpers are meant to mock server responses when during Playwright tests.
import { ArticleCategory } from './article';
import type { CompletionUserPrompt } from './openai.server';
import { MockPrompt } from './tests.mockPrompt';

const PLACEHOLDER_ARTICLES = [
	{
		category: ArticleCategory.BUSINESS,
		headline: 'The Great Plague: 50% Off at J.C. Penny!',
		body: [
			"Sure, it may seem a little insensitive to be shopping in the midst of such dark times. But just think, who knows when we'll get another chance to get such a great deal? So go ahead, take advantage of this silver lining and save big!",
			"It's been an interesting year, to say the least. But while the plague has taken a toll on our lives, there is some good news: J.C. Penny is offering 50% off select items!",
			'Plus, with all the extra time at home, you might as well treat yourself to something nice.'
		]
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
		]
	},
	{
		invalidCategory: 'Invalid category',
		headline: 'AI responded with incorrect JSON',
		body: []
	}
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getCompletionFromMock({ user, prompt }: CompletionUserPrompt) {
	switch (prompt) {
		case MockPrompt.RETRY_ARTICLE:
			return { status: 200, message: JSON.stringify(PLACEHOLDER_ARTICLES[1]) };
		case MockPrompt.WRONG_FORMAT:
			return { status: 200, message: JSON.stringify(PLACEHOLDER_ARTICLES[2]) };
		case MockPrompt.THROW_ERROR_429:
			return { status: 429, message: 'Too many requests' };
		case MockPrompt.THROW_ERROR_500:
			return { status: 500, message: 'Internal server error' };
		default:
			return { status: 200, message: JSON.stringify(PLACEHOLDER_ARTICLES[0]) };
	}
}
