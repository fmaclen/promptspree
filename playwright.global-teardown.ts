async function globalTeardown() {
	try {
		const res = await fetch(`${process.env.TEST_POCKETBASE_URL}/api/health`);
		console.info('-> Pocketbase still active?', await res.json());
	} catch (err) {
		throw new Error(`Couldn't connect to backend server: ${err}`);
	}

  const pocketbasePid = process.env.POCKETBASE_PID;
  if (pocketbasePid) {
    process.kill(parseInt(pocketbasePid));
    delete process.env.POCKETBASE_PID;
  }
}

export default globalTeardown;
