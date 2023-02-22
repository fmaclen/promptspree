import { chromium, expect, firefox, webkit } from '@playwright/test';

import { TEST_ADMIN_PASSWORD, TEST_ADMIN_USER } from './tests/fixtures/helpers.js';

async function globalSetup() {
	console.info('-> Starting globalSetup');

	// Check that the backend server is running before running tests
	try {
		const res = await fetch(`${process.env.TEST_POCKETBASE_URL}/api/health`);
		console.info('-> Pocketbase status', await res.json());
	} catch (err) {
		throw new Error(`Couldn't connect to backend server: ${err}`);
	}

	let browserName = process.argv.find((arg) => arg.startsWith('--browser='))?.split('=')[1];
	if (!browserName) {
		console.warn("-> No browser specified, using 'chromium'");
		browserName = 'chromium';
	}

	// Determine which browser is being used
	const browserType =
		browserName === 'firefox' ? firefox : browserName === 'webkit' ? webkit : chromium;

	console.info('-> Launching browser');
	const browser = await browserType.launch();
	const page = await browser.newPage();

	console.info('-> Creating admin user');
	await page.goto(`${process.env.TEST_POCKETBASE_URL}/_/`);
	await page.getByLabel('Email').fill(TEST_ADMIN_USER);
	// take screenshot
	await page.screenshot({ path: 'tests/screenshots/1.png' });
	await page.getByLabel('Password', { exact: true }).fill(TEST_ADMIN_PASSWORD);
	await page.getByLabel('Password Confirm').fill(TEST_ADMIN_PASSWORD);
	await page.getByText('Create and login').click();
	expect(await page.textContent('.breadcrumb-item')).toBe('Collections');

	console.info('-> Finished globalSetup');
}

export default globalSetup;
