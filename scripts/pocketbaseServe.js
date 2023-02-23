import { spawn } from 'child_process';

function runPocketBaseServe() {
	const args = process.argv.slice(2); // Ignore first two arguments
	const port = args[0] ? parseInt(args[0]) : 8090; // Default port is 8090
	const fileExtension = process.platform === 'win32' ? '.exe' : '';

	let http = `127.0.0.1:${port}`;
	let dir, migrationsDir;

	// If port is 8091, use the `tests/pocketbase` directories for `pb_data` and `pb_migrations`
	if (port === 8091) {
		dir = 'tests/pocketbase/pb_data';
		migrationsDir = 'tests/pocketbase/pb_migrations';
	}

	let command = `pocketbase/pocketbase${fileExtension} serve --http=${http}`;
	if (dir) {
		command += ` --dir=${dir}`;
	}
	if (migrationsDir) {
		command += ` --migrationsDir=${migrationsDir}`;
	}

	console.info('-> Starting Pocketbase');
	const pocketBaseServe = spawn(command, { stdio: 'inherit', shell: true });

	pocketBaseServe.on('error', (error) => {
		console.error(`Error running PocketBase serve: ${error}`);
	});

	pocketBaseServe.on('exit', (code, signal) => {
		console.info(`PocketBase serve has stopped with code ${code} and signal ${signal}`);
	});
}

runPocketBaseServe();
