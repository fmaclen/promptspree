import { chromium, expect } from '@playwright/test';
import { TEST_ADMIN_USER, TEST_ADMIN_PASSWORD } from './tests/fixtures/helpers.js';

async function globalSetup() {
	const { TEST_POCKETBASE_URL } = process.env;

	// Check that the backend server is running before running tests
	console.info('-> Checking that test backend server is running');
	try {
		await fetch(`${TEST_POCKETBASE_URL}/api/health`);
	} catch (err) {
		throw new Error(`Couldn't connect to backend server: ${err}`);
	}

	// Create admin user
	const browser = await chromium.launch();
	const page = await browser.newPage();

	await page.goto(`${TEST_POCKETBASE_URL}/_/`);
	await page.getByLabel('Email').fill(TEST_ADMIN_USER);
	await page.getByLabel('Password', { exact: true }).fill(TEST_ADMIN_PASSWORD);
	await page.getByLabel('Password Confirm').fill(TEST_ADMIN_PASSWORD);
	await page.getByText('Create and login').click();
	expect(await page.textContent('.breadcrumb-item')).toBe('Collections');
}

export default globalSetup;
