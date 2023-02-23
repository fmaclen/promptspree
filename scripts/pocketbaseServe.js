import { spawn } from 'child_process';
import path from 'path';

function runPocketBaseServe() {
	const args = process.argv.slice(2); // Ignore first two arguments
	const port = args[0] ? parseInt(args[0]) : 8090; // Default port is 8090

	let http = `127.0.0.1:${port}`;
	let dir, migrationsDir;

	// If port is 8091, use the `tests/pocketbase` directories for `pb_data` and `pb_migrations`
	if (port === 8091) {
		dir = path.join('tests', 'pocketbase', 'pb_data');
		migrationsDir = path.join('tests', 'pocketbase', 'pb_migrations');
	}

	const pocketbaseExecutable = path.join('pocketbase', 'pocketbase');
	const pocketbaseArguments = ['serve', `--http=${http}`];

	if (dir) {
		pocketbaseArguments.push(`--dir=${dir}`);
	}
	if (migrationsDir) {
		pocketbaseArguments.push(`--migrationsDir=${migrationsDir}`);
	}

	console.info('-> Starting Pocketbase');
	const pocketBaseServe = spawn(pocketbaseExecutable, pocketbaseArguments, {
		stdio: 'inherit',
		shell: true
	});

	pocketBaseServe.on('error', (error) => {
		console.error(`Error running PocketBase serve: ${error}`);
	});

	pocketBaseServe.on('exit', (code, signal) => {
		console.info(`PocketBase serve has stopped with code ${code} and signal ${signal}`);
	});
}

runPocketBaseServe();
