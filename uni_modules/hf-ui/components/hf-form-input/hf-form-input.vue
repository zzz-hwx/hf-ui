<template>
	<u-form-item :label="label" :prop="prop" :required="required" :label-position="labelPosition" :border-bottom="borderBottom">
		<u-input :value="value" :placeholder="placeholder" :disabled="disabled" border="none" disabled-color="#ffffff" @input="handleInput"></u-input>
	</u-form-item>
</template>

<script>
	import mixin from '../../libs/mixins/form.js';
	export default {
		name: 'HfFormInput',
		mixins: [mixin],
		props: {
			type: {
				// 输入框类型
				// number-数字输入键盘，app-vue下可以输入浮点数，app-nvue和小程序平台下只能输入整数
				// idcard-身份证输入键盘，微信、支付宝、百度、QQ小程序
				// digit-带小数点的数字键盘，App的nvue页面、微信、支付宝、百度、头条、QQ小程序
				// text-文本输入键盘
				type: String,
				default: uni.$u.props.input.type
			},
			password: {
				// 是否密码类型
				type: Boolean,
				default: uni.$u.props.input.password
			},
		},
		methods: {
			handleInput(val) {
				this.$emit('input', val);
			}
		}
	}
</script>

<style>
</style>
