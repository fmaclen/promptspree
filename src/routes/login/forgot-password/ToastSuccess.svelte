<script lang="ts">
	import A from '$lib/components/A.svelte';
	import { Sentiment } from '$lib/utils';
</script>

<span>
	Email has been sent. Reset the password and
	<A href="/login" isHighlighted={true} sentiment={Sentiment.POSITIVE}>login here</A>
</span>
