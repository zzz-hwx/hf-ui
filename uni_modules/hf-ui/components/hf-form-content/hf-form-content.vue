<template>
	<view class="hf-form-content">
		<text v-if="value">{{ value }}</text>
		<text v-else class="placeholder">{{ placeholder }}</text>
	</view>
</template>

<script>
	/**
	 * u-form-item 的内容
	 * 使用 uni.$u.formValidate(this.$refs.input, 'change'); 进行表单校验
	 * 微信小程序 普通标签设置ref属性 $refs 里没有对应实例 (不是组件 ?)
	 * 故: 改为组件, 为了可以在 hf-form-xxx 组件内部触发 u-form-item 的表单校验
	 */
	export default {
		props: {
			value: {
				type: [String, Number],
				default: ''
			},
			placeholder: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
.hf-form-content {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	font-size: $font-df;
	.placeholder {
		color: $u-light-color;
	}
}
</style>
