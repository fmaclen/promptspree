<script>
	import { page } from '$app/stores';
	import H3 from '$lib/components/H3.svelte';
	import Notice from '$lib/components/Notice.svelte';
	import Section from '$lib/components/Section.svelte';
	import SectionGroup from '$lib/components/SectionGroup.svelte';
	import { Sentiment } from '$lib/utils';

	const DEFAULT_ERROR =
		"An error ocurred on our end and whatever was happening likely didn't finish succesfully, please try again later";

	let error = $page.error && $page.error.message;
</script>

<Section>
	<SectionGroup>
		<H3>Error {$page.status}</H3>
		<Notice sentiment={Sentiment.NEGATIVE}>
			{error === 'Error: 500' ? DEFAULT_ERROR : error}
		</Notice>
	</SectionGroup>
</Section>
