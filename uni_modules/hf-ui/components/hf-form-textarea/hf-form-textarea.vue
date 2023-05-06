<template>
	<u-form-item :label="label" :prop="prop" :required="required" :label-position="labelPosition" :borderBottom="borderBottom">
		<u-textarea
			class="textarea"
			:class="border"
			:value="value"
			:placeholder="placeholder"
			:disabled="disabled"
			:border="border"
			disableDefaultPadding
			:maxlength="maxlength"
			:count="count"
			:height="height"
			:style="textareaStyle"
			@input="handleInput"></u-textarea>
	</u-form-item>
</template>

<script>
	import mixin from '../../libs/mixins/form.js';
	export default {
		name: 'HfFormTextarea',
		mixins: [mixin],
		props: {
			labelPosition: {
				type: String,
				default: 'top'
			},
			maxlength: {	// 最大输入长度
				type: [String, Number],
				default: 140
			},
			textAlign: {
				type: String,
				default: 'right'
			},
			border: {
				type: String,
				default: 'none'
			},
			count: {
				type: Boolean,
				default: false
			},
			height: {
				type: [String, Number],
				default: 70
			}
		},
		computed: {
			textareaStyle() {
				return `text-align: ${this.textAlign}`;
			}
		},
		methods: {
			handleInput(val) {
				this.$emit('input', val);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.textarea {
		/deep/ .u-textarea__field {
			color: $u-main-color;
		}
		&.none {
			padding: 0;
		}
		background-color: $bg-white;
	}
</style>
