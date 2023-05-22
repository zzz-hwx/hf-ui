<template>
	<view class="hf-form-textarea">
		<u-form-item :label="label" :prop="prop" :required="required" :label-position="labelPosition" :borderBottom="borderBottom">
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
	}
</style>
