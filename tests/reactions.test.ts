import { expect, test } from '@playwright/test';

import { ArticleStatus } from '../src/lib/article.js';
import { MOCK_ARTICLES } from '../src/lib/tests.js';
import { MOCK_USERS } from './lib/fixtures.js';
import {
	createArticle,
	createUser,
	getUser,
	goToHomepageViaLogo,
	loginUser,
	logoutCurrentUser,
	resetDatabase,
	verifyUser
} from './lib/helpers.js';

async function seedTest() {
	const users = [MOCK_USERS.alice, MOCK_USERS.bob];

	for (const user of users) {
		await createUser(user);
		await verifyUser(user.email);
	}

	let user = await getUser(MOCK_USERS.alice.email);
	if (user) {
		await createArticle(MOCK_ARTICLES[0], ArticleStatus.DRAFT, user.id);
		await createArticle(MOCK_ARTICLES[1], ArticleStatus.PUBLISHED, user.id);
	}
	user = await getUser(MOCK_USERS.bob.email);
	if (user) {
		await createArticle(MOCK_ARTICLES[2], ArticleStatus.DRAFT, user.id);
		await createArticle(MOCK_ARTICLES[3], ArticleStatus.PUBLISHED, user.id);
	}
}

test.describe('Reactions', () => {
	test.beforeAll(async () => {
		await resetDatabase();
		await seedTest();
	});

	test('Can react to articles', async ({ page }) => {
		await loginUser(MOCK_USERS.alice, page);

		const reactionSummary = 'a.article-reactions-summary';
		expect(await page.locator(reactionSummary, { hasText: '0' }).count()).toBe(2);

		await page.getByText(MOCK_ARTICLES[1].headline).click();
		await expect(page.getByText(MOCK_ARTICLES[1].body[2])).toBeVisible();
		expect(await page.locator(reactionSummary, { hasText: '0' }).count()).toBe(1);

		await page.getByText('🤯').click();
		await expect(page.locator(reactionSummary, { hasText: '🤯 1' })).toBeVisible();

		await goToHomepageViaLogo(page);
		await expect(page.getByText(MOCK_ARTICLES[1].body[2])).not.toBeVisible();
		await expect(page.locator(reactionSummary, { hasText: '🤯 1' })).toBeVisible();

		// Logout as Alice
		await logoutCurrentUser(page);

		// Login as Bob
		await loginUser(MOCK_USERS.bob, page);
		await page.getByText(MOCK_ARTICLES[1].headline).click();
		await expect(page.getByText(MOCK_ARTICLES[1].body[2])).toBeVisible();
		await expect(page.locator(reactionSummary, { hasText: '🤯 1' })).toBeVisible();

		await page.getByText('🤔').click();
		await expect(page.locator(reactionSummary, { hasText: '🤯 2' })).toBeVisible();

		await goToHomepageViaLogo(page);
		await expect(page.getByText(MOCK_ARTICLES[1].body[2])).not.toBeVisible();
		await expect(page.locator(reactionSummary, { hasText: '🤯 2' })).toBeVisible();
	});

	test("Prompt score is displayed in user's profile", async ({ page }) => {
		await page.goto('/');
		await page.locator('span.metadata__author', { hasText: MOCK_USERS.alice.nickname }).click();
		await expect(page.locator('li.profile-summary__li', { hasText: 'Prompt score 2' })).toBeVisible(); // prettier-ignore

		await goToHomepageViaLogo(page);
		await page.locator('span.metadata__author', { hasText: MOCK_USERS.bob.nickname }).click();
		await expect(page.locator('li.profile-summary__li', { hasText: 'Prompt score 0' })).toBeVisible(); // prettier-ignore
	});
});
