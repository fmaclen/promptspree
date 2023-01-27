<script>
	import { page } from '$app/stores';
	import H3 from '$lib/components/H3.svelte';
	import Notice from '$lib/components/Notice.svelte';
	import Section from '$lib/components/Section.svelte';
	import SectionGroup from '$lib/components/SectionGroup.svelte';

	const DEFAULT_ERROR =
		"An error ocurred on our end and whatever was happening likely didn't finish succesfully, please try again later";

	let error = $page.error && $page.error.message;
</script>

<Section>
	<SectionGroup>
		<H3>Error {$page.status}</H3>
		<Notice>{!error && error !== 'Error: 500' ? error : DEFAULT_ERROR}</Notice>
	</SectionGroup>
</Section>

<style lang="scss">
	h1.error__h1 {
		text-align: center;
		font-weight: 200;
	}
</style>
