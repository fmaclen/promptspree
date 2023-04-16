<script lang="ts">
	export let isVerticallyCentered: boolean = false;
</script>

<section class="section {isVerticallyCentered ? 'section--vertically-centered' : ''}">
	<div class="section__container">
		<slot />
	</div>
</section>

<style lang="scss">
	section.section {
		@include container-outer;
		display: flex;
		align-items: center;
		flex-direction: column;
		row-gap: 64px;

		@media (max-width: 768px) {
			padding: 32px;
			row-gap: 32px;
			box-sizing: border-box;
		}

		&:not(:first-of-type) {
			padding-top: 0;
		}

		&--vertically-centered {
			max-width: 576px;
			margin-block: auto;
		}
	}

	div.section__container {
		@include container-inner;
		padding-block: 64px;

		@media (max-width: 768px) {
			padding-block: 32px;
		}
	}
</style>
