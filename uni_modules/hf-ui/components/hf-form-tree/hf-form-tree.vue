<template>
	<view class="hf-form-tree">
		<u-form-item :label="label" :prop="prop" :required="required" :label-position="labelPosition" :label-width="labelWidth" :borderBottom="borderBottom" @click="popupShow">
			<hf-form-content ref="input" :value="valueName" :placeholder="placeholder"></hf-form-content>
			<template #right>
				<slot name="right"></slot>
			</template>
		</u-form-item>
		
		<u-popup ref="uPopup" :show="visible" mode="right" :close-on-click-overlay="false" @close="handleClose">
			<view class="u-popup-slot">
				<u-navbar :fixed="false" titleWidth="0rpx" @rightClick="handleClose">
					<template #left>{{ label }}</template>
					<template #right>
						<u-icon name="close"></u-icon>
					</template>
				</u-navbar>
				<hf-search v-if="search" v-model="searchForm.keyword" placeholder="请输入关键词"></hf-search>
				<scroll-view scroll-y>
					<hf-tree
						ref="hfTree"
						:value="innerValue"
						:options="options"
						:multiple="multiple"
						:default-props="defaultProps"
						:filterable="search"
						:filter-text="searchForm.keyword"
						:pinyin="pinyin"
						:select-parent="selectParent"
						:select-strictly="selectStrictly"
						:last-icon="lastIcon"
						:last-icon-color="lastIconColor"
					></hf-tree>
				</scroll-view>
				<view class="btns">
					<u-button @click="handleClose">{{ cancelText }}</u-button>
					<u-button type="primary" @click="handleConfirm">确定</u-button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<!-- #ifdef APP-VUE || H5 -->
<script module="test" lang="renderjs">
	export default {
		mounted() {
			(document.querySelector('uni-page-wrapper') || document.body).appendChild(this.$refs.uPopup.$el);
		},
	}
</script>
<!-- #endif -->

<script>
	/**
	 * @description 树形组件 + 右侧弹框 + 搜索
	 */
	import mixin from '../../libs/mixins/form.js';
	import { treeFindPath } from '@/uni_modules/hic-plugin';
	export default {
		name: 'HfFormTree',
		mixins: [mixin],
		props: {
			options: {
				type: Array,
				default: () => ([])
			},
			multiple: {
				type: Boolean,
				default: false
			},
			defaultProps: {
				type: Object,
				default: () => ({})
			},
			search: {
				// 是否显示搜索
				type: Boolean,
				default: false
			},
			pinyin: {
				type: Boolean,
				default: false
			},
			showAllLevels: {
				// 是否显示选中值的完整路径
				type: Boolean,
				default: false
			},
			selectParent: {
				type: Boolean,
				default: false
			},
			selectStrictly: {
				type: Boolean,
				default: false
			},
			separator: {
				// 多选选项值分隔符
				type: String,
				default: ','
			},
			textSeparator: {
				// 选项名分隔符
				type: String,
				default: '/'
			},
			lastIcon: {
				type: String,
				default: ''
			},
			lastIconColor: {
				type: String
			}
		},
		// #ifdef MP-WEIXIN
		options: {
			styleIsolation: 'shared'
		},
		// #endif
		data() {
			return {
				cancelText: uni.$u.props.picker.cancelText,		// 取消按钮的文字
				// confirmText: uni.$u.props.picker.confirmText,	// 确认按钮的文字
				visible: false,
				searchForm: {
					keyword: ''
				}
			}
		},
		computed: {
			innerValue() {
				const value = this.value;
				if (this.multiple) {
					if (value) return value.split(this.separator).filter(Boolean);
					return [];
				} else {
					return value;
				}
			},
			valueName() {
				// 选中的选项名
				let path = [];
				if (this.multiple) {
					if (this.innerValue.length === 0) return '';
					path = this.innerValue.map(item => {
						return treeFindPath(item, this.options, this.defaultProps);
					});
				} else {
					if (typeof(this.innerValue) === 'undefined' || this.innerValue === '') return '';
					path = [ treeFindPath(this.innerValue, this.options, this.defaultProps) ];
				}
				path = path.filter(item => (item.length));
				if (!path.length) return '';
				return path.map(path => {
					if (this.showAllLevels) {
						return path.map(item => (item[this.textKey])).join(this.textSeparator);
					} else {
						return path[path.length - 1][this.textKey];
					}
				}).join(this.separator);
			},
			idKey() {
				return this.defaultProps.value || 'value';
			},
			textKey() {
				return this.defaultProps.text || 'text';
			},
		},
		methods: {
			popupShow() {
				if (this.disabled) return;
				this.visible = true; 
				uni.hideKeyboard();
			},
			handleConfirm() {
				const result = this.$refs.hfTree.confirm();
				const path = result.map(item => {
					return treeFindPath(item[this.idKey], this.options, this.defaultProps);
				});
				const value = result.map(item => (item[this.idKey])).join(this.separator);
				// console.log('--- hf-form-tree --->', value, path);
				this.$emit('input', value, path);	// 选中的最后一级key, 路径
				this.handleClose();
			},
			handleClose() {
				this.visible = false;
				this.$nextTick(() => {
					uni.$u.formValidate(this.$refs.input, 'change');
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	// .hf-form-tree {}
	.u-popup-slot {
		width: 90vw;
		height: 100vh;
		background-color: $bg-white;
		display: flex;
		flex-direction: column;
		scroll-view {
			flex: 1;
			height: 0;
		}
		.btns {
			padding: $df;
			display: flex;
			/deep/ .u-button + .u-button {
				margin-left: $df;
			}
		}
	}
</style>
