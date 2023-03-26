import { expect, test } from '@playwright/test';

import { ArticleStatus } from '../src/lib/articles.js';
import { MOCK_ARTICLE_COMPLETIONS } from '../src/lib/tests.js';
import { MOCK_USERS } from './lib/fixtures.js';
import {
	createArticle,
	createUser,
	getUser,
	loginUser,
	logoutCurrentUser,
	prepareToAcceptDialog,
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
		await createArticle(MOCK_ARTICLE_COMPLETIONS[0], ArticleStatus.DRAFT, user.id);
		await createArticle(MOCK_ARTICLE_COMPLETIONS[1], ArticleStatus.PUBLISHED, user.id);
	}
	user = await getUser(MOCK_USERS.bob.email);
	if (user) {
		await createArticle(MOCK_ARTICLE_COMPLETIONS[2], ArticleStatus.DRAFT, user.id);
		await createArticle(MOCK_ARTICLE_COMPLETIONS[3], ArticleStatus.PUBLISHED, user.id);
	}
}

test.describe('Profile', () => {
	test.beforeEach(async () => {
		await resetDatabase();
		await seedTest();
	});

	test.describe('When profile is of current user', () => {
		test.beforeEach(async ({ page }) => {
			await loginUser(MOCK_USERS.alice, page);
			await page.goto('/');
			await page
				.locator('span.metadata__author', { hasText: MOCK_USERS.alice.nickname })
				.first()
				.click();
			await expect(page.locator('h1.section__h1', { hasText: MOCK_USERS.alice.nickname })).toBeVisible(); // prettier-ignore
		});

		test.afterEach(async ({ page }) => {
			await logoutCurrentUser(page);
		});

		test('Can see published and draft articles', async ({ page }) => {
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[1].headline)).toBeVisible();
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[1].body[0])).toBeVisible(); // Summary
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[1].body[1])).not.toBeVisible();
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[1].notes)).not.toBeVisible();
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[0].headline)).not.toBeVisible();
			await expect(page.locator('li.profile-summary__li', { hasText: 'Drafts 1' })).toBeVisible(); // prettier-ignore
			await expect(page.locator('li.profile-summary__li', { hasText: 'Published 1' })).toBeVisible(); // prettier-ignore
			await expect(page.locator('li.profile-summary__li', { hasText: 'Articles 1' })).not.toBeVisible(); // prettier-ignore

			await page.getByText('Drafts 1').click();
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[0].headline)).toBeVisible();
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[0].body[0])).toBeVisible(); // Summary
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[0].body[1])).not.toBeVisible();
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[0].notes)).not.toBeVisible();
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[1].headline)).not.toBeVisible();
		});

		test('Can publish draft articles', async ({ page }) => {
			const publishButton = page.locator('button[type=submit]', { hasText: 'Publish' });
			await expect(publishButton).not.toBeVisible();

			await page.getByText('Drafts 1').click();
			await expect(publishButton).not.toBeVisible();
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[0].notes)).not.toBeVisible();

			await page.getByText(MOCK_ARTICLE_COMPLETIONS[0].headline).click();
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[0].notes)).toBeVisible();
			await expect(publishButton).toBeVisible();

			await publishButton.click();
			await expect(page.locator('li.profile-summary__li', { hasText: 'Drafts 0' })).toBeVisible(); // prettier-ignore
			await expect(page.locator('li.profile-summary__li', { hasText: 'Published 2' })).toBeVisible(); // prettier-ignore
			await expect(publishButton).not.toBeVisible();

			await page.getByText('Drafts 0').click();
			await expect(page.getByText('No draft articles, generate one')).toBeVisible();
		});

		test('Can delete published or draft articles', async ({ page }) => {
			const deleteButton = page.locator('button[type=submit]', { hasText: 'Delete' });
			await expect(page.locator('a.profile-summary__a--active', { hasText: 'Published 1' })).toBeVisible(); // prettier-ignore
			await expect(page.locator('li.profile-summary__li', { hasText: 'Drafts 1' })).toBeVisible(); // prettier-ignore
			await expect(deleteButton).not.toBeVisible();

			await page.getByText('Drafts 1').click();
			await expect(page.locator('a.profile-summary__a--active', { hasText: 'Drafts 1' })).toBeVisible(); // prettier-ignore
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[0].headline)).toBeVisible();
			await expect(deleteButton).not.toBeVisible();
			
			await page.getByText(MOCK_ARTICLE_COMPLETIONS[0].headline).click();
			await expect(deleteButton).toBeVisible();

			await prepareToAcceptDialog(page, /Are you sure you want to delete the article?/);
			await deleteButton.click();
			await expect(page.locator('a.profile-summary__a--active', { hasText: 'Published 1' })).toBeVisible(); // prettier-ignore
			await expect(page.locator('li.profile-summary__li', { hasText: 'Drafts 0' })).toBeVisible(); // prettier-ignore
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[0].headline)).not.toBeVisible();
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[1].headline)).toBeVisible();
			await expect(deleteButton).not.toBeVisible();

			await page.getByText(MOCK_ARTICLE_COMPLETIONS[1].headline).click();
			await expect(deleteButton).toBeVisible();

			await deleteButton.click();
			await expect(page.getByText('No published articles, generate one')).toBeVisible();
			await expect(page.locator('li.profile-summary__li', { hasText: 'Published 0' })).toBeVisible(); // prettier-ignore
			await expect(page.locator('li.profile-summary__li', { hasText: 'Drafts 0' })).toBeVisible(); // prettier-ignore
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[1].headline)).not.toBeVisible();
		});
	});

	test.describe('When profile is not current user', () => {
		test.beforeEach(async ({ page }) => {
			await page.goto('/');
			await page.locator('span.metadata__author', { hasText: MOCK_USERS.bob.nickname }).click();
			await expect(page.locator('h1.section__h1', { hasText: MOCK_USERS.bob.nickname })).toBeVisible(); // prettier-ignore
		});

		test('Can only see published articles from other users', async ({ page }) => {
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[3].headline)).toBeVisible();
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[3].body[0])).toBeVisible(); // Summary
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[3].body[1])).not.toBeVisible();
			await expect(page.locator('li.profile-summary__li', { hasText: 'Drafts 1' })).not.toBeVisible(); // prettier-ignore
			await expect(page.locator('li.profile-summary__li', { hasText: 'Published 1' })).not.toBeVisible(); // prettier-ignore
			await expect(page.locator('li.profile-summary__li', { hasText: 'Articles 1' })).toBeVisible();
		});

		test('Date joined is displayed correctly', async ({ page }) => {
			const dateJoined = new Date().toLocaleDateString('en-US', {
				month: 'long',
				year: 'numeric'
			}); // i.e. March 2023
			await expect(page.locator('li.profile-summary__li', { hasText: `Joined ${dateJoined}` })).toBeVisible(); // prettier-ignore
		});
	});
});
