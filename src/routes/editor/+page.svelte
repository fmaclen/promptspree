<script>
	// import type { PageData } from './$types';
	import Article from '$lib/components/Article.svelte';
	import FormButton from '$lib/components/FormButton.svelte';
	import FormField from '$lib/components/FormField.svelte';
	import FormTextarea from '$lib/components/FormTextarea.svelte';

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

<section class="editor">
	<form class="form" action="/article?/generate" method="POST">
		<FormField label="Prompt">
			<FormTextarea
				name="prompt"
				placeholder="Write a placeholder article about Flibbertigibbet Jibber-jabber Jiggery-pokery"
			/>
		</FormField>
		<FormButton label="Generate" type="submit" />
	</form>

	<form class="form form--preview" action="/article?/publish" method="POST">
		<Article {article} />
		<FormButton label="Publish" type="submit" disabled={!isPublishable} />
	</form>
</section>

<style lang="scss">
	section.editor {
		display: grid;
		width: 100%;
		grid-template-columns: 1fr 1fr;
		column-gap: 32px;
		align-items: center;
	}

	form.form {
		display: flex;
		flex-direction: column;
		row-gap: 16px;
	}
</style>
