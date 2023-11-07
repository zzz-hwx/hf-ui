<template>
	<view class="page">
		<view class="title">基本用法</view>
		<hf-dropdown>
			<hf-dropdown-item v-model="model1.value1" title="距离" :options="options1"></hf-dropdown-item>
			<hf-dropdown-item v-model="model1.value2" title="温度" :options="options2"></hf-dropdown-item>
		</hf-dropdown>
		
		<view class="title">自定义内容</view>
		<hf-dropdown ref="uDropdown2">
			<hf-dropdown-item v-model="model2.value1" title="属性" :options="options2">
				<view class="slot-content" style="background-color: #FFFFFF;">
					<scroll-view scroll-y style="height: 400rpx;">
						<u-cell-group>
							<u-cell
								v-for="(item, index) in options2"
								:key="index"
								:arrow="false"
								:title="item.label"
								:title-style="{color: model2.value1 == item.value ? activeColor : inactiveColor}"
								@click="model2.value1 = item.value"
							>
								<template #right-icon>
									<u-icon
										v-if="model2.value1 == item.value"
										name="checkbox-mark"
										:color="activeColor"
										size="20"
									></u-icon>
								</template>
							</u-cell>
						</u-cell-group>
					</scroll-view>
					<view class="btns">
						<u-button type="primary" @click="closeDropdown">确定</u-button>
					</view>
				</view>
			</hf-dropdown-item>
			<hf-dropdown-item v-model="model2.value2" title="筛选条件筛选条件筛选条件" :options="options1"></hf-dropdown-item>
		</hf-dropdown>
		
		<view class="title">圆角</view>
		<hf-dropdown border-radius="20px" no-show-options-name>
			<hf-dropdown-item v-model="model1.value1" title="距离" :options="options1"></hf-dropdown-item>
			<hf-dropdown-item v-model="model1.value2" title="温度" :options="options2"></hf-dropdown-item>
		</hf-dropdown>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				activeColor: uni.$u.config.color['u-primary'],
				inactiveColor: uni.$u.config.color['u-content-color'],
				model1: {
					value1: '',
					value2: ''
				},
				model2: {
					value1: '',
					value2: ''
				},
				options1: [
					{ label: '选项1', value: '1' },
					{ label: '选项2', value: '2' },
					{ label: '选项3', value: '3' },
				],
				options2: [
					{ label: '选项1', value: '1' },
					{ label: '选项2', value: '2' },
					{ label: '选项3', value: '3' },
					{ label: '选项4', value: '4' },
					{ label: '选项5', value: '5' },
				]
			};
		},
		methods: {
			closeDropdown() {
				this.$refs.uDropdown2.close();
			}
		}
	}
</script>

<style lang="scss" scoped>
@import '@/common/styles/form.scss';
.page {
	background-color: $bg-white;
	
}
</style>
