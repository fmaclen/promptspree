<script lang="ts">
	export let name: string;
	export let value: string | number | null = null;
	export let placeholder: string = '';
	export let disabled: boolean = false;
	export let maxlength: number = 280;
	export let rows: number = 7;
	export let autofocus: boolean = false;
</script>

<!-- svelte-ignore a11y-autofocus -->
<textarea
	{autofocus}
	{name}
	{placeholder}
	{disabled}
	{maxlength}
	{rows}
	class="form-textarea"
	bind:value
/>

<style lang="scss">
	textarea.form-textarea {
		@import './Form.scss';
		@include baseInput;

		resize: vertical;
		line-height: 1.25em;
		min-height: 84px;
		max-height: 10vh;
		box-sizing: border-box;

		&:disabled {
			@include disabledInput;
		}
	}
</style>
