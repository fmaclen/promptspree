import { expect, test } from '@playwright/test';

import { type Article, ArticleStatus } from '../src/lib/article.js';
import { MOCK_ARTICLES, MockPrompt } from '../src/lib/tests.js';
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
		await expect(page.getByText('Enter a prompt below to generate an article')).not.toBeVisible();
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
			await expect(page.getByText('Enter a prompt below to generate an article')).toBeVisible();

			const generateButton = page.locator('button[type=submit]', { hasText: 'Generate' });
			const retryButton = page.locator('button[type=submit]', { hasText: 'Try another one' });
			await expect(retryButton).not.toBeVisible();
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
			await expect(retryButton).toBeVisible();
			await expect(generateButton).not.toBeVisible();
			expect(await page.locator('p.article__p').count()).toBe(4);
			expect(await page.locator('ul.article__list-placeholder').count()).toBe(0);

			let article: Article = await getLastArticle(`headline = "${articleHeadline}"`);
			expect(article.messages[1].content).toBe(MockPrompt.GENERATE_ARTICLE);
			expect(article.status).toBe(ArticleStatus.DRAFT);

			prompt = MockPrompt.RETRY_ARTICLE;
			articleHeadline = MOCK_ARTICLES[1].headline;
			await page.locator('textarea').fill(prompt);
			await expect(page.getByText(MOCK_ARTICLES[1].category)).not.toBeVisible();
			await expect(page.getByText(articleHeadline)).not.toBeVisible();

			await retryButton.click();
			await expect(page.getByText(MOCK_ARTICLES[1].category)).toBeVisible();
			await expect(page.getByText(articleHeadline)).toBeVisible();
			await expect(generateButton).not.toBeVisible();
			expect(await page.locator('p.article__p').count()).toBe(3);

			article = await getLastArticle(`headline = "${articleHeadline}"`);
			expect(article.messages[1].content).toBe(MockPrompt.RETRY_ARTICLE);
			expect(article.status).toBe(ArticleStatus.DRAFT);
		});

		test('Can publish draft articles', async ({ page }) => {
			await expect(page.getByText('Enter a prompt below to generate an article')).toBeVisible();

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
			await expect(page.getByText('Enter a prompt below to generate an article')).not.toBeVisible();

			const article: Article = await getLastArticle(`headline = "${articleHeadline}"`);
			expect(article.messages[1].content).toBe(MockPrompt.GENERATE_ARTICLE);
			expect(article.status).toBe(ArticleStatus.PUBLISHED);
		});

		test('Errors trying to create articles', async ({ page }) => {
			const generateButton = page.locator('button[type=submit]', { hasText: 'Generate' });

			let prompt = MockPrompt.WRONG_FORMAT;
			await page.locator('textarea').fill(prompt);
			await expect(
				page.getByText('AI tried to generate the article but was in the wrong format')
			).not.toBeVisible();

			await generateButton.click();
			await expect(
				page.getByText('AI tried to generate the article but was in the wrong format')
			).toBeVisible();

			const article: Article = await getLastArticle(`messages ~ "${MockPrompt.WRONG_FORMAT}"`);
			expect(article.messages[1].content).toBe(MockPrompt.WRONG_FORMAT);
			expect(article.status).toBe(ArticleStatus.FAILED);

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
			await expect(page.getByText('Internal server error')).not.toBeVisible();

			await generateButton.click();
			await expect(page.getByText('Internal server error')).toBeVisible();
		});
	});
});
