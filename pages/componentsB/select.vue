<template>
	<view>
		<u-form :model="model">
			<view class="title">表单 (列表选择器)</view>
			<view class="form">
				<view class="sub-title">基本用法</view>
				<hf-form-select
					v-model="model.str1"
					label="性别 dict-code"
					placeholder="请选择"
					dict-code="GENDER"
				></hf-form-select>
				<hf-form-select
					v-model="model.str2"
					label="性别 options"
					placeholder="请选择"
					:options="options"
				></hf-form-select>
				
				<view class="sub-title">右侧弹出</view>
				<hf-form-select
					v-model="model.str3"
					label="单选"
					placeholder="请选择"
					dict-code="GENERALS_RANKING"
					mode="right"
					search
				></hf-form-select>
				<hf-form-select
					v-model="model.str4"
					label="多选"
					placeholder="请选择"
					dict-code="GENERALS_RANKING"
					mode="right"
					search
					multiple
				></hf-form-select>
				<hf-form-select
					v-model="model.str5"
					label="拼音搜索"
					placeholder="请选择"
					dict-code="GENERALS_RANKING"
					mode="right"
					search
					pinyin
					multiple
				></hf-form-select>
				
				<view class="sub-title">控制显示字段名</view>
				<hf-form-select
					v-model="model.str6"
					label="picker"
					placeholder="请选择"
					:options="options2"
					key-name="text"
					key-value="id"
					key-disabled="disabled"
				></hf-form-select>
				<hf-form-select
					v-model="model.str7"
					label="右侧弹框"
					placeholder="请选择"
					:options="options2"
					key-name="text"
					key-value="id"
					key-disabled="disabled"
					mode="right"
					search
					multiple
				></hf-form-select>
			</view>
			
			<view class="title">作用域插槽 (列表项item)</view>
			<view class="form">
				<hf-form-select
					v-model="model.str8"
					label="点击展开查看"
					placeholder="请选择"
					:options="options2"
					mode="right"
					key-name="text"
					key-value="id"
					key-disabled="disabled"
				>
					<template v-slot:item="{ item }">
						<text>{{ item.text }}</text>
						<text v-if="item.disabled" class="p-l-xs"> --- 不可选择</text>
					</template>
				</hf-form-select>
			</view>
		</u-form>
		
		<view class="title">自定义展示部分 (页面查询条件)</view>
		<view class="section">
			<hf-form-select v-model="model.str9" dict-code="GENDER">
				<template v-slot:display-section="{ valueName, visible }">
					<u-icon
						:name="visible ? 'arrow-up-fill' : 'arrow-down-fill'"
						size="14"
						:label="valueName || '性别'"
						labelPos="left"
					></u-icon>
				</template>
			</hf-form-select>
		</view>
		
		<temp-data :info="model"></temp-data>
	</view>
</template>

<script>
export default {
	data() {
		return {
			model: {
				str1: '1',
				str2: '3',
				str3: '3',
				str4: '3,5,6,b,e,n',
				str5: '2,3',
				str6: '2',
				str7: '2,3,4',
				str8: '',
				str9: ''
			},
			options: [
				{ label: '男', value: '1' },
				{ label: '女', value: '2' },
				{ label: '人妖', value: '3' },
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
</style>
