import { expect, test } from '@playwright/test';

import { type Article, ArticleStatus, INITIAL_SUGGESTIONS } from '../src/lib/article.js';
import { MOCK_ARTICLES, MockPrompt } from '../src/lib/tests.js';
import { UNKNOWN_ERROR_MESSAGE } from '../src/lib/utils.js';
import { MOCK_USERS } from './lib/fixtures.js';
import {
	createUser,
	getLastArticle,
	loginUser,
	logoutCurrentUser,
	resetDatabase,
	verifyUser
} from './lib/helpers.js';

test.describe('Play', () => {
	test.beforeAll(async () => {
		await resetDatabase();
		await createUser(MOCK_USERS.alice);
		await verifyUser(MOCK_USERS.alice.email);
	});

	test("Can't play, user is not logged in", async ({ page }) => {
		await page.goto('/');
		await page.locator('a.primary-action', { hasText: 'Play' }).click();
		await expect(page.getByText('Already have an account? Login')).toBeVisible();
		await expect(page.getByText('Type your own prompt or choose one of the suggestions to generate an article')).not.toBeVisible();
	});

	test.describe('Logged in', () => {
		test.beforeEach(async ({ page }) => {
			await loginUser(MOCK_USERS.alice, page);
			await page.locator('a.primary-action', { hasText: 'Play' }).click();
		});

		test.afterEach(async ({ page }) => {
			await logoutCurrentUser(page);
		});

		test('Can generate draft articles', async ({ page }) => {
			await expect(page.getByText('Already have an account? Login')).not.toBeVisible();
			await expect(page.getByText('Type your own prompt or choose one of the suggestions to generate an article')).toBeVisible();

			const generateButton = page.locator('button[type=submit]', { hasText: 'Generate' });
			const applyChangesButton = page.locator('button[type=submit]', { hasText: 'Apply change' });

			await expect(applyChangesButton).not.toBeVisible();
			await expect(generateButton).toBeDisabled();

			let prompt = MockPrompt.GENERATE_ARTICLE;
			let articleHeadline = MOCK_ARTICLES[0].headline;
			await page.locator('textarea').fill(prompt);
			await expect(generateButton).not.toBeDisabled();
			await expect(page.getByText(MOCK_ARTICLES[0].category)).not.toBeVisible();
			await expect(page.getByText(articleHeadline)).not.toBeVisible();
			expect(await page.locator('p.article__p').count()).toBe(0);
			expect(await page.locator('ul.article__list-placeholder').count()).toBe(4);

			await generateButton.click();
			await expect(page.getByText(MOCK_ARTICLES[0].category)).toBeVisible();
			await expect(page.getByText(articleHeadline)).toBeVisible();
			await expect(applyChangesButton).toBeVisible();
			await expect(generateButton).not.toBeVisible();
			expect(await page.locator('p.article__p').count()).toBe(4);
			expect(await page.locator('ul.article__list-placeholder').count()).toBe(0);

			let article = await getLastArticle(`headline = "${articleHeadline}"`);
			expect(article?.messages[1].content).toBe(MockPrompt.GENERATE_ARTICLE);
			expect(article?.status).toBe(ArticleStatus.DRAFT);

			prompt = MockPrompt.RETRY_ARTICLE;
			articleHeadline = MOCK_ARTICLES[1].headline;
			await page.locator('textarea').fill(prompt);
			await expect(page.getByText(MOCK_ARTICLES[1].category)).not.toBeVisible();
			await expect(page.getByText(articleHeadline)).not.toBeVisible();

			await applyChangesButton.click();
			await expect(page.getByText(MOCK_ARTICLES[1].category)).toBeVisible();
			await expect(page.getByText(articleHeadline)).toBeVisible();
			await expect(generateButton).not.toBeVisible();
			expect(await page.locator('p.article__p').count()).toBe(3);

			article = await getLastArticle(`headline = "${articleHeadline}"`);
			expect(article?.messages[3].content).toBe(MockPrompt.RETRY_ARTICLE);
			expect(article?.status).toBe(ArticleStatus.DRAFT);
		});

		test('Can publish draft articles', async ({ page }) => {
			await expect(page.getByText('Type your own prompt or choose one of the suggestions to generate an article')).toBeVisible();

			const generateButton = page.locator('button[type=submit]', { hasText: 'Generate' });
			const publishButton = page.locator('button[type=submit]', { hasText: 'Publish' });
			const prompt = MockPrompt.GENERATE_ARTICLE;
			const articleHeadline = MOCK_ARTICLES[0].headline;
			await page.locator('textarea').fill(prompt);
			await expect(publishButton).not.toBeVisible();
			await expect(page.getByText(articleHeadline)).not.toBeVisible();

			await generateButton.click();
			await expect(publishButton).toBeVisible();
			await expect(page.getByText(articleHeadline)).toBeVisible();

			await publishButton.click();
			await expect(page.getByText('Delete')).toBeVisible();
			await expect(page.getByText(prompt)).toBeVisible();
			await expect(generateButton).not.toBeVisible();
			await expect(publishButton).not.toBeVisible();
			await expect(page.getByText('Type your own prompt or choose one of the suggestions to generate an article')).not.toBeVisible();

			const article = await getLastArticle(`headline = "${articleHeadline}"`);
			expect(article?.messages[1].content).toBe(MockPrompt.GENERATE_ARTICLE);
			expect(article?.status).toBe(ArticleStatus.PUBLISHED);
		});

		test('Errors trying to create articles', async ({ page }) => {
			const generateButton = page.locator('button[type=submit]', { hasText: 'Generate' });

			let prompt = MockPrompt.WRONG_FORMAT;
			await page.locator('textarea').fill(prompt);
			await expect(
				page.getByText("Couldn't generate an article based on your last prompt, try modifiying it")
			).not.toBeVisible();

			await generateButton.click();
			await expect(
				page.getByText("Couldn't generate an article based on your last prompt, try modifiying it")
			).toBeVisible();

			const article = await getLastArticle(`messages ~ "${MockPrompt.WRONG_FORMAT}"`);
			expect(article?.messages[1].content).toBe(MockPrompt.WRONG_FORMAT);
			expect(article?.status).toBe(ArticleStatus.FAILED);

			prompt = MockPrompt.TOO_SHORT;
			await page.locator('textarea').fill(prompt);
			await expect(page.getByText('Prompt is too short')).not.toBeVisible();

			await generateButton.click();
			await expect(page.getByText('Prompt is too short')).toBeVisible();

			prompt = MockPrompt.THROW_ERROR_429;
			await page.locator('textarea').fill(prompt);
			await expect(page.getByText('Too many requests')).not.toBeVisible();

			await generateButton.click();
			await expect(page.getByText('Too many requests')).toBeVisible();

			prompt = MockPrompt.THROW_ERROR_500;
			await page.locator('textarea').fill(prompt);
			await expect(page.getByText(UNKNOWN_ERROR_MESSAGE)).not.toBeVisible();

			await generateButton.click();
			await expect(page.getByText(UNKNOWN_ERROR_MESSAGE)).toBeVisible();
		});

		test('Can write prompt from initial suggestions', async ({ page }) => {
			const promptTextarea = page.locator('textarea');
			const generateButton = page.locator('button[type=submit]', { hasText: 'Generate' });
			const suggestion = page.locator('div.play__suggestions button');

			const firstSuggestion = suggestion.nth(0);
			const firstSuggestionText = (await firstSuggestion.textContent()) as string;
			const secondSuggestion = suggestion.nth(1);
			const secondSuggestionText = (await secondSuggestion.textContent()) as string;
			const thirdSuggestion = suggestion.nth(2);
			const thirdSuggestionText = (await thirdSuggestion.textContent()) as string;
			
			expect(INITIAL_SUGGESTIONS.includes(firstSuggestionText));
			expect(INITIAL_SUGGESTIONS.includes(secondSuggestionText));
			expect(INITIAL_SUGGESTIONS.includes(thirdSuggestionText));
			await expect(firstSuggestion).not.toBeDisabled();
			await expect(secondSuggestion).not.toBeDisabled();
			await expect(thirdSuggestion).not.toBeDisabled();
			await expect(generateButton).toBeDisabled();
			await expect(promptTextarea).toHaveValue('');
			await expect(promptTextarea).not.toBeFocused();
			
			await firstSuggestion.click();
			await expect(firstSuggestion).toBeDisabled();
			await expect(secondSuggestion).toBeDisabled();
			await expect(thirdSuggestion).toBeDisabled();
			await expect(generateButton).not.toBeDisabled();
			await expect(promptTextarea).toHaveValue(firstSuggestionText);
			await expect(promptTextarea).toBeFocused();
		});
		
		test('Can discard current article and start over', async ({ page }) => {
			const startFromScratchButton = page.locator('button[type=button]', { hasText: 'Start from scratch' });
			const applyChangesButton = page.locator('button[type=submit]', { hasText: 'Apply change' });
			const generateButton = page.locator('button[type=submit]', { hasText: 'Generate' });
			const publishButton = page.locator('button[type=submit]', { hasText: 'Publish' });
			await expect(startFromScratchButton).not.toBeVisible();
			await expect(applyChangesButton).not.toBeVisible();
			await expect(publishButton).not.toBeVisible();
			await expect(generateButton).toBeVisible();
			
			const prompt = MockPrompt.GENERATE_ARTICLE;
			await page.locator('textarea').fill(prompt);
			await generateButton.click();
			await expect(applyChangesButton).toBeVisible();
			await expect(startFromScratchButton).toBeVisible();
			await expect(publishButton).toBeVisible();

			await startFromScratchButton.click();
			await expect(startFromScratchButton).not.toBeVisible();
			await expect(applyChangesButton).not.toBeVisible();
			await expect(publishButton).not.toBeVisible();
			await expect(generateButton).toBeVisible();
	});
	});
});
