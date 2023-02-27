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

const isCI = process.env.NODE_ENV === 'CI';

const config: PlaywrightTestConfig = {
	globalSetup: './playwright.global-setup',
	webServer: [
		{
			command: 'npm run build && npm run preview',
			port: 4173
		},
		{
			command: 'npm run setup:pocketbase:test && npm run backend:test',
			port: 8091
		}
	],
	testDir: 'tests',
	timeout: isCI ? 30000 : 10000,
	use: {
		trace: 'retain-on-failure',
		screenshot: 'only-on-failure',
		baseURL: 'http://localhost:4173'
	},
	projects: [browserDevice()],
	retries: isCI ? 3 : 0,
	workers: 1
};

export default config;
