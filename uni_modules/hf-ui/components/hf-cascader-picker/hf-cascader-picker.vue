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
					class="item-wrap"
					:class="{'is-disabled': !!item.disabled}"
					@click="handleNodeClick(item, index)">
					<view class="item">
						<u-text :text="item.text" :type="item.selected ? 'primary' : ''"></u-text>
						<template v-if="item.selected">
							<u-icon name="checkbox-mark" :size="20" color="primary"></u-icon>
						</template>
					</view>
					<u-line></u-line>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	/**
	 * @description 嵌入页面的多列级联选择
	 * 逻辑参考<uni-data-picker>(版本: 1.1.1)
	 */
	import { treeFindPath } from '@/uni_modules/hic-plugin';
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
				default: () => ({})
			},
			selectParent: {
				type: Boolean,
				default: false
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
				return `height: ${uni.$u.addUnit(this.visibleItemCount * this.itemHeight)}; max-height: 70vh;`;
			},
			selected_() {
				return this.selected.filter(item => (item[this.textKey]));
			},
			dataList_() {
				const i = this.selectedIndex;
				if (i >= this.dataList.length) return [];
				return this.dataList[i].map(item => ({
					text: item[this.textKey],
					value: item[this.idKey],
					isleaf: item.isleaf,
					disabled: item.disabled,
					selected: item.value == this.selected_[i].value
				}));
			},
			idKey() {
				return this.defaultProps.value || 'value';
			},
			textKey() {
				return this.defaultProps.text || 'text';
			},
			childrenKey() {
				return this.defaultProps.children || 'children';
			},
			disabledKey() {
				return this.defaultProps.disabled || 'disabled';
			},
		},
		methods: {
			init() {
				this._treeData = [];
				this._extractTree(this.options, this._treeData);

				let inputValue = this.value;
				if (Array.isArray(inputValue)) {
					inputValue = inputValue[inputValue.length - 1];
					if (typeof inputValue === 'object' && inputValue[this.idKey]) {
						inputValue = inputValue[this.idKey];
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
				if (item.disabled) return;

				const i = this.selectedIndex;
				const node = this.dataList[i][j];
				const text = node[this.textKey];
				const value = node[this.idKey];

				if (this.selected[i][this.idKey] === value) {
					// 点击 已选中的 反选 => 清除选中
					this.selected.splice(i, this.selected.length - i);
				} else if (i < this.selected.length - 1) {
					this.selected.splice(i, this.selected.length - i);
					this.selected.push({
						[this.textKey]: text,
						[this.idKey]: value
					});
				} else if (i === this.selected.length - 1) {
					this.selected.splice(i, 1, {
						[this.textKey]: text,
						[this.idKey]: value
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
				const isEmpty = this.selected.length && this.selected[0].value === null;	// 是否没选择为空
				if (this.selectParent || isleaf || isEmpty) {
					// 任意一级可选择 || 叶子节点 || 没有选择
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
				const value = this.selected[this.selectedIndex][this.idKey];
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
				// if 任意一级可选择 过滤掉最后一级[请选择]
				const path = this.selected.filter((item) => (item[this.idKey] !== null));
				let value = '';
				if (path.length) {
					// 第1级反选 重复点击取消选择 path为空数组
					value = path[path.length - 1][this.idKey];
				}
				this.$emit('change', path);
				this.$emit('input', value);
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
						[this.idKey]: null,
						[this.textKey]: "请选择"
					})
					this.scrollToTop();
				}

				return {
					isleaf,
					hasNodes
				}
			},
			_extractTree(nodes, result, parent_value) {
				let list = result || [];
				const valueField = this.idKey;
				for (let i = 0; i < nodes.length; i++) {
					let node = nodes[i];

					let child = {};
					for (let key in node) {
						if (key !== 'children') {
							child[key] = node[key];
						}
					}
					if (parent_value !== null && parent_value !== undefined && parent_value !== '') {
						child.parent_value = parent_value;
					}
					result.push(child);

					let children = node.children;
					if (children) {
						this._extractTree(children, result, node[valueField]);
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
					let value = paths[i][this.idKey];
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
				.item-wrap {
					margin: 0 $sm;
				}
				.item {
					padding: $sm $xs;
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					&.is-disabled {
						opacity: .5;
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
