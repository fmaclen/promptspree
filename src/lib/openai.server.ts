import { Configuration, OpenAIApi } from 'openai';
import { env } from '$env/dynamic/private';

const ARTICLE_PROMPT_SHAPE = {
	headline: 'Headline should be shorter than 80 characters',
	summary: 'Summary should be shorter than 200 characters',
	body: [
		'Paragraph 1 should be shorter than 140 characters',
		'Paragraph 2 should be shorter than 280 characters'
	]
};

const configuration = new Configuration({
	apiKey: env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

const formatPrompt = (prompt: string) => {
	return `
		${prompt}

		Format the response using this JSON shape:

		${JSON.stringify(ARTICLE_PROMPT_SHAPE)}
	`;
};

export const getCompletionFromAI = async (prompt: string) => {
	const completion = await openai.createCompletion({
		model: 'text-davinci-003',
		temperature: 0.7,
		max_tokens: 256,
		top_p: 1.0,
		frequency_penalty: 0.0,
		presence_penalty: 1,
		prompt: formatPrompt(prompt)
	});

	return completion.data.choices[0].text;
};
