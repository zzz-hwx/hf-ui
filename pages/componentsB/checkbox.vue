<template>
	<view>
		<view class="title">表单 (复选框)</view>
		<u-form :model="model">
			<view class="form">
				<view class="sub-title">基本用法</view>
				<hf-form-checkbox
					v-model="model.str1"
					label="多选"
					placeholder="请选择"
					dict-code="GENERALS_RANKING"
				></hf-form-checkbox>
				<hf-form-checkbox
					v-model="model.str2"
					label="多选"
					placeholder="请选择"
					dict-code="GENERALS_RANKING"
				></hf-form-checkbox>
				<hf-form-checkbox
					v-model="model.str3"
					label="options"
					placeholder="请选择"
					:options="options"
				></hf-form-checkbox>
				
				<view class="sub-title">右侧弹出</view>
				<hf-form-checkbox
					v-model="model.str4"
					label="右侧弹出"
					placeholder="请选择"
					dict-code="GENERALS_RANKING"
					mode="right"
					search
				></hf-form-checkbox>
				<hf-form-checkbox
					v-model="model.str5"
					label="拼音搜索"
					placeholder="请选择"
					dict-code="GENERALS_RANKING"
					mode="right"
					search
					pinyin
				></hf-form-checkbox>
				
				<view class="sub-title">控制显示字段名</view>
				<hf-form-checkbox
					v-model="model.str6"
					label="控制显示字段名"
					required
					placeholder="请选择"
					:options="options2"
					key-name="text"
					key-value="id"
					key-disabled="disabled"
				></hf-form-checkbox>
				
				<view class="sub-title">禁用样式</view>
				<hf-form-checkbox
					v-model="model.str7"
					label="禁用"
					required
					placeholder="请选择"
					disabled
					:options="options"
				></hf-form-checkbox>
			</view>
			
			<view class="title">作用域插槽</view>
			<view class="form">
				<hf-form-checkbox
					v-model="model.str8"
					label="多选"
					required
					placeholder="请选择"
					:options="options2"
					key-name="text"
					key-value="id"
					key-disabled="disabled"
				>
					<template v-slot:check-list="{ list }">
						<view v-for="item in list" :key="item.id" class="check-item">
							<text>{{ item.text }}</text>
						</view>
					</template>
					<template v-slot:item="{ item }">
						<text>{{ item.text }}</text>
						<text v-if="item.disabled" class="p-l-xs"> --- 不可选择</text>
					</template>
				</hf-form-checkbox>
			</view>
		</u-form>
		
		<temp-data :info="model"></temp-data>
	</view>
</template>

<script>
export default {
	data() {
		return {
			model: {
				str1: '',
				str2: '3,5,8,b,e,n',
				str3: '',
				str4: '',
				str5: '',
				str6: '',
				str7: '',
				str8: '3,4,5'
			},
			options: [
				{ label: '选项1', value: '1' },
				{ label: '选项2', value: '2' },
				{ label: '选项3', value: '3' },
			],
			options2: [
				{ text: '选项1', id: '1' },
				{ text: '选项2', id: '2' },
				{ text: '选项3', id: '3' },
				{ text: '选项4', id: '4', disabled: true },
				{ text: '选项5', id: '5' },
			]
		};
	}
}
</script>

<style lang="scss" scoped>
	@import '@/common/styles/form.scss';
	.check-item {
		margin-right: $xs;
		background-color: $u-warning-light;
		border: 1px solid $u-warning;
		border-radius: 8rpx;
		padding: $xs $sm;
		color: $u-warning;
	}
</style>
