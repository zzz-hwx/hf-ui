<template>
	<view class="hf-cascader-picker">
		<scroll-view scroll-x class="selected-area" :scroll-into-view="selectedScrollIntoView" scroll-with-animation>
			<view class="selected-list">
				<view
					v-for="(item, index) in selected_" :key="item.value"
					:id="'_' + index"
					class="selected-item"
					:class="{'selected-item-active': index == selectedIndex}"
					@click="handleSelect(index)">
					<text>{{ item.text }}</text>
				</view>
			</view>
		</scroll-view>
		<view class="tab-c">
			<scroll-view scroll-y class="list" :style="pickerViewStyle" :scroll-top="scrollTop" :scroll-into-view="scrollIntoView">
				<view
					v-for="(item, index) in dataList_" :key="item.value"
					:id="'_' + item.value"
					class="item"
					:class="{'is-disabled': !!item.disabled}" 
					@click="handleNodeClick(item, index)">
					<text class="item-text">{{ item.text }}</text>
					<view class="check" v-if="item.value == selected_[selectedIndex].value"></view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	/**
	 * @description 嵌入页面的多列级联选择
	 * 逻辑从<uni-data-picker>拷贝粘贴(版本: 1.1.1)
	 */
	import { treeFindPath } from '../../libs/util/utils.js';
	export default {
		name: 'HfCascaderPicker',
		props: {
			value: {
				type: String,
				default: ''
			},
			options: {
				type: Array,
				default: () => ([])
			},
			visibleItemCount: { // 每列中可见选项数量
				type: Number,
				default: 5
			},
			itemHeight: { // 单个选项高度
				type: Number,
				default: 44
			},
			defaultProps: {
				type: Object,
				default: () => ({
					text: 'text',
					value: 'value'
				})
			}
		},
		data() {
			return {
				selected: [],
				selectedIndex: 0,
				dataList: [],
				selectedScrollIntoView: '',
				scrollTop: 0,
				scrollIntoView: ''
			}
		},
		watch: {
			propsChange: {
				handler(val) {
					this.init();
				},
				immediate: true
			}
		},
		computed: {
			propsChange() {
				// 如果以下这些变量发生了变化，意味着需要重新初始化
				return [this.value, this.options];
			},
			pickerViewStyle() {
				return `height: ${uni.$u.addUnit(this.visibleItemCount * this.itemHeight)}`;
			},
			selected_() {
				return this.selected.filter(item => (item.text));
			},
			dataList_() {
				const i = this.selectedIndex;
				if (i >= this.dataList.length) return [];
				const {
					text,
					value
				} = this.defaultProps;
				return this.dataList[i].map(item => ({
					text: item[text],
					value: item[value],
					isleaf: item.isleaf,
					disabled: item.disabled
				}));
			}
		},
		methods: {
			init() {
				this._treeData = [];
				this._extractTree(this.options, this._treeData);

				let inputValue = this.value;
				if (Array.isArray(inputValue)) {
					inputValue = inputValue[inputValue.length - 1];
					if (typeof inputValue === 'object' && inputValue[this.defaultProps.value]) {
						inputValue = inputValue[this.defaultProps.value];
					}
				}

				this.selected = treeFindPath(inputValue, this.options, this.defaultProps);
				this._updateBindData();
			},
			handleSelect(index) {
				this.selectedIndex = index;
				this.scrollToTop();
			},
			handleNodeClick(item, j) {
				const i = this.selectedIndex;
				if (item.disabled) return;

				const node = this.dataList[i][j];
				const text = node[this.defaultProps.text];
				const value = node[this.defaultProps.value];

				if (i < this.selected.length - 1) {
					this.selected.splice(i, this.selected.length - i);
					this.selected.push({
						text,
						value
					});
				} else if (i === this.selected.length - 1) {
					this.selected.splice(i, 1, {
						text,
						value
					});
				}

				if (node.isleaf) {
					this.onSelectedChange(node, node.isleaf);
					return
				}

				const {
					isleaf,
					hasNodes
				} = this._updateBindData();
				this.onSelectedChange(node, (!hasNodes || isleaf));
			},
			onSelectedChange(node, isleaf) {
				if (isleaf) {
					this._dispatchEvent();
				}
				if (node) {
					this.$emit('nodeclick', node);
				}
			},
			async scrollToTop() {
				if (!this.selected.length) return;
				// selected 横向滚动
				this.selectedScrollIntoView = '';
				await this.nextTick();
				this.selectedScrollIntoView = '_' + this.selectedIndex;
				// list 纵向滚动
				const value = this.selected[this.selectedIndex].value;
				if (value === null) {
					// 滚动到顶部
					this.scrollTop = -Infinity;
					await this.nextTick();
					this.scrollTop = 0;
				} else {
					// 滚动到指定元素
					this.scrollIntoView = '';
					await this.nextTick();
					this.scrollIntoView = '_' + value;
				}
			},
			_dispatchEvent() {
				this.$emit('change', this.selected.slice(0));
				this.$emit('input', this.selected[this.selected.length - 1].value);
			},
			_updateBindData(node) {
				const {
					dataList,
					hasNodes
				} = this._filterData(this._treeData, this.selected)

				let isleaf = this._stepSearh === false && !hasNodes

				if (node) {
					node.isleaf = isleaf
				}

				this.dataList = dataList
				this.selectedIndex = dataList.length - 1

				if (!isleaf && this.selected.length < dataList.length) {
					this.selected.push({
						value: null,
						text: "请选择"
					})
					this.scrollToTop();
				}

				return {
					isleaf,
					hasNodes
				}
			},
			_extractTree(nodes, result, parent_value) {
				let list = result || []
				const valueField = this.defaultProps.value
				for (let i = 0; i < nodes.length; i++) {
					let node = nodes[i]

					let child = {}
					for (let key in node) {
						if (key !== 'children') {
							child[key] = node[key]
						}
					}
					if (parent_value !== null && parent_value !== undefined && parent_value !== '') {
						child.parent_value = parent_value
					}
					result.push(child)

					let children = node.children
					if (children) {
						this._extractTree(children, result, node[valueField])
					}
				}
			},
			_filterData(data, paths) {
				let dataList = []
				let hasNodes = true

				dataList.push(data.filter((item) => {
					return (item.parent_value === null || item.parent_value === undefined || item
						.parent_value === '')
				}))
				for (let i = 0; i < paths.length; i++) {
					let value = paths[i].value
					let nodes = data.filter((item) => {
						return item.parent_value === value
					})

					if (nodes.length) {
						dataList.push(nodes)
					} else {
						hasNodes = false
					}
				}

				return {
					dataList,
					hasNodes
				}
			},
			nextTick() {
				return new Promise((resolve) => {
					this.$nextTick(resolve);
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	$border-color: #EEEEEE;
	.hf-cascader-picker {
		background-color: $bg-white;
		.selected-area {
			width: 100vw;
			border-bottom: 1px solid $border-color;
			.selected-list {
				display: flex;
				flex-wrap: nowrap;
				flex-direction: row;
				padding: 0 $xs;
				.selected-item {
					padding: $sm;
					text-align: center;
					white-space: nowrap;
					&.selected-item-active {
						border-bottom: 2px solid $u-primary;
						text {
							color: $u-primary;
						}
					}
				}
			}
		}
		.tab-c {
			position: relative;
			overflow: hidden;
			.list {
				.item {
					padding: $sm $lg;
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					&.is-disabled {
						opacity: .5;
					}
					.item-text {
						color: $u-main-color;
					}
					.check {
						margin-right: $xs;
						border: 2px solid $u-primary;
						border-left: 0;
						border-top: 0;
						height: 12px;
						width: 6px;
						transform-origin: center;
						transition: all 0.3s;
						transform: rotate(45deg);
					}
				}
			}
		}
	}
</style>
