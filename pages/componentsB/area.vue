<template>
	<view>
		<view class="title">表单</view>
		<view class="form">
			<u-form :model="model">
				<hf-form-area
					v-model="model.str1"
					label="最后一级"
					placeholder="请选择"
				></hf-form-area>
				<hf-form-area
					v-model="model.str2"
					label="全路径"
					placeholder="请选择"
					full-path
				></hf-form-area>
			</u-form>
		</view>
		<view class="title">数据</view>
		<view class="model">
			<text>{{ model }}</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			model: {
				str1: '350403',
				str2: '350000,350400,350403'
			},
		};
	}
}
</script>

<style lang="scss" scoped>
	@import '@/common/styles/form.scss';
	.model {
		padding: $df;
		background-color: $bg-white;
		white-space: pre;
	}
</style>
