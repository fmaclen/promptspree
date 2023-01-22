<script>
	import Article from '$lib/components/Article.svelte';

	const ARTICLE = {
		headline: 'Lex Fridman Overcomes Fear of Flash Websites',
		summary:
			'Lex Fridman, a renowned computer scientist, descibes his struggle with fobia to Flash websites and his triumphant journey to overcome it.',
		body: 'Lex Fridman, a renowned computer scientist and MIT professor, has recently opened up about his lifelong struggle with fobia to Flash websites. He was diagnosed with the condition at a young age, and the fear of Flash websites caused him to avoid many activities online.',
		collectionId: 'collectionId',
		collectionName: 'collectionName',
		id: 'id',
		image: [],
		updated: '2021-05-01T00:00:00.000Z',
		prompt:
			'Write a breaking news article Lex Fridman has fobia to Flash websites, describes struggle'
	};
</script>

<section class="section">
	<h1 class="section__h1">Editor</h1>
	<div class="editor">
		<form class="form" action="?/login" method="POST">
			<fieldset class="form__fieldset">
				<label class="form__field">
					Prompt
					<textarea name="prompt" class="form__textarea" placeholder="Enter your prompt here." />
				</label>

				<button type="submit" class="form__button">Generate</button>
			</fieldset>
		</form>

		<form class="form form--preview" action="?/login" method="POST">
			<fieldset class="form__fieldset">
				<Article article={ARTICLE} />
				<button type="submit" class="form__button" disabled={true}>Publish</button>
			</fieldset>
		</form>
	</div>
</section>

<style lang="scss">
	h1.section__h1 {
		// same as 	h1.homepage__headline
		font-family: 'EB Garamond', 'Georgia', serif;
		font-size: 2.25rem;
		letter-spacing: -0.025em;
		line-height: 1em;
		margin-top: 0;
		margin-bottom: 1rem;
	}

	div.editor {
		display: flex;
		gap: 4rem;
		width: 100%;
	}

	form.form {
		display: block;
		width: 100%;
		border: 1px solid #e2e2e2;
		padding: 2rem;

		&--preview {
			background-color: #f4f4f4;
		}
	}

	div.preview {
		background-color: #fff;
	}

	fieldset.form__fieldset {
		border: none;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		max-width: 480px;
		margin-inline: auto;
	}

	label.form__field {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		font-size: 0.75rem;
		font-weight: 500;
	}

	button.form__button,
	textarea.form__textarea,
	input.form__input {
		font-size: 0.75rem;
		font-family: 'IBM Plex Mono', 'Courier New', monospace;
		display: block;
		width: 100%;
		border: 1px solid transparent;
		background-color: #f4f4f4;
		padding: 1rem;
		box-sizing: border-box;
		color: slateblue;

		&:focus {
			outline: 1px solid slateblue;
			background-color: transparent;
		}
	}

	textarea.form__textarea {
		min-height: 256px;
	}

	button.form__button {
		font-weight: 500;
		background-color: #222;
		border: 1px solid #e2e2e2;
		cursor: pointer;
		transition: background-color 0.2s ease-in-out;
		font-weight: 700;
		color: #fff;

		&:hover {
			background-color: slateblue;
		}
	}
</style>
