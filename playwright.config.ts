import { type PlaywrightTestConfig, devices } from '@playwright/test';

process.env.TEST_POCKETBASE_URL = 'http://127.0.0.1:8091';

const browserDevice = () => {
	const browser = process.env.BROWSER;

	switch (browser) {
		case 'ios':
			return {
				name: 'webkit',
				use: { ...devices[`iPhone 13`] }
			};
		case 'android':
			return {
				name: 'chromium',
				use: { ...devices[`Pixel 5`] }
			};
		case 'firefox':
			return {
				name: browser,
				use: { ...devices[`Desktop Firefox`] }
			};
		case 'webkit':
			return {
				name: browser,
				use: { ...devices[`Desktop Safari`] }
			};
		default:
			return {
				name: 'chromium',
				use: { ...devices[`Desktop Chrome`] }
			};
	}
};

const config: PlaywrightTestConfig = {
	globalSetup: './playwright.global-setup',
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173
	},
	testDir: 'tests',
	timeout: 10000,
	use: { trace: 'retain-on-failure', screenshot: 'only-on-failure' },
	projects: [browserDevice()],
	retries: process.env.NODE_ENV === 'CI' ? 3 : 0,
	workers: 1
};

export default config;
