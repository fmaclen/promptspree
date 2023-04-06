import { expect, test } from '@playwright/test';

import { ArticleStatus, INITIAL_SUGGESTIONS } from '../src/lib/articles.js';
import { MOCK_ARTICLE_COMPLETIONS, MockPrompt } from '../src/lib/tests.js';
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
		await expect(
			page.getByText('Type your own prompt or choose one of the suggestions to generate an article')
		).not.toBeVisible();
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

			const generateButton = page.locator('button.chat__button-generate');
			await expect(generateButton).toBeDisabled();

			let prompt = MockPrompt.GENERATE_ARTICLE;
			await page.locator('textarea').fill(prompt);
			await expect(generateButton).not.toBeDisabled();
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[0].category)).not.toBeVisible();
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[0].headline)).not.toBeVisible();
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[0].body[0])).not.toBeVisible();
			expect(await page.locator('p.chat__article-p').count()).toBe(0);
			expect(await page.locator('li.chat__message-container').count()).toBe(0);

			await generateButton.click();
			await expect(page.locator('div.chat__message--user')).toBeVisible();
			await expect(page.locator('div.chat__message--assistant')).toBeVisible();
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[0].category)).toBeVisible();
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[0].headline)).toBeVisible();
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[0].body[0])).toBeVisible();
			expect(await page.locator('p.chat__article-p').count()).toBe(4);
			expect(await page.locator('li.chat__message-container').count()).toBe(2);

			let article = await getLastArticle(`headline = "${MOCK_ARTICLE_COMPLETIONS[0].headline}"`);
			let articleMessages = article.expand?.['messages(article)'];
			expect(articleMessages?.[0].content).toBe(MockPrompt.GENERATE_ARTICLE);
			expect(articleMessages?.[1].content?.notes).toBe(MOCK_ARTICLE_COMPLETIONS[0].notes);
			expect(article?.status).toBe(ArticleStatus.DRAFT);

			prompt = MockPrompt.RETRY_ARTICLE;
			await page.locator('textarea').fill(prompt);
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[1].category)).not.toBeVisible();
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[1].headline)).not.toBeVisible();

			await generateButton.click();
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[1].category)).toBeVisible();
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[1].headline)).toBeVisible();
			await expect(page.locator('a.profile-summary__a--active', { hasText: 'Drafts' })).not.toBeVisible(); // prettier-ignore
			expect(await page.locator('div.chat__message').count()).toBe(4);
			expect(await page.locator('div.chat__message--user').count()).toBe(2);
			expect(await page.locator('div.chat__message--assistant').count()).toBe(2);

			await page.locator('div.toaster a', { hasText: 'drafts' }).first().click();
			await expect(page.locator('a.profile-summary__a--active', { hasText: 'Drafts' })).toBeVisible(); // prettier-ignore
			await expect(generateButton).not.toBeVisible();

			article = await getLastArticle(`headline = "${MOCK_ARTICLE_COMPLETIONS[1].headline}"`);
			articleMessages = article.expand?.['messages(article)'];
			expect(articleMessages?.[2].content).toBe(MockPrompt.RETRY_ARTICLE);
			expect(articleMessages?.[3].content?.notes).toBe(MOCK_ARTICLE_COMPLETIONS[1].notes);
			expect(article?.status).toBe(ArticleStatus.DRAFT);
		});

		test('Can publish lastest version of a draft article', async ({ page }) => {
			// First prompt
			const generateButton = page.locator('button.chat__button-generate');
			const publishButton = page.locator('button.form-button', { hasText: 'Publish' });
			await page.locator('textarea').fill(MockPrompt.GENERATE_ARTICLE);
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[0].headline)).not.toBeVisible();
			await expect(publishButton).not.toBeVisible();

			await generateButton.click();
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[0].headline)).toBeVisible();
			await expect(publishButton).toBeVisible();

			// Second prompt
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[1].headline)).not.toBeVisible();
			await page.locator('textarea').fill(MockPrompt.RETRY_ARTICLE);

			await generateButton.click();
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[1].headline)).toBeVisible();

			// Publish article generated by second prompt
			await publishButton.filter({ hasText: 'Latest version' }).click();
			await expect(page.locator('h1.section__h1', { hasText: MOCK_USERS.alice.nickname })).toBeVisible(); // prettier-ignore
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[1].headline)).toBeVisible();
			await expect(generateButton).not.toBeVisible();
			await expect(publishButton).not.toBeVisible();

			let article = await getLastArticle(`headline = "${MOCK_ARTICLE_COMPLETIONS[1].headline}"`);
			expect(article.expand?.['messages(article)']?.[2].content).toBe(MockPrompt.RETRY_ARTICLE);
			expect(article?.status).toBe(ArticleStatus.PUBLISHED);

			article = await getLastArticle(`headline = "${MOCK_ARTICLE_COMPLETIONS[0].headline}"`);
			expect(article).toBe(null);
		});

		test('Can publish an earlier version of a draft article', async ({ page }) => {
			// First prompt
			const generateButton = page.locator('button.chat__button-generate');
			const publishButton = page.locator('button.form-button', { hasText: 'Publish' });
			await page.locator('textarea').fill(MockPrompt.GENERATE_ARTICLE);
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[0].headline)).not.toBeVisible();
			await expect(publishButton).not.toBeVisible();

			await generateButton.click();
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[0].headline)).toBeVisible();
			await expect(publishButton).toBeVisible();

			// Second prompt
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[1].headline)).not.toBeVisible();
			await page.locator('textarea').fill(MockPrompt.RETRY_ARTICLE);

			await generateButton.click();
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[1].headline)).toBeVisible();

			// Publish article generated by second prompt
			await publishButton.filter({ hasText: MOCK_ARTICLE_COMPLETIONS[0].headline }).click();
			await expect(page.locator('h1.section__h1', { hasText: MOCK_USERS.alice.nickname })).toBeVisible(); // prettier-ignore
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[0].headline)).toBeVisible();
			await expect(generateButton).not.toBeVisible();
			await expect(publishButton).not.toBeVisible();

			let article = await getLastArticle(`headline = "${MOCK_ARTICLE_COMPLETIONS[0].headline}"`);
			expect(article.expand?.['messages(article)']?.[2].content).toBe(MockPrompt.RETRY_ARTICLE);
			expect(article?.status).toBe(ArticleStatus.PUBLISHED);

			article = await getLastArticle(`headline = "${MOCK_ARTICLE_COMPLETIONS[1].headline}"`);
			expect(article).toBe(null);
		});

		test('Errors trying to create articles', async ({ page }) => {
			const generateButton = page.locator('button.chat__button-generate');

			let prompt = MockPrompt.WRONG_FORMAT;
			await page.locator('textarea').fill(prompt);
			await expect(
				page.getByText(
					"Couldn't generate an article based on your last prompt, try a different one"
				)
			).not.toBeVisible();

			await generateButton.click();
			await expect(
				page.getByText(
					"Couldn't generate an article based on your last prompt, try a different one"
				)
			).toBeVisible();

			const article = await getLastArticle(`body = null`);
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
			const generateButton = page.locator('button.chat__button-generate');
			const suggestion = page.locator('button.chat__suggestion');

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
			await expect(promptTextarea).toBeFocused();

			await firstSuggestion.click();
			await expect(firstSuggestion).not.toBeVisible();
			await expect(secondSuggestion).not.toBeVisible();
			await expect(thirdSuggestion).not.toBeVisible();
			await expect(generateButton).not.toBeDisabled();
			await expect(promptTextarea).toHaveValue(firstSuggestionText.trim());
			await expect(promptTextarea).toBeFocused();
		});

		test('Can discard current article and start over', async ({ page }) => {
			const startFromScratchButton = page.getByLabel('Start from scratch');
			const generateButton = page.locator('button.chat__button-generate');
			const publishButton = page.locator('button.form-button', { hasText: 'Publish' });
			await expect(startFromScratchButton).not.toBeVisible();
			await expect(publishButton).not.toBeVisible();

			let prompt = MockPrompt.GENERATE_ARTICLE;
			await page.locator('textarea').fill(prompt);
			await generateButton.click();
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[0].headline)).toBeVisible();
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[1].headline)).not.toBeVisible();
			await expect(startFromScratchButton).toBeVisible();
			await expect(publishButton).toBeVisible();

			prompt = MockPrompt.RETRY_ARTICLE;
			await page.locator('textarea').fill(prompt);
			await generateButton.click();
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[0].headline)).toBeVisible();
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[1].headline)).toBeVisible();

			await startFromScratchButton.click();
			await expect(startFromScratchButton).not.toBeVisible();
			await expect(publishButton).not.toBeVisible();
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[0].headline)).not.toBeVisible();
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[1].headline)).not.toBeVisible();
		});
	});
});
