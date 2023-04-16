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
		padding-block: 32px;

		@media (max-width: 768px) {
			font-size: 32px;
			padding-block: 24px;
		}
	}

  span.headline-xl__inner {
    @include container-inner;
		padding-inline: 0;
  }
</style>
