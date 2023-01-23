<script lang="ts">
	export let name: string;
	export let value: string = '';
	export let placeholder: string = '';
	export let disabled: boolean = false;
	export let maxlength: number = 280;
	export let rows: number = 7;
</script>

<textarea {name} {value} {placeholder} {disabled} {maxlength} {rows} class="form-textarea" />

<style lang="scss">
	textarea.form-textarea {
		@import './Form.scss';
		@include baseInput;

		resize: vertical;
		line-height: 1.25em;

		&:disabled {
			@include disabledInput;
		}
	}
</style>
