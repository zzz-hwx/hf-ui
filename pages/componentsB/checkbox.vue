<template>
	<view>
		<view class="title">表单</view>
		<view class="form">
			<u-form :model="model">
				<hf-form-checkbox
					v-model="model.str"
					label="多选"
					placeholder="请选择"
					:options="options"
				></hf-form-checkbox>
				<hf-form-checkbox
					v-model="model.str"
					label="多选 必填"
					required
					placeholder="请选择"
					:options="options"
				></hf-form-checkbox>
			</u-form>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			model: {
				str: '3,5,8,b,e,n'
			},
			options: [
				{ value: '1', label: '吕布吕奉先' },
				{ value: '2', label: '赵云赵子龙' },
				{ value: '3', label: '典韦' },
				{ value: '4', label: '关羽关云长' },
				{ value: '5', label: '马超马孟起' },
				{ value: '6', label: '张飞张翼德', disabled: true },
				{ value: '7', label: '黄忠' },
				{ value: '8', label: '许褚' },
				{ value: '9', label: '孙策' },
				{ value: 'a', label: '太史慈' },
				{ value: 'b', label: '夏侯惇' },
				{ value: 'c', label: '夏侯渊' },
				{ value: 'd', label: '张辽' },
				
				{ value: 'e', label: '曹操曹孟德' },
				{ value: 'f', label: '曹丕' },
				{ value: 'g', label: '曹植' },
				{ value: 'h', label: '曹冲' },
				{ value: 'i', label: '曹昂' },
				{ value: 'j', label: '曹安民' },
				{ value: 'k', label: '郭嘉' },
				{ value: 'l', label: '孙权孙仲谋' },
				{ value: 'm', label: '孙坚' },
				{ value: 'n', label: '周瑜周公瑾' },
				{ value: 'o', label: '刘备刘玄德' },
			]
		};
	}
}
</script>

<style lang="scss" scoped>
	@import '@/common/styles/form.scss';
</style>
