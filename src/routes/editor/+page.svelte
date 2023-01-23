<script>
	// import type { PageData } from './$types';
	import Article from '$lib/components/Article.svelte';

	const PLACEHOLDER_ARTICLE = {
		headline: 'Flibbertigibbet Jibber-jabber Jiggery-pokery',
		summary:
			'This article delves into the world of flibbertigibbet jibber-jabber jiggery-pokery, a fascinating and little-known phenomenon that has recently been gaining attention in the scientific community.',
		body: 'The first thing to know about flibbertigibbet jibber-jabber jiggery-pokery is that it is a complex and multi-faceted phenomenon. At its core, it is a form of communication that is characterized by its nonsensical and seemingly random nature. Despite its apparent lack of meaning, however, flibbertigibbet jibber-jabber jiggery-pokery has been found to be a powerful tool for expressing deep emotions and ideas.',
		collectionId: 'collectionId',
		collectionName: 'collectionName',
		id: 'id',
		image: [],
		updated: '2021-05-01T00:00:00.000Z',
		isPlaceholder: true
	};
	let article = PLACEHOLDER_ARTICLE;

	// const isLoggedIn = data.user || false;
	const isLoggedIn = false;
	const isPublishable = isLoggedIn && false;
</script>

<section class="section">
	<h1 class="section__h1">Editor</h1>
	<div class="editor">
		<form class="form" action="?/login" method="POST">
			<fieldset class="form__fieldset">
				Prompt
				<label class="form__field">
					<textarea
						name="prompt"
						class="form__textarea"
						placeholder={isLoggedIn
							? 'Write a placeholder article'
							: 'Login, then generate and publish your article'}
						disabled={!isLoggedIn}
					/>
				</label>

				<button type="submit" class="form__button" disabled={!isLoggedIn}>Generate</button>
			</fieldset>
		</form>

		<form class="form form--preview" action="?/login" method="POST">
			<fieldset class="form__fieldset">
				Preview
				<Article {article} />
				<button type="submit" class="form__button" disabled={!isPublishable}>Publish</button>
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
		gap: 1rem;
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

	/* button.form__button,
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

		&:disabled {
			cursor: not-allowed;
		}

		&:focus {
			outline: 1px solid slateblue;
			background-color: transparent;
		}
	} */

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

		&:hover:not(:disabled) {
			background-color: slateblue;
		}

		&:disabled {
			opacity: 0.25;
		}
	}
</style>
