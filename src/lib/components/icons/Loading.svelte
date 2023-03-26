<svg
	class="loading-icon"
	xmlns="http://www.w3.org/2000/svg"
	xmlns:xlink="http://www.w3.org/1999/xlink"
	x="0px"
	y="0px"
	width="14px"
	height="14px"
	viewBox="0 0 16 16"
>
	<g transform="translate(0, 0)">
		<g class="nc-loop-dots-anim-6-16-icon-o">
			<circle cx="1.5" cy="8" r="1.5" />
			<circle cx="8" cy="8" r="1.5" />
			<circle cx="14.5" cy="8" r="1.5" />
		</g>
	</g>
</svg>

<style lang="scss">
	svg.loading-icon {
		circle {
			fill: var(--color-neutral-300);
		}
	}

	/* ------------------------------------------------------------------------ */

	.nc-loop-dots-anim-6-16-icon-o,
	.nc-loop-dots-anim-6-16-icon-o > * {
		--animation-duration: 1.2s;
	}
	.nc-loop-dots-anim-6-16-icon-o {
		transform-origin: 50% 50%;
		animation: nc-loop-dots-anim-6 var(--animation-duration) infinite;
	}
	.nc-loop-dots-anim-6-16-icon-o > :nth-child(2),
	.nc-loop-dots-anim-6-16-icon-o > :nth-child(3) {
		transform-origin: 11.25px 50%;
		animation: nc-loop-dots-anim-6-inner var(--animation-duration) infinite;
	}
	@keyframes nc-loop-dots-anim-6 {
		0%,
		50% {
			transform: rotate(0);
		}
		100% {
			animation-timing-function: cubic-bezier(1, 0, 0, 1);
			transform: rotate(180deg);
		}
	}
	@keyframes nc-loop-dots-anim-6-inner {
		0% {
			transform: rotate(0);
		}
		100%,
		50% {
			animation-timing-function: cubic-bezier(1, 0, 0, 1);
			transform: rotate(180deg);
		}
	}
</style>
