import { BrowserType, chromium, expect, firefox, webkit } from '@playwright/test';
import axios from 'axios';

import { TEST_ADMIN_PASSWORD, TEST_ADMIN_USER } from './tests/lib/fixtures.js';

async function globalSetup() {
	const { TEST_POCKETBASE_URL } = process.env;

	// Check that the backend server is running before running tests
	try {
		const res = await axios.get(`${TEST_POCKETBASE_URL}/api/health`);
		console.info('-> Pocketbase status', res.data);
	} catch (err) {
		throw new Error(`Couldn't connect to backend server: ${err}`);
	}

	let browserName = process.env.BROWSER;
	if (!browserName) {
		console.warn("-> No browser specified, using 'chromium' by default");
		browserName = 'chromium';
	}

	// Determine which browser is being used
	let browserType: BrowserType;
	if (browserName === 'firefox') {
		browserType = firefox;
	} else if (browserName === 'webkit' || browserName === 'ios') {
		browserType = webkit;
	} else if (browserName === 'chromium' || browserName === 'android') {
		browserType = chromium;
	} else {
		console.error(`Invalid browser specified: ${browserName}`);
		process.exit(1);
	}

	const browser = await browserType.launch();
	const page = await browser.newPage();

	await page.goto(`${TEST_POCKETBASE_URL}/_/`);
	await page.getByLabel('Email').fill(TEST_ADMIN_USER);
	await page.getByLabel('Password', { exact: true }).fill(TEST_ADMIN_PASSWORD);
	await page.getByLabel('Password Confirm').fill(TEST_ADMIN_PASSWORD);
	await page.getByText('Create and login').click();
	expect(await page.textContent('.breadcrumb-item')).toBe('Collections');
}

export default globalSetup;
