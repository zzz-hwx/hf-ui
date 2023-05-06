<template>
	<u-form-item :label="label" :prop="prop" :required="required" :label-position="labelPosition" :border-bottom="borderBottom">
		<u-input :value="value" :placeholder="placeholder" :disabled="disabled" border="none" disabled-color="#ffffff" input-align="right" @input="handleInput"></u-input>
	</u-form-item>
</template>

<script>
	import mixin from '../../libs/mixins/form.js';
	export default {
		name: 'HfFormInput',
		mixins: [mixin],
		methods: {
			handleInput(val) {
				this.$emit('input', val);
			}
		}
	}
</script>

<style>
</style>
