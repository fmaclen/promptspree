<script>
	import { page } from '$app/stores';
	import Notice from '$lib/components/Notice.svelte';
	import Section from '$lib/components/Section.svelte';
	import { Sentiment } from '$lib/utils';

	const DEFAULT_ERROR =
		"An error ocurred on our end and whatever was happening likely didn't finish succesfully, please try again later";

	let error = $page.error && $page.error.message;
</script>

<Section isFullscreen={true} title="Error {$page.status}">
	<Notice sentiment={Sentiment.NEGATIVE}>
		{error === 'Error: 500' ? DEFAULT_ERROR : error}
	</Notice>
</Section>
