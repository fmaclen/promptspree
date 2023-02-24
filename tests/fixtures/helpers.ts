import PocketBase from 'pocketbase';

export const TEST_ADMIN_USER = 'playwright@example.com';
export const TEST_ADMIN_PASSWORD = 'playwright';

export const TEST_USERS = {
	alice: {
		email: 'alice@example.com',
		nickname: 'Alice',
		password: 'playwright'
	},
	bob: {
		email: 'bob@example.com',
		nickname: 'Bob',
		password: 'playwright'
	},
	charlie: {
		email: 'charlie@example.com',
		nickname: 'Charlie',
		password: 'playwright'
	},
	dave: {
		email: 'dave@example.com',
		nickname: 'Dave',
		password: 'playwright'
	},
	eve: {
		email: 'eve@example.com',
		nickname: 'Eve',
		password: 'playwright'
	},
	frank: {
		email: 'frank@example.com',
		nickname: 'Frank',
		password: 'playwright'
	},
	grace: {
		email: 'grace@example.com',
		nickname: 'Grace',
		password: 'playwright'
	},
	henry: {
		email: 'henry@example.com',
		nickname: 'Henry',
		password: 'playwright'
	},
	isabelle: {
		email: 'isabelle@example.com',
		nickname: 'Isabelle',
		password: 'playwright'
	},
	jack: {
		email: 'jack@example.com',
		nickname: 'Jack',
		password: 'playwright'
	},
	kate: {
		email: 'kate@example.com',
		nickname: 'Kate',
		password: 'playwright'
	}
};

export const pocketbaseVerifyUser = async (email: string) => {
	const pb = new PocketBase(process.env.TEST_POCKETBASE_URL);

	// Login as admin
	await pb.admins.authWithPassword(TEST_ADMIN_USER, TEST_ADMIN_PASSWORD);

	// Find user and verify it
	const user = await pb.collection('users').getFirstListItem(`email = "${email}"`);
	await pb.collection('users').update(user.id, { verified: true });
};
