<template>
	<view class="hf-form-textarea">
		<u-form-item :label="label" :prop="prop" :required="required" :label-position="labelPosition" :label-width="labelWidth" :borderBottom="borderBottom">
			<u-textarea
				:value="value"
				:placeholder="placeholder"
				:disabled="disabled"
				:border="border"
				disableDefaultPadding
				:maxlength="maxlength"
				:count="count"
				:height="height"
				:custom-style="textareaStyle"
				@input="handleInput"></u-textarea>
		</u-form-item>
	</view>
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
			labelWidth: {
				type: [String, Number],
				default: 'auto'
			},
			maxlength: {	// 最大输入长度
				type: [String, Number],
				default: 140
			},
			textAlign: {
				type: String,
				default: 'left'
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
		// #ifdef MP-WEIXIN
		options: {
			styleIsolation: 'shared'
		},
		// #endif
		computed: {
			textareaStyle() {
				const style = {
					textAlign: this.textAlign,
					background: '#fff'
				}
				if (this.border === 'none') {
					style.padding = 0;
				}
				return style;
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
	.hf-form-textarea {
		/deep/ .u-textarea {
			margin-top: $sm;
			.u-textarea__field {
				color: $u-main-color;
			}
		}
		/deep/ .u-form-item__body__right__message {
			// 表单校验的错误提示 放左侧
			margin-left: 0 !important;
		}
	}
</style>
