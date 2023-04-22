import { expect, test } from '@playwright/test';

import { ArticleStatus } from '../src/lib/articles.js';
import { MOCK_ARTICLE_COMPLETIONS } from '../src/lib/tests.js';
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
	user && (await createArticle(MOCK_ARTICLE_COMPLETIONS[1], ArticleStatus.PUBLISHED, user.id));

	user = await getUser(MOCK_USERS.bob.email);
	user && (await createArticle(MOCK_ARTICLE_COMPLETIONS[3], ArticleStatus.PUBLISHED, user.id));
}

test.describe('Reactions', () => {
	test.beforeAll(async () => {
		await resetDatabase();
		await seedTest();
	});

	test('Can react to articles', async ({ page }) => {
		await loginUser(MOCK_USERS.alice, page);

		const reactionSummaryClass = 'a.reactions__summary';
		const reactionsContextMenuReaction = page.locator('button.reactions__context-menu-reaction');
		const reactionsContextMenuReactionReacted = page.locator(
			'button.reactions__context-menu-reaction--active'
		);
		const reactionsContextMenuToggle = page.locator('button.reactions__context-menu-toggle');
		const reactionsContextMenu = page.locator('div.reactions__context-menu');

		expect(await page.locator(reactionSummaryClass, { hasText: '0' }).count()).toBe(0);
		await expect(reactionsContextMenuToggle).not.toBeVisible();

		await page.getByText(MOCK_ARTICLE_COMPLETIONS[1].headline).click();
		await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[1].body[2])).toBeVisible();
		await expect(reactionsContextMenuToggle).toBeVisible();
		await expect(reactionsContextMenu).not.toBeVisible();

		await reactionsContextMenuToggle.click();
		await expect(reactionsContextMenu).toBeVisible();
		expect(await reactionsContextMenuReaction.count()).toBe(5);
		await expect(reactionsContextMenuReactionReacted).not.toBeVisible();

		await page.getByText('🤯').click();
		await expect(page.locator(reactionSummaryClass, { hasText: '🤯 1' })).toBeVisible();
		await expect(reactionsContextMenu).not.toBeVisible();

		await goToHomepageViaLogo(page);
		await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[1].body[2])).not.toBeVisible();
		await expect(page.locator(reactionSummaryClass, { hasText: '🤯 1' })).toBeVisible();

		// Logout as Alice
		await logoutCurrentUser(page);

		// Login as Bob
		await loginUser(MOCK_USERS.bob, page);
		await page.getByText(MOCK_ARTICLE_COMPLETIONS[1].headline).click();
		await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[1].body[2])).toBeVisible();
		await expect(page.locator(reactionSummaryClass, { hasText: '🤯 1' })).toBeVisible();
		await expect(page.locator(reactionSummaryClass)).not.toHaveClass(/reactions__summary--active/); // prettier-ignore

		await reactionsContextMenuToggle.click();
		await page.getByText('🤔').click();
		await expect(page.locator(reactionSummaryClass, { hasText: '🤯🤔 2' })).toBeVisible();
		await expect(page.locator(reactionSummaryClass)).toHaveClass(/reactions__summary--active/); // prettier-ignore

		await reactionsContextMenuToggle.click();
		await expect(reactionsContextMenuReactionReacted).toBeVisible();

		await goToHomepageViaLogo(page);
		await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[1].body[2])).not.toBeVisible();
		await expect(page.locator(reactionSummaryClass, { hasText: '🤯🤔 2' })).toBeVisible();
	});

	test("Prompt score is displayed in user's profile", async ({ page }) => {
		await page.goto('/');
		await page.locator('a.metadata__a', { hasText: MOCK_USERS.alice.nickname }).click();
		await expect(page.locator('li.profile-summary__li', { hasText: 'Prompt score 2' })).toBeVisible(); // prettier-ignore

		await goToHomepageViaLogo(page);
		await page.locator('a.metadata__a', { hasText: MOCK_USERS.bob.nickname }).click();
		await expect(page.locator('li.profile-summary__li', { hasText: 'Prompt score 0' })).toBeVisible(); // prettier-ignore
	});
});
