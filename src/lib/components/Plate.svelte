<div class="plate">
	<slot />
</div>

<style lang="scss">
	div.plate {
		/* border: 1px solid hsl(0, 0%, 85%); */
		border-radius: var(--border-radius-l);
		/* box-shadow: 1px 1px 0 rgba(255, 255, 255, 0.5), inset 1px 1px 0 rgba(255, 255, 255, 0.5); */
		width: 100%;
	}
</style>
