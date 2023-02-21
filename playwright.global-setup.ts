import { chromium, expect, firefox, webkit } from '@playwright/test';
import * as cp from 'child_process';
import * as fs from 'fs';

import { TEST_ADMIN_PASSWORD, TEST_ADMIN_USER } from './tests/fixtures/helpers.js';

async function globalSetup() {
	process.env.TEST_POCKETBASE_URL = 'http://127.0.0.1:8091';

	// Delete everything in tests/pocketbase
	fs.rmSync('tests/pocketbase/pb_data', { recursive: true, force: true });
	fs.rmSync('tests/pocketbase/pb_migrations', { recursive: true, force: true });

	// Create the tests/pocketbase directory if it doesn't exist
	fs.mkdirSync('tests/pocketbase/pb_migrations', { recursive: true });

	// Copy migrations from pocketbase/pb_migrations to tests/pocketbase/pb_migrations
	const files = fs.readdirSync('pocketbase/pb_migrations');
	for (const file of files) {
		const src = `pocketbase/pb_migrations/${file}`;
		const dest = `tests/pocketbase/pb_migrations/${file}`;
		fs.copyFileSync(src, dest);
	}

	// Start pocketbase
	const pocketbaseProcess = cp.spawn(
		'./pocketbase/pocketbase',
		[
			'serve',
			'--debug',
			`--http=${process.env.TEST_POCKETBASE_URL.slice(7)}`, // Slices `http://`
			'--dir=tests/pocketbase/pb_data',
			'--migrationsDir=tests/pocketbase/pb_migrations'
		],
		{ detached: true, stdio: 'pipe' }
	);
	pocketbaseProcess.stdout?.pipe(process.stdout);
	process.env.TEST_POCKETBASE_PID = pocketbaseProcess.pid?.toString();

	// Check that the backend server is running before running tests
	setTimeout(async () => {
		try {
			const res = await fetch(`${process.env.TEST_POCKETBASE_URL}/api/health`);
			console.info('-> Pocketbase status', await res.json());
		} catch (err) {
			throw new Error(`Couldn't connect to backend server: ${err}`);
		}
	}, 1000);

	let browserName = process.argv.find((arg) => arg.startsWith('--browser='))?.split('=')[1];
	if (!browserName) {
		console.warn("-> No browser specified, using 'chromium'");
		browserName = 'chromium';
	}

	// Determine which browser is being used
	const browserType =
		browserName === 'firefox' ? firefox : browserName === 'webkit' ? webkit : chromium;
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
}

export default globalSetup;
