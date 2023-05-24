<template>
	<view class="hf-form-select">
		<template v-if="$scopedSlots['display-section']">
			<view class="" @click="pickerShow">
				<slot name="display-section" :valueName="valueName" :visible="visible"></slot>
			</view>
		</template>
		<template v-else>
			<u-form-item :prop="prop" :required="required" :label-position="labelPosition" :border-bottom="borderBottom" @click="pickerShow">
				<template #label>
					<view class="left-content">
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
				keyName="label"
				immediateChange
				@confirm="pickerConfirm"
				@cancel="handleClose"
				@close="handleClose"></u-picker>
		</template>
		<template v-else-if="mode === 'right'">
			<u-popup :show="visible" mode="right" @close="handleClose">
				<view class="u-popup-slot">
					<u-navbar :fixed="false" titleWidth="0rpx" @rightClick="handleClose">
						<template #left>{{ label }}</template>
						<template #right>
							<u-icon name="close"></u-icon>
						</template>
					</u-navbar>
					<hf-search v-if="search" v-model="searchForm.keyword" placeholder="请输入关键词"></hf-search>
					<u-list custom-style="flex: 1; height: 0 !important;">
						<u-list-item v-for="item in renderList" :key="item[keyValue]">
							<view class="item" @click="handleClickItem(item)">
								<view class="slot">
									<slot name="item" :item="item">
										<view class="text">{{ item[keyName] }}</view>
									</slot>
								</view>
								<template v-if="item.selected">
									<u-icon name="checkbox-mark" :size="20"></u-icon>
								</template>
							</view>
							<u-line></u-line>
						</u-list-item>
					</u-list>
					<view v-if="multiple" class="btns">
						<u-button @click="handleClose">取消</u-button>
						<u-button type="primary" @click="handleConfirm">确定</u-button>
					</view>
				</view>
			</u-popup>
		</template>
	</view>
</template>

<script>
	import mixin from '../../libs/mixins/form.js';
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
				visible: false,
				searchForm: {
					keyword: ''
				},
				list: [],
				selected: [],	// 右侧弹框 选中的项
				parentData: {
					// 提示文本的样式
					labelStyle: {},
				}
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
					return item.label;
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
			renderList() {
				// 渲染显示的列表
				let renderList = [];
				if (!this.search || !this.searchForm.keyword) {
					renderList = this.list_;
				} else {
					renderList = this.list_.filter((item) => (item[this.keyName].indexOf(this.searchForm.keyword) !== -1));
				}
				return renderList.map((item) => ({
					...item,
					selected: this.selected.indexOf(item[this.keyValue]) !== -1
				}));
			}
		},
		mounted() {
			this.updateParentData();
		},
		methods: {
			updateParentData() {
				// 获取父组件的参数
				// 此方法写在uview的全局mixin中
				this.getParentData('u-form');
			},
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
					this.$emit('input', event.value[0].value);
					this.$emit('confirm', event.value[0]);
				}
				this.handleClose();
			},
			handleClickItem(item) {
				// 右侧弹框 点击选项
				const value = item[this.keyValue];
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
			.item {
				padding: $sm $lg;
				display: flex;
				.slot {
					flex: 1;
					width: 0;
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
</style>
