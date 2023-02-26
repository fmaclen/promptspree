import { expect, test } from '@playwright/test';

import { MockPrompt } from '../src/lib/tests.mockPrompt.js';
import { TEST_USERS, createAndLoginUser, resetDatabase } from './helpers/fixtures.js';

test.describe('Play', () => {
	test.beforeEach(async ({ page }) => {
		await resetDatabase();
		await page.goto('/');
	});

	test("Can't play, user is not logged in", async ({ page }) => {
		await page.locator('a.primary-action', { hasText: 'Play' }).click();
		await expect(page.getByText('Already have an account? Login')).toBeVisible();
		await expect(page.getByText('Enter a prompt below to generate an article')).not.toBeVisible();
	});

	test('Can generate draft articles', async ({ page }) => {
		await createAndLoginUser(TEST_USERS.alice, page);

		await page.locator('a.primary-action', { hasText: 'Play' }).click();
		await expect(page.getByText('Already have an account? Login')).not.toBeVisible();
		await expect(page.getByText('Enter a prompt below to generate an article')).toBeVisible();

		const generateButton = page.locator('button[type=submit]', { hasText: 'Generate' });
		const retryButton = page.locator('button[type=submit]', { hasText: 'Try another one' });
		const publishButton = page.locator('button[type=submit]', { hasText: 'Publish' });
		await expect(retryButton).not.toBeVisible();
		await expect(publishButton).not.toBeVisible();
		await expect(generateButton).toBeDisabled();

		let prompt = MockPrompt.GENERATE_ARTICLE;
		await page.locator('textarea').fill(prompt);
		await expect(generateButton).not.toBeDisabled();
		await expect(page.getByText('Business')).not.toBeVisible();
		await expect(page.getByText('The Great Plague: 50% Off at J.C. Penny!')).not.toBeVisible();
		expect(await page.locator('p.article__p').count()).toBe(0);
		expect(await page.locator('ul.article__list-placeholder').count()).toBe(4);

		await generateButton.click();
		await expect(page.getByText('Business')).toBeVisible();
		await expect(page.getByText('The Great Plague: 50% Off at J.C. Penny!')).toBeVisible();
		await expect(publishButton).toBeVisible();
		await expect(retryButton).toBeVisible();
		await expect(generateButton).not.toBeVisible();
		expect(await page.locator('p.article__p').count()).toBe(3);
		expect(await page.locator('ul.article__list-placeholder').count()).toBe(0);

		prompt = MockPrompt.RETRY_ARTICLE;
		await page.locator('textarea').fill(prompt);
		await expect(page.getByText('Health')).not.toBeVisible();
		await expect(
			page.getByText('5 Tips for Choosing the Right Radioactive Mutant Ficus')
		).not.toBeVisible();

		await retryButton.click();
		await expect(page.getByText('Health')).toBeVisible();
		await expect(
			page.getByText('5 Tips for Choosing the Right Radioactive Mutant Ficus')
		).toBeVisible();
		await expect(publishButton).toBeVisible();
		await expect(generateButton).not.toBeVisible();
		expect(await page.locator('p.article__p').count()).toBe(6);

		prompt = MockPrompt.WRONG_FORMAT;
		await page.locator('textarea').fill(prompt);
		await expect(
			page.getByText('AI tried to generate the article but was in the wrong format')
		).not.toBeVisible();
		
		// TODO: check the DB to make sure the article is in 'FAILED' state

		await retryButton.click();
		await expect(
			page.getByText('AI tried to generate the article but was in the wrong format')
		).toBeVisible();

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
