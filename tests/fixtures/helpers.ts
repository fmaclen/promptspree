import PocketBase from 'pocketbase';

export const TEST_ADMIN_USER = 'playwright@example.com';
export const TEST_ADMIN_PASSWORD = 'playwright';

export const TEST_USERS = {
	alice: {
		email: 'alice@example.com',
		nickname: 'Alice',
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
