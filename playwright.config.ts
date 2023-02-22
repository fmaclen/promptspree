import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
	globalSetup: './playwright.global-setup',
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173,
		env: {
			TEST_POCKETBASE_URL: "http://127.0.0.1:8091"
		}
	},
	testDir: 'tests',
	timeout: 5000,
	use: { trace: 'retain-on-failure', screenshot: 'only-on-failure' }
};

export default config;
