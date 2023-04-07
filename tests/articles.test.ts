import { expect, test } from '@playwright/test';
import { readFileSync } from 'fs';

import { ArticleStatus } from '../src/lib/articles.js';
import { MockPrompt, MOCK_ARTICLE_COMPLETIONS } from '../src/lib/tests.js';
import { MOCK_USERS } from './lib/fixtures.js';
import {
	createArticle,
	createUser,
	expectToBeInHomepage,
	getLastArticle,
	getUser,
	goToHomepageViaLogo,
	loginUser,
	logoutCurrentUser,
	prepareToAcceptDialog,
	resetDatabase,
	updateArticle,
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

test.describe('Articles', () => {
	test.beforeAll(async () => {
		await resetDatabase();
	});

	test('No articles to browse', async ({ page }) => {
		await page.goto('/');
		await expectToBeInHomepage(page);
		await expect(page.getByText('Sorry, we can\'t show you the articles right now. Please try again later')).toBeVisible(); // prettier-ignore

		await page.getByText('Politics').click();
		await expect(page.getByText('Sorry, we can\'t show you the articles right now. Please try again later')).not.toBeVisible(); // prettier-ignore
		await expect(page.getByText('There are no articles in the Politics category, try creating one')).toBeVisible(); // prettier-ignore
	});

	test.describe('With articles', () => {
		test.beforeAll(async () => {
			await seedTest();
		});

		test.beforeEach(async ({ page }) => {
			await loginUser(MOCK_USERS.alice, page);
		});

		test.afterEach(async ({ page }) => {
			await logoutCurrentUser(page);
		});

		test('Can browse article summaries', async ({ page }) => {
			// Article by Alice
			await expect(page.getByText(MOCK_USERS.alice.nickname)).toBeVisible();
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[1].headline)).toBeVisible();
			await expect(page.locator('h2.article__h2', { hasText: MOCK_ARTICLE_COMPLETIONS[1].category })).toBeVisible(); // prettier-ignore
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[1].body[0])).toBeVisible(); // Summary
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[1].body[1])).not.toBeVisible();

			// Article by Bob
			await expect(page.getByText(MOCK_USERS.bob.nickname)).toBeVisible();
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[3].headline)).toBeVisible();
			await expect(page.locator('h2.article__h2', { hasText: MOCK_ARTICLE_COMPLETIONS[3].category })).toBeVisible(); // prettier-ignore
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[3].body[0])).toBeVisible(); // Summary
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[3].body[1])).not.toBeVisible();

			// Category page
			await page
				.locator('a.categories__a', { hasText: MOCK_ARTICLE_COMPLETIONS[1].category })
				.click();
			await expect(page.locator(`a.categories__a--${MOCK_ARTICLE_COMPLETIONS[1].category.toLowerCase()}`)).toHaveClass(/categories__a--active/); // prettier-ignore
			await expect(page.locator('h2.article__h2', { hasText: MOCK_ARTICLE_COMPLETIONS[1].category })).toBeVisible(); // prettier-ignore
			await expect(page.getByText(MOCK_USERS.alice.nickname)).toBeVisible();
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[1].headline)).toBeVisible();
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[1].body[0])).toBeVisible(); // Summary
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[1].body[1])).not.toBeVisible();
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[3].headline)).not.toBeVisible();
		});

		test('Can see published articles', async ({ page }) => {
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[1].body[0])).toBeVisible(); // Summary
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[1].body[1])).not.toBeVisible();
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[3].body[0])).toBeVisible(); // Summary
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[3].body[1])).not.toBeVisible();

			// Published article by Alice
			await page.getByText(MOCK_ARTICLE_COMPLETIONS[1].headline).click();
			await expect(page.locator('h1.article__h1', { hasText: MOCK_ARTICLE_COMPLETIONS[1].headline })).toBeVisible(); // prettier-ignore
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[1].body[0])).toBeVisible(); // Summary
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[1].body[1])).toBeVisible();
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[1].body[2])).toBeVisible();
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[1].notes)).toBeVisible();
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[3].headline)).not.toBeVisible();
			await expect(page.getByText('Delete')).toBeVisible();
			await expect(page.getByText('Publish')).not.toBeVisible();

			// Published article by Bob
			await goToHomepageViaLogo(page);
			await page.getByText(MOCK_ARTICLE_COMPLETIONS[3].headline).click();
			await expect(page.locator('h1.article__h1', { hasText: MOCK_ARTICLE_COMPLETIONS[3].headline })).toBeVisible(); // prettier-ignore
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[3].body[0])).toBeVisible(); // Summary
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[3].body[1])).toBeVisible();
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[3].body[2])).toBeVisible();
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[3].notes)).toBeVisible();
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[1].headline)).not.toBeVisible();
			await expect(page.getByText('Delete')).not.toBeVisible();
			await expect(page.getByText('Publish')).not.toBeVisible();
		});

		test("Can edit own draft articles", async ({ page }) => {
			// Published articles
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[1].headline)).toBeVisible();
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[3].headline)).toBeVisible();

			// Draft articles
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[0].headline)).not.toBeVisible();
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[2].headline)).not.toBeVisible();

			// Drafts by Alice
			let user = await getUser(MOCK_USERS.alice.email);
			let article = await getLastArticle(
				`status = "${ArticleStatus.DRAFT}" && user = "${user?.id}"`
			);
			expect(article?.headline).toBe(MOCK_ARTICLE_COMPLETIONS[0].headline);
			await expect(page.getByText('Publish')).not.toBeVisible();
			await expect(page.getByText('Edit')).not.toBeVisible();
			
			const generateButton = page.locator('button.chat__button-generate');
			
			await page.goto(`/profile/${user?.id}/drafts`);
			await page.getByText(MOCK_ARTICLE_COMPLETIONS[0].headline).click();
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[0].body[3])).toBeVisible();
			await expect(page.getByText('Publish')).toBeVisible();
			await expect(page.getByText('Edit')).toBeVisible();
			await expect(generateButton).not.toBeVisible();
			
			await page.getByText('Edit').click();
			await expect(generateButton).toBeVisible();
			await expect(page.locator('h1.chat__article-h1', { hasText: MOCK_ARTICLE_COMPLETIONS[0].headline })).toBeVisible(); // prettier-ignore
			
			await page.locator('textarea').fill(MockPrompt.GENERATE_ARTICLE_1);
			await generateButton.click();
			await expect(page.locator('h1.chat__article-h1', { hasText:MOCK_ARTICLE_COMPLETIONS[0].headline })).toBeVisible(); // prettier-ignore
			await expect(page.locator('h1.chat__article-h1', { hasText:MOCK_ARTICLE_COMPLETIONS[1].headline })).toBeVisible(); // prettier-ignore

			await page.goto(`/profile/${user?.id}/drafts`);
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[0].headline)).not.toBeVisible();
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[1].headline)).toBeVisible();

			// A draft by Bob can't be viewed by Alice
			user = await getUser(MOCK_USERS.bob.email);
			article = await getLastArticle(`status = "${ArticleStatus.DRAFT}" && user = "${user?.id}"`);
			expect(article?.headline).toBe(MOCK_ARTICLE_COMPLETIONS[2].headline);

			await page.goto(`/article/${article?.id}`);
			await expect(page.getByText('Error 404')).toBeVisible();
			await expect(page.getByText('Not found')).toBeVisible();
			await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[2].headline)).not.toBeVisible();
		});

		test('Articles with audio are listenable', async ({ page }) => {
			// NOTE: This test only checks that the player is visible when an audio path is present.
			const article = await getLastArticle(
				`headline = "${MOCK_ARTICLE_COMPLETIONS[1].headline}"`
			);

			const audioData = readFileSync('tests/lib/fixtures/the-great-plague.mp3');
			const audioBlob = new Blob([audioData], { type: 'audio/mp3' });
			const formData = new FormData();
			formData.append('audio', audioBlob, 'the-great-plague.mp3');
			article?.id && (await updateArticle(article?.id, formData));

			await page.getByText(MOCK_ARTICLE_COMPLETIONS[3].headline).click();
			await expect(page.locator('nav.article__audio', { hasText: 'Plus' })).not.toBeVisible();

			await goToHomepageViaLogo(page);
			await expect(page.locator('nav.article__audio', { hasText: 'Plus' })).not.toBeVisible();

			await page.getByText(MOCK_ARTICLE_COMPLETIONS[1].headline).click();
			await expect(page.locator('nav.article__audio', { hasText: 'Plus' })).toBeVisible();
			expect(await page.locator('audio.article__player').getAttribute('src')).toMatch(
				/^.*\/api\/files\/[^/]+\/[^/]+\/.+\.mp3$/
			); // 'xxx/api/files/xxx/xxx/xxx.mp3'
		});
	});

	test("Can delete user's authored articles", async ({ page }) => {
		await resetDatabase();
		await seedTest();
		await loginUser(MOCK_USERS.alice, page);
		await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[3].body[2])).not.toBeVisible();

		await page.getByText(MOCK_ARTICLE_COMPLETIONS[3].headline).click();
		await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[3].body[2])).toBeVisible();
		await expect(page.getByText('Delete')).not.toBeVisible();

		await goToHomepageViaLogo(page);
		await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[1].body[2])).not.toBeVisible();

		await page.getByText(MOCK_ARTICLE_COMPLETIONS[1].headline).click();
		await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[1].body[2])).toBeVisible();
		await expect(page.getByText('Delete')).toBeVisible();

		await prepareToAcceptDialog(page, /Are you sure you want to delete the article?/);
		await page.getByText('Delete').click();
		await expect(
			page.locator('h1.section__h1', { hasText: MOCK_USERS.alice.nickname })
		).toBeVisible();
		await expect(page.getByText('No published articles, generate one')).toBeVisible();
		await expect(page.getByText(MOCK_ARTICLE_COMPLETIONS[1].body[2])).not.toBeVisible();
	});
});
