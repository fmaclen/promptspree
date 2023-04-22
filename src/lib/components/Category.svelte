<script lang="ts">
	export let label: string;

	const id = label.toLowerCase();
</script>

<a href="/category/{id}" class="category category--{id}">
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
		transition: transform 100ms linear, filter 100ms linear;
		padding-top: 4px;
		padding-bottom: 2px;
		padding-right: 12px;
		border-radius: var(--border-radius-m);
		color: var(--color-neutral-900);

		--halftone-size: 16px;
		padding-left: var(--halftone-size);

		background-color: var(--color-neutral-100); // Base color
		background-image: url('/HalftoneCategoryButton.svg');
		background-repeat: no-repeat;
		background-position: center left;
		background-size: var(--halftone-size);

		@media (hover: hover) and (pointer: fine) {
			&:hover {
				transform: scale(1.1);
			}
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
</style>
