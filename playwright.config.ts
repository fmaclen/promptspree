import { type PlaywrightTestConfig, devices } from '@playwright/test';

process.env.TEST_POCKETBASE_URL = "http://127.0.0.1:8091"
const browser = process.env.BROWSER;
const projectBrowser = [
	{
		name: browser,
		use: { ...devices[`Desktop ${browser}`] }
	}
];

const config: PlaywrightTestConfig = {
	globalSetup: './playwright.global-setup',
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173,
	},
	testDir: 'tests',
	timeout: 5000,
	use: { trace: 'retain-on-failure', screenshot: 'only-on-failure' },
	projects: projectBrowser,
	retries: 3
};

export default config;
