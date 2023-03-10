import { env } from '$env/dynamic/private';

// HACK: This is a *hopefully* temporary implementation so we can log errors in
// production by posting them to a Slack channel.
export const logEventToSlack = async (context: string, payload: unknown) => {
	if (!env.SLACK_WEBHOOK_URL) return;

	const eventBody: string[] = [];

	eventBody.push(`\`${context}\``);
	eventBody.push(`\`\`\`${JSON.stringify(payload)}\`\`\``);

	try {
		const options = {
			method: 'POST',
			body: JSON.stringify({ text: eventBody.join(' ') }),
			headers: { 'Content-Type': 'application/json' }
		};
		const response = await fetch(env.SLACK_WEBHOOK_URL, options);
		if (!response.ok) {
			throw new Error(`Error sending request: ${response.statusText}`);
		}
	} catch (err) {
		console.error(err);
	}
};
