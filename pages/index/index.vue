<template>
	<view class="">
		<view class="list-wrap">
			<u-cell-group v-for="(group, groupIndex) in renderList" :key="groupIndex" :title="group.groupName">
				<u-cell
					v-for="(item, index) in group.list" :key="index"
					:title="item.title"
					:name="item.path"
					is-link
					@click="openPage">
					<image slot="icon" class="u-cell-icon" :src="item.icon" mode="widthFix"></image>
				</u-cell>
			</u-cell-group>
		</view>
		<u-gap></u-gap>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [{
						groupName: '页面',
						list: [{
							title: 'form 表单',
							path: '/pages/componentsA/form',
							icon: 'form'
						}, {
							title: '测试',
							path: '/pages/componentsA/test',
							icon: 'color'
						}]
					}, {
						groupName: '表单组件',
						list: [{
							title: 'datetime 时间日期选择器',
							path: '/pages/componentsB/datetime',
							icon: 'datetimePicker'
						}, {
							title: 'radio 单选框',
							path: '/pages/componentsB/radio',
							icon: 'radio'
						}, {
							title: 'checkbox 复选框',
							path: '/pages/componentsB/checkbox',
							icon: 'checkbox'
						}, {
							title: 'upload 上传',
							path: '/pages/componentsB/upload',
							icon: 'upload'
						}]
					}, {
						groupName: '显示组件',
						list: [{
							title: 'hf-search 搜索',
							path: '',
							icon: 'search'
						}, {
							title: 'hf-list 列表页',
							path: '/pages/componentsC/list',
							icon: 'list'
						}]
					}
				]
			}
		},
		computed: {
			renderList() {
				return this.list.map((group) => {
					return {
						...group,
						list: group.list.map(item => {
							return {
								...item,
								icon: `https://cdn.uviewui.com/uview/example/${item.icon}.png`
							}
						})
					}
				})
			}
		},
		methods: {
			openPage({ name: path }) {
				if (!path) {
					uni.$u.toast('点击~~');
					return;
				}
				uni.$u.route({
					url: path
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.list-wrap {
		/deep/ .u-cell-group__wrapper {
			background-color: $bg-white;
		}
		.u-cell-icon {
			width: 36rpx;
			height: 36rpx;
			margin-right: 8rpx;
		}
		/deep/ .u-cell-group__title__text {
			font-weight: bold;
		}
	}
</style>
