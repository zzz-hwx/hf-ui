<template>
	<view class="">
		<u-form ref="uForm" :model="model" :rules="rules">
			<view class="form">
				<hf-form-tree
					v-model="model.key1"
					label="多选"
					placeholder="请选择"
					:options="options"
					:default-props="defaultProps"
					multiple
				></hf-form-tree>
				<hf-form-tree
					v-model="model.key2"
					label="多选 可选父节点"
					placeholder="请选择"
					:options="options"
					:default-props="defaultProps"
					multiple
					select-parent
				></hf-form-tree>
				<hf-form-tree
					v-model="model.key3"
					label="多选 可选父节点 父子不互相关联"
					placeholder="请选择"
					:options="options"
					:default-props="defaultProps"
					multiple
					select-parent
					select-strictly
					label-position="top"
					label-width="auto"
				></hf-form-tree>
				<hf-form-tree
					v-model="model.key4"
					label="单选"
					placeholder="请选择"
					:options="options"
					:default-props="defaultProps"
					search
					pinyin
				></hf-form-tree>
			</view>
			<u-gap></u-gap>
			<view class="form">
				<hf-form-tree
					v-model="model.key5"
					label="任务下派"
					placeholder="请选择"
					:options="options2"
					:default-props="defaultProps"
					multiple
					select-parent
					select-strictly
					last-icon="people"
					last-icon-color="#CCCCCC"
				></hf-form-tree>
			</view>
		</u-form>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				model: {
					key1: '1-1-1-1,1-1-1-3',
					key2: '1-1-1-2',
					key3: '1,1-1-1-2',
					key4: '1-1-1-2',
					key5: '1,1-1-1-1,1-1-3,1-2-2-1',
				},
				rules: {
					// 
				},
				defaultProps: {
					text: 'text',
					value: 'value',
					children: 'children',
					noShowLastIcon: 'noShowLastIcon'
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
										children: [
											{ value: '1-1-1-1', text: '四级 1-1-1-1' },
											{ value: '1-1-1-2', text: '四级 1-1-1-2' },
											{ value: '1-1-1-3', text: '四级 1-1-1-3' },
										]
									}
								]
							}, {
								value: '1-2',
								text: '二级 1-2',
								children: [
									{ value: '1-2-1', text: '三级 1-2-1' },
									{ value: '1-2-2', text: '三级 1-2-2' },
								]
							}
						]
					}, {
						value: '2',
						text: '一级 2',
						children: [{
								value: '2-1',
								text: '二级 2-1'
							}, {
								value: '2-2',
								text: '二级 2-2',
								children: [
									{ value: '2-2-1', text: '三级 2-2-1' },
									{ value: '2-2-2', text: '三级 2-2-2' },
								]
							},
						]
					}
				],
				// 最后一级显示 lastIcon; 仅人员 (网格下可能没有人员)
				options2: [{
						value: '1',
						text: '鼓楼区',
						children: [{
								value: '1-1',
								text: '社区名称',
								children: [{
										value: '1-1-1',
										text: '第一网格',
										children: [
											{ value: '1-1-1-1', text: '刘一' },
											{ value: '1-1-1-2', text: '陈二' },
										]
									}, {
										value: '1-1-2',
										text: '第二网格',
										children: [
											{ value: '1-1-2-1', text: '张三' },
											{ value: '1-1-2-2', text: '李四' },
											{ value: '1-1-2-3', text: '王五' },
										]
									}, {
										value: '1-1-3',
										text: '第三网格',
										children: [
											{ value: '1-1-3-1', text: '赵六' },
											{ value: '1-1-3-2', text: '孙七' },
											{ value: '1-1-3-3', text: '周八' },
										]
									}
								]
							}, {
								value: '1-2',
								text: '社区名称',
								children: [{
										value: '1-2-1',
										text: '第四网格',
										children: [
											{ value: '1-2-1-1', text: '吴九' },
											{ value: '1-2-1-2', text: '郑十' },
										]
									}, {
										value: '1-2-2',
										text: '第五网格',
										children: [
											{ value: '1-2-2-1', text: '张三丰' },
											{ value: '1-2-2-2', text: '张三丰' },
										]
									},
								]
							}, {
								value: '1-3',
								text: '社区名称(叶子节点 不显示icon)',
								noShowLastIcon: true
							}
						]
					}, {
						value: '2',
						text: '台江区',
						children: [{
								value: '2-1',
								text: '社区名称',
								children: [
									{ value: '2-1-1', text: '第一网格', noShowLastIcon: true }, 
									{ value: '2-1-2', text: '第二网格', noShowLastIcon: true },
									{ value: '2-1-3', text: '第三网格', noShowLastIcon: true }
								]
							},
						]
					}
				]
			};
		},
		methods: {
			confirm() {
				console.log('--- 打印 --->', uni.$u.deepClone(this.model));
				// 
			},
		}
	}
</script>

<style lang="scss" scoped>
@import "~@/common/styles/form.scss";
</style>
