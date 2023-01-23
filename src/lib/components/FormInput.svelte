<script lang="ts">
	export let name: string;
	export let type: string = 'text';
	export let value: string = '';
	export let placeholder: string = '';
	export let disabled: boolean = false;
</script>

<input {type} {name} {value} {placeholder} {disabled} class="form-field-input" />

<style lang="scss">
	input.form-field-input {
		@import './Form.scss';
		@include baseInput;

		line-height: 1em;

		&:disabled {
			@include disabledInput;
		}
	}
</style>
