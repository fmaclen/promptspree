<script lang="ts">	
	export let href: string | undefined = undefined;
	export let type: 'button' | 'submit' | 'reset' | undefined = undefined;
	export let primary: boolean | undefined = undefined;
	export let secondary: boolean | undefined = undefined;
	export let dark: boolean | undefined = undefined;
</script>

{#if href}
	<a href={href} class="a {primary ? 'a--primary' : ''} {secondary ? 'a--secondary' : ''} {dark ? 'a--dark' : ''}">
		<slot />
	</a>
{:else}
	<button type={type} class="button {primary ? 'button--primary' : ''} {secondary ? 'a--secondary' : ''} {dark ? 'button--dark' : ''}">
		<slot />
	</button>
{/if}

<style lang="scss">
	a.a,
	button.button {
		display: inline-block;
		padding: 10px 12px;
		font-family: var(--font-sans);
		font-size: 13px;
		font-weight: 600;
		color: hsl(0, 0%, 30%);
		background-color: transparent;
		box-sizing: border-box;
		text-align: center;

		border-radius: 2px;
		width: max-content;

		border: 1px solid hsl(0, 0%, 80%);
		box-shadow: inset 4px 4px 0 rgba(255,255,255,.35);

		&--secondary {
			/* box-shadow: inset 1px 1px 0 rgba(255,255,255,.35); */
			font-weight: 400;
			padding: 8px 12px;
		}

		&:active {
			box-shadow: inset 4px 4px 0 rgba(0,0,0,.05);
			background-color: var(--color-white);
		}
	}

	a.a {
		text-decoration: none;
	}
</style>
