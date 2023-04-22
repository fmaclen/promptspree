export const TEST_ADMIN_USER = 'playwright@example.com';
export const TEST_ADMIN_PASSWORD = 'playwright';

// NOTE:
// Our current testing setup runs on Linux using in Chromium, Firefox and Webkit
// at desktop and mobile resolutions.
//
// To run pixel perfect visual regression tests we would need dedicated snapshots
// for each OS and browser combination so to simplify things we use the macOS + Chromium
// snapshot as the source and allow the other scenarios to have a 10% pixel variance:
export const MAX_DIFF_PIXEL_RATIO = 0.1;

export const MOCK_USERS = {
	alice: {
		email: 'alice@example.com',
		nickname: 'Alice',
		password: 'playwright',
		passwordConfirm: 'playwright',
		terms: true
	},
	bob: {
		email: 'bob@example.com',
		nickname: 'Bob',
		password: 'playwright',
		passwordConfirm: 'playwright',
		terms: true
	},
	charlie: {
		email: 'charlie@example.com',
		nickname: 'Charlie',
		password: 'playwright',
		passwordConfirm: 'playwright',
		terms: true
	},
	dave: {
		email: 'dave@example.com',
		nickname: 'Dave',
		password: 'playwright',
		passwordConfirm: 'playwright',
		terms: true
	},
	eve: {
		email: 'eve@example.com',
		nickname: 'Eve',
		password: 'playwright',
		passwordConfirm: 'playwright',
		terms: true
	},
	frank: {
		email: 'frank@example.com',
		nickname: 'Frank',
		password: 'playwright',
		passwordConfirm: 'playwright',
		terms: true
	},
	grace: {
		email: 'grace@example.com',
		nickname: 'Grace',
		password: 'playwright',
		passwordConfirm: 'playwright',
		terms: true
	},
	henry: {
		email: 'henry@example.com',
		nickname: 'Henry',
		password: 'playwright',
		passwordConfirm: 'playwright',
		terms: true
	},
	isabelle: {
		email: 'isabelle@example.com',
		nickname: 'Isabelle',
		password: 'playwright',
		passwordConfirm: 'playwright',
		terms: true
	},
	jack: {
		email: 'jack@example.com',
		nickname: 'Jack',
		password: 'playwright',
		passwordConfirm: 'playwright',
		terms: true
	},
	kate: {
		email: 'kate@example.com',
		nickname: 'Kate',
		password: 'playwright',
		passwordConfirm: 'playwright',
		terms: true
	}
};
