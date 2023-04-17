<script lang="ts">
	export let size: 's' | 'm' | 'l' = 'm';
</script>

<p class={`p p--${size}`}>
	<slot />
</p>

<style lang="scss">
	p.p {
		@include paragraph-m;
		color: var(--color-neutral-200);

		&--s {
			@include paragraph-s;
		}

		&--l {
			@include paragraph-l;
		}
	}
</style>
