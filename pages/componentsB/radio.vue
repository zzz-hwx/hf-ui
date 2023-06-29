<template>
	<view class="">
		<view class="title">表单</view>
		<view class="form">
			<u-form :model="model">
				<hf-form-radio
					v-model="model.gender"
					label="性别"
					prop="gender"
					:required="!disabled"
					:disabled="disabled"
					dict-code="GENDER"
				></hf-form-radio>
				<hf-form-radio
					v-model="model.sex"
					label="性别"
					prop="sex"
					:required="!disabled"
					:disabled="disabled"
					:options="options"
				></hf-form-radio>
			</u-form>
		</view>
		
		<view class="title">单选框</view>
		<view class="bg-white">
			<view class="radio">
				<hf-radio v-model="model.sex" :options="options" mode="radio"></hf-radio>
			</view>
			<view class="radio">
				<hf-radio v-model="model.sex" :options="options" mode="text"></hf-radio>
			</view>
			<view class="radio">
				<hf-radio v-model="model.sex" :options="options" mode="btn"></hf-radio>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				model: {
					gender: '',
					sex: '1'
				},
				disabled: false,
				options: [
					{ value: '1', label: '男' },
					{ value: '2', label: '女', disabled: true },
				]
			};
		}
	}
</script>

<style lang="scss" scoped>
@import "~@/common/styles/form.scss";

.radio {
	padding: $sm $df;
}
</style>
