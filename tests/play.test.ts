import { expect, test } from '@playwright/test';
import PocketBase from 'pocketbase';

import { TEST_ADMIN_PASSWORD, TEST_ADMIN_USER, TEST_USERS } from './helpers/fixtures.js';

test.describe('Play', () => {
	// const pb = new PocketBase(process.env.TEST_POCKETBASE_URL);

	// async function resetDatabase(): Promise<void> {
	// 	const users = await pb.collection('users').getFullList(200);
	// 	for (const user of users) {
	// 		await pb.collection('users').delete(user.id);
	// 	}
	// }

	// async function verifyUser(email: string): Promise<void> {
	// 	const user = await pb.collection('users').getFirstListItem(`email = "${email}"`);
	// 	await pb.collection('users').update(user.id, { verified: true });
	// }

	// test.beforeAll(async () => {
	// 	await pb.admins.authWithPassword(TEST_ADMIN_USER, TEST_ADMIN_PASSWORD);
	// });

	// test.beforeEach(async () => {
	// 	await resetDatabase();
	// });

	test("Can't play, user is not logged in", async ({ page }) => {
		await page.goto("/");
		await page.locator("a.primary-action", { hasText: "Play" }).click();
		await expect(page.getByText('Already have an account? Login')).toBeVisible();
		await expect(page.getByText('Enter a prompt below to generate an article')).not.toBeVisible();	});
});
