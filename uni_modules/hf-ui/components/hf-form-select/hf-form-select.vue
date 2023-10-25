<template>
	<view class="hf-form-select">
		<!-- #ifdef MP-WEIXIN -->
		<template v-if="$slots['display-section']">
			<view class="flex" @click="pickerShow">
				<slot name="display-section" :valueName="valueName" :visible="visible"></slot>
			</view>
		</template>
		<!-- #endif -->
		<!-- #ifndef MP-WEIXIN -->
		<template v-if="$scopedSlots['display-section']">
			<view class="flex" @click="pickerShow">
				<slot name="display-section" :valueName="valueName" :visible="visible"></slot>
			</view>
		</template>
		<!-- #endif -->
		
		<template v-else>
			<u-form-item :prop="prop" :required="required" :label-position="labelPosition" :border-bottom="borderBottom" @click="pickerShow">
				<template #label>
					<view class="left-content" :style="labelStyle">
						<text v-if="required" class="left-content__required">*</text>
						<template v-if="$slots.label">
							<slot name="label"></slot>
						</template>
						<template v-else>
							<view class="" :style="[parentData.labelStyle]">{{ label }}</view>
						</template>
					</view>
				</template>
				<hf-form-content ref="input" :value="valueName" :placeholder="placeholder"></hf-form-content>
				<template #right>
					<slot name="right"></slot>
				</template>
			</u-form-item>
		</template>
		<template v-if="mode === 'bottom'">
			<u-picker
				:show="visible"
				:title="label"
				:columns="columns"
				:defaultIndex="defaultIndex"
				:keyName="keyName"
				immediateChange
				@confirm="pickerConfirm"
				@cancel="handleClose"
				@close="handleClose"
			></u-picker>
		</template>
		<template v-else-if="mode === 'right'">
			<u-popup :show="visible" mode="right" :close-on-click-overlay="!multiple" @close="handleClose">
				<view class="u-popup-slot">
					<u-navbar :fixed="false" titleWidth="0rpx" @rightClick="handleClose">
						<template #left>{{ label }}</template>
						<template #right>
							<u-icon name="close"></u-icon>
						</template>
					</u-navbar>
					<hf-search v-if="search" v-model="searchForm.keyword" placeholder="请输入关键词"></hf-search>
					<u-list custom-style="flex: 1; height: 0 !important;">
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
					<view v-if="multiple" class="btns">
						<u-button @click="handleClose">{{ cancelText }}</u-button>
						<u-button type="primary" @click="handleConfirm">确定</u-button>
					</view>
				</view>
			</u-popup>
		</template>
	</view>
</template>

<script>
	import mixin from '../../libs/mixins/form.js';
	import PinyinEngine from '../../libs/pinyin-engine/cn.js';
	import loadData from '../../libs/util/loadData.js';
	export default {
		name: 'HfFormSelect',
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
			showAll: {
				// 是否添加选项: "全部"
				type: Boolean,
				default: false
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
			multiple: {
				// 是否多选(仅mode='right'有效)
				type: Boolean,
				default: false
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
				disabledColor: uni.$u.config.color['u-disabled-color'],
				visible: false,
				searchForm: {
					keyword: ''
				},
				list: [],
				selected: [],	// 右侧弹框 选中的项
			}
		},
		computed: {
			list_() {
				if (this.showAll) {
					return [
						{
							[this.keyName]: '全部',
							[this.keyValue]: ''
						},
						...this.list
					]
				}
				return this.list;
			},
			columns() {
				return [this.list_];
			},
			valueName() {
				// 选中的选项名
				if (this.mode === 'bottom') {
					// u-picker
					const item = this.list_.find(item => (item[this.keyValue] == this.value));
					if (!item) return '';
					return item[this.keyName];
				} else {
					// 右侧弹框
					const selected = (this.value || '').split(this.separator);
					return this.list_.filter(item => (selected.indexOf(item[this.keyValue]) !== -1)).map(item => (item[this.keyName])).join(this.separator);
				}
			},
			defaultIndex() {
				// 各列的默认索引
				let index = this.list_.findIndex((item) => (item[this.keyValue] == this.value));
				if (index === -1) index = 0;
				return [index];
			},
			pinyinKeys() {
				return [this.keyName];
			},
			pinyinObj() {
				if (this.search && this.pinyin && this.list_.length) {
					return new PinyinEngine(this.list_, this.pinyinKeys);
				}
				return null;
			},
			renderList() {
				// 渲染显示的列表
				let renderList = [];
				if (!this.search || !this.searchForm.keyword) {
					// 没有搜索
					renderList = this.list_;
				} else if (this.pinyinObj) {
					// 拼音搜索
					renderList = this.pinyinObj.query(this.searchForm.keyword);
				} else {
					// 普通搜索
					renderList = this.list_.filter((item) => {
						return this.pinyinKeys.some((key) => (item[key].indexOf(this.searchForm.keyword) !== -1));
					});
				}
				return renderList.map((item) => ({
					source: item,
					label: item[this.keyName],
					value: item[this.keyValue],
					disabled: !!item[this.keyDisabled],
					selected: this.selected.includes(item[this.keyValue]),
				}));
			}
		},
		watch: {
			dictCode: {
				handler() {
					this.loadDictOptions();
				},
				immediate: true
			},
			value: {
				handler(val) {
					if (this.mode !== 'right') return;
					// 右侧弹框 处理value
					if (val) {
						this.selected = val.split(this.separator);
					} else {
						this.selected = [];
					}
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
			pickerConfirm(event) {
				// u-picker 确定
				if (event.value.length) {
					this.$emit('input', event.value[0][this.keyValue]);
					this.$emit('confirm', event.value[0]);
				}
				this.handleClose();
			},
			handleClickItem(item) {
				if (item.disabled) return;
				// 右侧弹框 点击选项
				const value = item.value;
				if (this.multiple) {
					// 多选
					const index = this.selected.indexOf(value);
					if (index === -1) {
						this.selected.push(value);
					} else {
						this.selected.splice(index, 1);
					}
				} else {
					// 单选
					this.selected = [value];
					// 选中即确定
					this.handleConfirm();
				}
			},
			handleConfirm() {
				// 右侧弹框 确定
				const selected = this.selected.join(this.separator);
				const selectedList = this.list_.filter(item => (this.selected.indexOf(item[this.keyValue]) !== -1));
				if (this.multiple) {
					// 多选
					this.$emit('input', selected);
					this.$emit('confirm', selectedList);
				} else {
					// 单选 (代码手动调用, 一定选择了一项)
					this.$emit('input', selected);
					this.$emit('confirm', selectedList[0]);
				}
				this.handleClose();
			},
			handleClose() {
				this.visible = false;
				if (this.$refs.input) {
					this.$nextTick(() => {
						uni.$u.formValidate(this.$refs.input, 'change');
					});
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '../../libs/css/form.scss';
	.hf-form-select {
		.u-popup-slot {
			width: 90vw;
			height: 100vh;
			background-color: $bg-white;
			display: flex;
			flex-direction: column;
			.item-wrap {
				margin: 0 $sm;
			}
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
			.btns {
				padding: $df;
				display: flex;
				/deep/ .u-button + .u-button {
					margin-left: $df;
				}
			}
		}
	}
	.flex {
		display: flex;
	}
</style>
