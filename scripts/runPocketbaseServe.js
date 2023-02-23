import { spawn } from 'child_process';

function runPocketBaseServe() {
	const args = process.argv.slice(2); // ignore first two arguments
	const port = parseInt(args[0]) ?? 8090;
	const fileExtension = process.platform === 'win32' ? '.exe' : '';

	let http = `127.0.0.1:${port}`;
	let dir, migrationsDir;

	if (port === 8091 || port === 8092) {
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
		console.log(`PocketBase serve has stopped with code ${code} and signal ${signal}`);
	});
}

runPocketBaseServe();
