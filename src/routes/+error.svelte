<script>
	import { page } from '$app/stores';
	import Notice from '$lib/components/Notice.svelte';

	let error500 =
		"An error ocurred on the server and whatever was happening likely didn't finish succesfully, please try again later";
</script>

<section class="error">
	<h1 class="error__h1">Error {$page.status}</h1>

	<Notice>{$page.status == 500 ? error500 : $page.error?.message}</Notice>
</section>

<style lang="scss">
	h1.error__h1 {
		text-align: center;
		font-weight: 200;
	}
</style>
