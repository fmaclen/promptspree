<script lang="ts">
	import Halftone from '$lib/components/backgrounds/Halftone.svelte';

	export let label: string;
	export let isActive: boolean | undefined = false;

	const id = label.toLowerCase();
</script>

<a href="/category/{id}" class="category category--{id} {isActive ? 'category--active' : ''}">
	<span class="category__halftone">
		<Halftone />
	</span>

	{label}
</a>

<style lang="scss">
	a.category {
		@include subtitle-m;
		position: relative;
		font-weight: bold;
		text-decoration: none;
		box-sizing: border-box;
		color: inherit;
		width: max-content;
		padding-top: 4px;
		padding-bottom: 2px;
		padding-left: 20px;
		padding-right: 12px;
		border-radius: var(--border-radius-m);
		color: var(--color-neutral-900);
		background-color: var(--color-neutral-100);
		transition: transform 100ms linear, filter 100ms linear;

		&:hover {
			transform: scale(1.1);
		}

		&--politics {
			background-color: #cfcdcb;
		}

		&--business {
			background-color: #9dd1ef;
		}

		&--technology {
			background-color: #5dd2e9;
		}

		&--entertainment {
			background-color: #5d75e9;
		}

		&--science {
			background-color: #8c5de9;
		}

		&--health {
			background-color: #ba5de9;
		}

		&--sports {
			background-color: #5de975;
		}

		&--culture {
			background-color: #d2e95d;
		}

		&--fashion {
			background-color: #e9ba5d;
		}

		&--opinion {
			background-color: #e95d5d;
		}
	}

	span.category__halftone {
		position: absolute;
		overflow: hidden;
		top: 50%;
		left: 0;
		width: 100%;
		height: 100%;
		transform: translateY(-50%);

		:global(path) {
			fill: var(--color-neutral-900);
		}
	}
</style>
