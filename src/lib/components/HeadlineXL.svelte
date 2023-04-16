<h1 class="headline-xl">
	<span class="headline-xl__inner">
    <slot />
  </span>
</h1>

<style lang="scss">
	h1.headline-xl {
		@include container-outer;
		@include headline-xl;
    text-align: center;
		padding-top: 24px;
		padding-bottom: 24px;
		color: var(--color-neutral-100);

		@media (max-width: 768px) {
			font-size: 32px;
		}
	}

  span.headline-xl__inner {
    @include container-inner;
  }
</style>
