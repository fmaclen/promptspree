<script>
	import { page } from '$app/stores';
	import HeadlineXl from '$lib/components/HeadlineXL.svelte';
	import Notice from '$lib/components/Notice.svelte';
	import Section from '$lib/components/Section.svelte';

	const DEFAULT_ERROR =
		"An error ocurred on our end and whatever was happening likely didn't finish succesfully, please try again later";

	let error = $page.error && $page.error.message;
</script>

<Section isVerticallyCentered={true}>
	<HeadlineXl>Error {$page.status}</HeadlineXl>
	<Notice>
		{error === 'Error: 500' ? DEFAULT_ERROR : error}
	</Notice>
</Section>
