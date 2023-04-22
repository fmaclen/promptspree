<script lang="ts">
	export let isVerticallyCentered: boolean = false;
	export let title: string | undefined = undefined;
	export let subtitle: string | undefined = undefined;
</script>

{#if title}
	<header class="section__header">
		<div class="section__container">
			<strong class="section__header__key">{title}</strong>
			{#if subtitle}
				<span class="section__header__value">{subtitle}</span>
			{/if}
		</div>
	</header>
{/if}
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
		padding-block: 64px;

		@media (max-width: 768px) {
			padding-block: 32px;
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
	}

	header.section__header {
		@include container-outer;
		text-align: center;
		padding-inline: 32px;
		padding-block: 24px;
		background-color: var(--color-neutral-900);
	}

	strong.section__header__key,
	span.section__header__value {
		@media (max-width: 640px) {
			@include subtitle-m;
		}
	}
	strong.section__header__key {
		@include subtitle-l;
	}

	span.section__header__value {
		@include subtitle-l;
		font-weight: unset;
		color: var(--color-neutral-300);
	}
</style>
