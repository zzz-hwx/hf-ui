<template>
	<view class="hf-form-checkbox">
		<u-form-item :prop="prop" :required="required" :label-position="labelPosition" :border-bottom="borderBottom" @click="pickerShow">
			<template #label>
				<view class="label">
					<view class="left-content" :style="labelStyle">
						<text v-if="required" class="left-content__required">*</text>
						<template v-if="$slots.label">
							<slot name="label"></slot>
						</template>
						<template v-else>
							<view class="" :style="[parentData.labelStyle]">{{ label }}</view>
						</template>
					</view>
					<view class="input-wrap">
						<text v-show="!value" class="placeholder">{{ placeholder }}</text>
					</view>
				</view>
			</template>
			
			<view v-show="value" class="wrap">
				<template v-if="!disabled">
					<u-line></u-line>
					<u-gap height="10"></u-gap>
				</template>
				<view class="scroll-wrap">
					<scroll-view ref="input" scroll-x class="check-area">
						<view class="check-list">
							<slot name="check-list" :list="selectList">
								<view v-for="item in selectList" :key="item[keyValue]" class="check-item">{{ item[keyName] }}</view>
							</slot>
						</view>
					</scroll-view>
				</view>
			</view>
		</u-form-item>
		
		<u-popup ref="uPopup" :show="visible" :mode="mode" :close-on-click-overlay="false" @close="handleClose">
			<view class="u-popup-slot" :class="'u-popup-slot__' + mode">
				<view v-if="mode === 'bottom'" class="top">
					<view @click="handleClose">
						<text class="cancel">{{ cancelText }}</text>
					</view>
					<view class="title">{{ label }}</view>
					<view>
						<u-text :text="confirmText" type="primary" @click="handleConfirm"></u-text>
					</view>
				</view>
				<template v-else-if="mode === 'right'">
					<u-navbar :fixed="false" titleWidth="0rpx" @rightClick="handleClose">
						<template #left>{{ label }}</template>
						<template #right>
							<u-icon name="close"></u-icon>
						</template>
					</u-navbar>
					<hf-search v-if="search" v-model="searchForm.keyword" placeholder="请输入关键词"></hf-search>
				</template>
				<u-list :custom-style="mode === 'bottom' ? 'height: 50vh !important;' : 'flex: 1; height: 0 !important;'">
					<u-list-item v-for="item in renderList" :key="item.value">
						<view class="item-wrap">
							<view class="item" @click="handleClickItem(item)">
								<view
									class="slot"
									:class="{selected: item.selected, disabled: item.disabled}"
								>
									<slot name="item" :item="item.source">
										<text>{{ item.label }}</text>
									</slot>
								</view>
								<template v-if="item.selected">
									<u-icon name="checkbox-mark" :size="20" :color="item.disabled ? disabledColor : 'primary'"></u-icon>
								</template>
							</view>
							<u-line></u-line>
						</view>
					</u-list-item>
				</u-list>
				<view v-if="mode === 'right'" class="btns">
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
	import mixin from '../../libs/mixins/form.js';
	import PinyinEngine from '../../libs/pinyin-engine/cn.js';
	import loadData from '../../libs/util/loadData.js';
	export default {
		name: 'HfFormCheckbox',
		mixins: [mixin],
		props: {
			dictCode: {
				// 字典code
				type: String,
				default: ''
			},
			options: {
				// 选项
				type: Array,
				default: () => ([])
			},
			keyName: {
				// 控制显示的字段
				type: String,
				default: 'label'
			},
			keyValue: {
				// 控制取值的字段
				type: String,
				default: 'value'
			},
			keyDisabled: {
				// 控制禁用的字段
				type: String,
				default: 'disabled'
			},
			separator: {
				// 选项分隔符
				type: String,
				default: ','
			},
			labelPosition: {
				type: String,
				default: 'top'
			},
			mode: {
				// 弹出方向
				type: String,
				default: 'bottom',
				validator: (val) => {
					return ['bottom', 'right'].includes(val);
				}
			},
			search: {
				// 是否显示搜索(仅mode='right'有效)
				type: Boolean,
				default: false
			},
			pinyin: {
				// 是否拼音搜索(仅mode='right'有效)
				type: Boolean,
				default: false
			},
		},
		// #ifdef MP-WEIXIN
		options: {
			styleIsolation: 'shared'
		},
		// #endif
		data() {
			return {
				cancelText: uni.$u.props.picker.cancelText,		// 取消按钮的文字
				confirmText: uni.$u.props.picker.confirmText,	// 确认按钮的文字
				disabledColor: uni.$u.config.color['u-disabled-color'],
				list: [],
				selected: [],
				visible: false,
				searchForm: {
					keyword: ''
				},
			};
		},
		computed: {
			selectList() {
				// 选中的选项名
				const selected = (this.value || '').split(this.separator);
				return this.list.filter(item => (selected.indexOf(item[this.keyValue]) !== -1));
			},
			pinyinKeys() {
				return [this.keyName];
			},
			pinyinObj() {
				if (this.search && this.pinyin && this.list.length) {
					return new PinyinEngine(this.list, this.pinyinKeys);
				}
				return null;
			},
			renderList() {
				// 渲染显示的列表
				let renderList = [];
				if (!(this.search && this.searchForm.keyword)) {
					// 没有搜索
					renderList = this.list;
				} else if (this.pinyinObj) {
					// 拼音搜索
					renderList = this.pinyinObj.query(this.searchForm.keyword);
				} else {
					// 普通搜索
					renderList = this.list.filter((item) => {
						return this.pinyinKeys.some((key) => (item[key].indexOf(this.searchForm.keyword) !== -1));
					});
				}
				return renderList.map(item => {
					return {
						source: item,
						label: item[this.keyName],
						value: item[this.keyValue],
						disabled: !!item[this.keyDisabled],
						selected: this.selected.includes(item[this.keyValue])
					};
				});
			}
		},
		watch: {
			value: {
				handler(val) {
					if (val) {
						this.selected = val.split(this.separator);
					} else {
						this.selected = [];
					}
				},
				immediate: true
			},
			dictCode: {
				handler() {
					this.loadDictOptions();
				},
				immediate: true
			},
			options: {
				handler(val) {
					if (!this.dictCode) {
						this.list = uni.$u.deepClone(val);
					}
				},
				immediate: true
			}
		},
		methods: {
			async loadDictOptions() {
				if (this.dictCode) {
					// 获取字典数据
					this.list = await loadData.loadDictOptions(this.dictCode);
				}
			},
			pickerShow() {
				if (this.disabled) return;
				this.visible = true; 
				uni.hideKeyboard();
			},
			handleClickItem(item) {
				if (item.disabled) return;
				const value = item.value;
				const index = this.selected.indexOf(value);
				if (index === -1) {
					this.selected.push(value);
				} else {
					this.selected.splice(index, 1);
				}
			},
			handleConfirm() {
				const selected = this.selected.join(this.separator);
				this.$emit('input', selected);
				this.handleClose();
			},
			handleClose() {
				this.visible = false;
				this.selected = this.value ? this.value.split(this.separator) : [];	// 清空选择
				this.$nextTick(() => {
					if (this.$refs.input) {
						uni.$u.formValidate(this.$refs.input, 'change');
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '../../libs/css/form.scss';
	.hf-form-checkbox {
		/deep/ .u-form-item__body__right__message {
			// 表单校验的错误提示 放左侧
			margin-left: 0 !important;
		}
		.label {
			display: flex;
			justify-content: space-between;
			align-items: center;
			.left-content {
				white-space: nowrap;
			}
		}
		.wrap {
			padding-top: $sm;
			width: 100%;
			.scroll-wrap {
				display: flex;
				.check-area {
					flex: 1;
					width: 0;
				}
			}
			.check-list {
				display: flex;
				flex-direction: row;
				flex-wrap: nowrap;
				.check-item {
					padding: $xs;
					margin-right: $xs;
					background-color: $u-primary-light;
					border: 1rpx $u-primary solid;
					border-radius: 5rpx;
					color: $u-primary;
					white-space: nowrap;
				}
			}
		}
	}
	
	.u-popup-slot {
		&__bottom {
			// 
		}
		&__right {
			width: 90vw;
			height: 100vh;
			display: flex;
			flex-direction: column;
		}
		.top {
			height: 100rpx;
			padding: 0 $df;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.cancel {
				color: $u-tips-color;
			}
			.title {
				font-size: $font-lg;
				font-weight: bold;
			}
		}
		.item-wrap {
			margin: 0 $sm;
			.item {
				padding: $sm $xs;
				display: flex;
				.slot {
					flex: 1;
					width: 0;
					&.selected {
						color: $u-primary;
					}
					&.disabled {
						color: $u-disabled-color;
					}
				}
			}
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
