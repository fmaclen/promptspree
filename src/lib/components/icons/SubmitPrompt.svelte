<script lang="ts">
	export let isDisabled: boolean = false;
</script>

<svg
	class={`submit-prompt-icon ${isDisabled ? 'submit-prompt-icon--disabled' : ''}`}
	width="16"
	height="16"
	viewBox="0 0 16 16"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<g clip-path="url(#clip0_351_5651)">
		<path
			d="M3.60004 9.60085V14.5009C3.60004 15.2009 4.40004 15.5009 4.90004 15.0009L7.20004 12.3009L11.9 15.8009C12.3 16.1009 12.9 15.9009 13 15.4009L16 0.900854C16.1 0.300854 15.6 -0.099146 15 0.100854L0.500041 5.90085C4.0561e-05 6.10085 -0.0999594 6.80085 0.300041 7.20085L1.90004 8.40085L6.50004 6.20085C6.90004 6.00085 7.20004 6.50085 6.90004 6.70085L3.60004 9.60085Z"
			fill="#A4B0AC"
		/>
	</g>
	<defs>
		<clipPath id="clip0_351_5651">
			<rect width="16" height="16" fill="white" />
		</clipPath>
	</defs>
</svg>

<style lang="scss">
	svg.submit-prompt-icon {
		path {
			fill: var(--color-primary);
		}

		&--disabled {
			path {
				fill: var(--color-neutral-500);
			}
		}
	}
</style>
