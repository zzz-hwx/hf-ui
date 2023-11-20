<template>
	<view>
		<u-form :model="model">
			<view class="title">表单 (级联选择器)</view>
			<view class="form">
				<view class="sub-title">基本用法</view>
				<hf-form-cascader
					v-model="model.str1"
					label="基本用法"
					placeholder="请选择"
					:options="options"
				></hf-form-cascader>
			</view>
			
		</u-form>
		
		<view class="title">自定义展示部分 (页面查询条件)</view>
		<view class="section">
			<hf-form-cascader v-model="model.str9" :options="options">
				<template v-slot:display-section="{ valueName, visible }">
					<u-icon
						:name="visible ? 'arrow-up-fill' : 'arrow-down-fill'"
						size="14"
						:label="valueName || '全部'"
						labelPos="left"
					></u-icon>
				</template>
			</hf-form-cascader>
		</view>
		
		<temp-data :info="model"></temp-data>
	</view>
</template>

<script>
export default {
	data() {
		return {
			model: {
				str1: '1-2',
				str9: ''
			},
			options: [{
					value: '1',
					text: '一级 1',
					children: [{
						value: '1-1',
						text: '二级 1-1',
						children: [{
							value: '1-1-1',
							text: '三级 1-1-1',
							children: [{
								value: '1-1-1-1',
								text: '四级 1-1-1-1'
							}]
						}]
					}, {
						value: '1-2',
						text: '二级 1-2',
					}]
				}, {
					value: '2',
					text: '一级 2',
					children: [{
						value: '2-1',
						text: '二级 2-1'
					}]
				}
			]
		};
	}
}
</script>

<style lang="scss" scoped>
	@import '@/common/styles/form.scss';
</style>
