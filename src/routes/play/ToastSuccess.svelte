<script lang="ts">
	import A from '$lib/components/A.svelte';
	import { Sentiment } from '$lib/utils';

	export let toast: any;
</script>

<span>
	Article saved to
	<A href="/profile/{toast.userId}/drafts" sentiment={Sentiment.POSITIVE}>drafts</A>
</span>
