<template>
	<view class="">
		<view class="title">表单 (hf-form-radio)</view>
		<view class="form">
			<u-form :model="model">
				<hf-form-radio
					v-model="model.radio1"
					label="单选"
					prop="radio2"
					:required="!disabled"
					:disabled="disabled"
					dict-code="TEST"
				></hf-form-radio>
				<hf-form-radio
					v-model="model.radio2"
					label="性别"
					:required="!disabled"
					:disabled="disabled"
					dict-code="GENDER"
				></hf-form-radio>
				<hf-form-radio
					v-model="model.radio3"
					label="性别"
					:required="!disabled"
					:disabled="disabled"
					:options="options"
				></hf-form-radio>
				<hf-form-radio
					v-model="model.radio4"
					label="名著"
					:required="!disabled"
					:disabled="disabled"
					:options="options2"
					key-name="text"
					key-value="id"
					key-disabled="disabled"
				></hf-form-radio>
			</u-form>
		</view>
		
		<view class="title">单选 (hf-radio)</view>
		<view class="bg-white">
			<view class="radio">
				<hf-radio v-model="model.radio3" :options="options" mode="radio"></hf-radio>
			</view>
			<view class="radio">
				<hf-radio v-model="model.radio3" :options="options" mode="text"></hf-radio>
			</view>
			<view class="radio">
				<hf-radio v-model="model.radio3" :options="options" mode="btn"></hf-radio>
			</view>
			<view class="radio">
				<hf-radio
					v-model="model.radio4"
					:options="options2"
					mode="radio"
					key-name="text"
					key-value="id"
					key-disabled="disabled"
				></hf-radio>
			</view>
		</view>
		
		<temp-data :info="model"></temp-data>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				model: {
					radio1: '',
					radio2: '',
					radio3: '3',
					radio4: ''
				},
				disabled: false,
				options: [
					{ value: '1', label: '男' },
					{ value: '2', label: '女' },
					{ value: '3', label: '人妖', disabled: true },
				],
				options2: [
					{ id: '1', text: '西游记' },
					{ id: '2', text: '红楼梦' },
					{ id: '3', text: '水浒传', disabled: true },
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
