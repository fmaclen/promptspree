import { expect, test } from '@playwright/test';

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

	test('Can generate a draft article', async ({ page }) => {
		await createAndLoginUser(TEST_USERS.alice, page);

		await page.locator('a.primary-action', { hasText: 'Play' }).click();
		await expect(page.getByText('Already have an account? Login')).not.toBeVisible();
		await expect(page.getByText('Enter a prompt below to generate an article')).toBeVisible();
	});
});
