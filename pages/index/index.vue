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
							title: 'uni push 推送',
							path: '/pages/componentsA/push',
							icon: 'button'
						}, {
							title: 'map 地图',
							path: '/pages/componentsA/map',
							icon: 'navbar'
						}, {
							title: 'amap 高德地图',
							path: '/pages/componentsA/amap',
							icon: 'navbar'
						}, {
							title: '测试',
							path: '/pages/componentsA/test',
							icon: 'color'
						}, {
							title: 'bug1 两层弹框',
							path: '/pages/componentsA/bug1',
							icon: 'popup'
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
							title: 'select 列表选择器',
							path: '/pages/componentsB/select',
							icon: 'list'
						}, {
							title: 'multi-column 多列选择器',
							path: '/pages/componentsB/multiColumn',
							icon: 'subsection'
						}, {
							title: 'area 省市县',
							path: '/pages/componentsB/area',
							icon: 'picker'
						}, {
							title: 'cascader 级联选择',
							path: '/pages/componentsB/cascader',
							icon: 'subsection'
						}, {
							title: 'tree 树形组件',
							path: '/pages/componentsB/tree',
							icon: 'list'
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
						}, {
							title: 'hf-list-only 列表页',
							path: '/pages/componentsC/listOnly',
							icon: 'text'
						}, {
							title: 'hf-preview 附件预览',
							path: '/pages/componentsC/preview',
							icon: 'album'
						}, {
							title: 'hf-dropdown 下拉菜单',
							path: '/pages/componentsC/dropdown',
							icon: 'dropdown'
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
