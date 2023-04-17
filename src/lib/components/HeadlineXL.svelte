<h1 class="headline-xl">
	<div class="headline-xl__inner">
		<slot />
	</div>
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

	div.headline-xl__inner {
		@include container-inner;

		@media (max-width: 768px) {
			padding-inline: 0px;
		}
	}
</style>
