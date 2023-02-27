// see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { type PlaywrightTestConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

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

const isCiEnvironment = process.env.NODE_ENV === 'ci';

const config: PlaywrightTestConfig = {
	globalSetup: './playwright.global-setup',
	webServer: [
		{
			command: 'npm run build && npm run preview',
			port: 4173,
			env: {
				NODE_ENV: 'test'
			}
		},
		{
			command: 'npm run setup:pocketbase:test && npm run backend:test',
			port: 8091
		}
	],
	testDir: 'tests',
	timeout: isCiEnvironment ? 30000 : 10000,
	use: {
		trace: 'retain-on-failure',
		screenshot: 'only-on-failure',
		baseURL: 'http://localhost:4173'
	},
	projects: [browserDevice()],
	retries: isCiEnvironment ? 3 : 0,
	workers: 1
};

export default config;
