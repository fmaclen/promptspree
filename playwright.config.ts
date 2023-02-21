import { type PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
	globalSetup: './playwright.global-setup',
	globalTeardown: './playwright.global-teardown',
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173,
		env: {
			TEST_POCKETBASE_URL: process.env.TEST_POCKETBASE_URL || ''
		}
	},
	testDir: 'tests',
	timeout: 5000,
	use: { trace: 'retain-on-failure', screenshot: 'only-on-failure' }
};

export default config;
