<script lang="ts">
	export let name: string;
	export let value: string | number | null = null;
	export let placeholder: string = '';
	export let disabled: boolean = false;
	export let maxlength: number = 280;
	export let rows: number = 7;
	export let autofocus: boolean = false;
	export let textareaRef: HTMLTextAreaElement;
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
	bind:this={textareaRef}
/>

<style lang="scss">
	textarea.form-textarea {
		@import './Form.scss';
		@include baseInput;

		resize: vertical;
		line-height: 1.25em;
		height: 64px;
		box-sizing: border-box;

		&:disabled {
			@include disabledInput;
		}
	}
</style>
