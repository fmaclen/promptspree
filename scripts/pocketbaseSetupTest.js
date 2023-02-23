import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';

const rm = promisify(fs.rm);
const copyFile = promisify(fs.copyFile);
const readdir = promisify(fs.readdir);
const mkdir = promisify(fs.mkdir);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

async function setupPocketbaseTests() {
	console.info('-> Resetting `tests/pocketbase`');
	const baseDir = path.join(rootDir, 'tests', 'pocketbase');
	const migrationsDir = path.join(rootDir, 'pocketbase', 'pb_migrations');

	// Remove any existing files and folders inside tests/pocketbase
	await rm(baseDir, { recursive: true, force: true });

	// Recreate the tests/pocketbase directory
	await mkdir(path.join(baseDir, 'pb_migrations'), { recursive: true });

	// Copy everything from pocketbase/pb_migrations to tests/pocketbase/pb_migrations
	console.info('-> Copying `pocketbase/pb_migrations` to `tests/pocketbase/pb_migrations`');
	const files = await readdir(migrationsDir);
	for (const file of files) {
		const srcPath = path.join(migrationsDir, file);
		const destPath = path.join(baseDir, 'pb_migrations', file);
		await copyFile(srcPath, destPath);
	}
}

setupPocketbaseTests();
