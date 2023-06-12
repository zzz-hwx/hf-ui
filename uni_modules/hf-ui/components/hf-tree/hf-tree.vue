<template>
	<view class="hf-tree">
		<block v-for="item in filterList" :key="item.id">
			<view
				class="hf-tree-item"
				:style="[{
						paddingLeft: item.rank * 15 + 'px',
						zIndex: item.rank * -1 + 50
					}]" 
				:class="{
						border: border === true,
						show: item.show,
						last: item.lastRank,
						showchild: item.showChild,
						open: item.open,
					}"
				>
				<view class="hf-tree-label" @click.stop="_treeItemTap(item)">
					<view class="hf-tree-label__icon">
						<template v-if="item.lastRank">
							<hf-icon v-if="lastIcon" :name="lastIcon" :color="lastIconColor"></hf-icon>
						</template>
						<template v-else>
							<hf-icon :name="item.showChild ? 'arrow-down-fill' : 'arrow-right-fill'" :size="10"></hf-icon>
						</template>
					</view>
					<view class="hf-tree-label__content">
						<slot :node="item" :data="item.source">
							<text>{{ item.name }}</text>
						</slot>
					</view>
				</view>
				<view
					class="hf-tree-check"
					v-if="!disabled && !noShowCheckbox && (selectParent || item.lastRank) && !item.disabled"
					@click.stop="_treeItemSelect(item)"
				>
					<view
						v-if="item.checked"
						class="hf-tree-check-yes"
						:class="{'radio': !multiple}"
						:style="{
							'border-color': confirmColor,
							'background-color': confirmColor
						}"
					>
						<u-icon name="checkmark" color="#fff"></u-icon>
					</view>
					<view
						v-else-if="item.indeterminate"
						class="hf-tree-check-yes"
						:class="{'radio': !multiple}"
						:style="{
							'border-color': confirmColor,
							'background-color': confirmColor
						}"
					>
						<u-icon name="minus" size="5" bold color="#fff"></u-icon>
					</view>
					<view
						v-else class="hf-tree-check-no"
						:class="{'radio': !multiple}"
					></view>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
	/**
	 * @description 树形组件
	 * 用清晰的层级结构展示信息，可展开或折叠。
	 */
	import PinyinEngine from '../../libs/pinyin-engine/cn.js';
	export default {
		props: {
			value: {
				type: [Array, String, Number],
				default: () => []
			},
			options: {
				type: Array,
				default: () => ([])
			},
			defaultProps: {
				type: Object,
				default: () => ({
					text: 'text',
					value: 'value',
					children: 'children'
				})
			},
			multiple: {
				type: Boolean,
				default: false
			},
			selectParent: {
				type: Boolean,
				default: false
			},
			selectStrictly: {
				// 在多选的情况下 是否严格遵循父子不互相关联的做法
				type: Boolean,
				default: false
			},
			foldAll: {
				type: Boolean,
				default: false
			},
			border: {
				type: Boolean,
				default: false
			},
			expandLevel1: {
				type: Boolean,
				default: false
			},
			noShowCheckbox: {
				type: Boolean,
				default: false
			},
			disabled: {
				type: Boolean,
				default: false
			},
			filterable: {
				type: Boolean,
				default: false
			},
			filterText: {
				type: String,
				default: ''
			},
			filterKeys: {
				type: Array
			},
			pinyin: {
				type: Boolean,
				default: false
			},
			confirmColor: {
				type: String,
				default: uni.$u.config.color['u-primary']
			},
			lastIcon: {
				type: String,
				default: ''
			},
			lastIconColor: {
				type: String
			}
		},
		data() {
			return {
				treeList: [],
			}
		},
		computed: {
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
			propsChange() {
				return [this.multiple, this.selectParent];
			},
			pinyinKeys() {
				if (this.filterKeys && Array.isArray(this.filterKeys) && this.filterKeys.length) {
					return this.filterKeys;
				}
				return [this.textKey];
			},
			flatOptions() {
				// 拍扁的options --> 一维数组
				const list = [];
				if (Array.isArray(this.options) && this.options.length) {
					const queue = this.options.slice();
					while (queue.length) {
						const item = queue.shift();
						list.push(item);
						if (Array.isArray(item.children) && item.children.length) {
							queue.unshift(...item.children);
						}
					}
				}
				return list;
			},
			pinyinObj() {
				if (this.filterable && this.pinyin && this.flatOptions.length) {
					return new PinyinEngine(this.flatOptions, this.pinyinKeys);
				}
				return null;
			},
			filterList() {
				if (!this.filterable || !this.filterText || !this.flatOptions.length) return this.treeList;
				let list = [];
				if (this.pinyinObj) {
					// 拼音搜索
					list = this.pinyinObj.query(this.filterText);
				} else {
					// 普通搜索
					list = this.flatOptions.filter(item => {
						return this.pinyinKeys.some((key) => (item[key].indexOf(this.filterText) !== -1));
					});
				}
				const ids = list.map(item => (item[this.idKey])); // 搜索结果的id
				const parentIds = this.treeList.filter(item => {
					return ids.indexOf(item.id) != -1;
				}).map(item => (item.parentId)).flat(Infinity); // 有子集的父级
				const idSet = new Set(ids.concat(parentIds));

				const filterList = this.treeList.filter(item => {
					return idSet.has(item.id);
				});
				// console.log('--- filterList --->', list, filterList);
				return filterList;
			}
		},
		watch: {
			value: {
				handler() {
					this.changeValue();
				},
				immediate: true
			},
			options: {
				handler(list) {
					this._initTree(list);
					this.changeValue();
				},
				immediate: true
			},
			propsChange() {
				if (Array.isArray(this.options) && this.options.length) {
					this._reTreeList();
				}
			},
		},
		methods: {
			confirm() {
				// 处理所选数据 父组件调用
				if (this.multiple) {
					const result = this.treeList.filter(item => {
						if (this.selectParent && this.selectStrictly) {
							// 可选父节点 && 父子不互相关联
							return item.checked;
						}
						// 选中的叶子节点
						return item.checked && !(item.source[this.childrenKey] && item.source[this.childrenKey].length);
					}).map(item => {
						return {
							...item.source
						};
					});
					return result;
				} else {
					// 单选
					const result = this.treeList.filter(item => (item.checked)).map(item => {
						return {
							...item.source
						};
					});
					return result;
				}
			},
			_renderTreeList(list = [], rank = 0, parentId = [], parents = []) {
				// 扁平化树结构
				list.forEach(item => {
					this.treeList.push({
						id: item[this.idKey],
						name: item[this.textKey],
						disabled: item[this.disabledKey],
						source: item,
						parentId,	// 父级id数组
						parents,	// 父级id数组
						rank,		// 层级
						showChild: false,	//子级是否显示
						open: false,		//是否打开
						show: rank === 0,	// 自身是否显示
						hideArr: [],
						orChecked: item.checked ? item.checked : false,
						checked: item.checked ? item.checked : false,
						indeterminate: false // 非叶子节点 没有全部选择的状态 (不确定的)
					})
					if (Array.isArray(item[this.childrenKey]) && item[this.childrenKey].length > 0) {
						let parentid = [...parentId],
							parentArr = [...parents],
							childrenid = [...childrenid];
						delete parentArr[this.childrenKey]
						parentid.push(item[this.idKey]);
						parentArr.push({
							[this.idKey]: item[this.idKey],
							[this.textKey]: item[this.textKey]
						})
						this._renderTreeList(item[this.childrenKey], rank + 1, parentid, parentArr);
					} else {
						this.treeList[this.treeList.length - 1].lastRank = true;
					}
				});
			},
			_defaultSelect() {
				// 处理默认选择
				this.treeList.forEach((v, i) => {
					if (v.checked) {
						this.treeList.forEach((v2, i2) => {
							if (v.parentId.toString().indexOf(v2.parentId.toString()) >= 0) {
								v2.show = true
								if (v.parentId.includes(v2.id)) {
									v2.showChild = true;
									v2.open = true;
								}
							}
						})
					}
				})
			},
			_treeItemTap(item) {
				// 点击
				if (item.lastRank === true) {
					// 点击最后一级 触发事件
					this._treeItemSelect(item);
					return;
				}
				let list = this.treeList;
				let id = item.id;
				item.showChild = !item.showChild;
				item.open = item.showChild ? true : !item.open;
				list.forEach((childItem, i) => {
					if (item.showChild === false) {
						// 隐藏所有子级
						if (!childItem.parentId.includes(id)) {
							return;
						}
						if (!this.foldAll) {
							if (childItem.lastRank !== true && !childItem.open) {
								childItem.showChild = false;
							}
							// 为隐藏的内容添加一个标记
							if (childItem.show) {
								childItem.hideArr[item.rank] = id
							}
						} else {
							if (childItem.lastRank !== true) {
								childItem.showChild = false;
							}
						}
						childItem.show = false;
					} else {
						// 打开子集
						if (childItem.parentId[childItem.parentId.length - 1] === id) {
							childItem.show = true;
						}
						// 打开被隐藏的子集
						if (childItem.parentId.includes(id) && !this.foldAll) {
							// console.log(childItem.hideArr)
							if (childItem.hideArr[item.rank] === id) {
								childItem.show = true;
								if (childItem.open && childItem.showChild) {
									childItem.showChild = true
								} else {
									childItem.showChild = false
								}
								childItem.hideArr[item.rank] = null
							}
							// console.log(childItem.hideArr)
						}
					}
				})
			},
			_treeItemSelect(item, index) {
				if (this.disabled || item.disabled) {
					// 禁用状态
					return;
				}
				if (!index) {
					index = this.treeList.findIndex(it => it.id == item.id);
				}
				this.treeList[index].checked = !this.treeList[index].checked;
				this._fixMultiple(index);
				if (this.multiple && this.selectParent && !this.selectStrictly) {
					// 多选 && 可选父节点 && 父子互相关联
					if (item.source[this.childrenKey] && item.source[this.childrenKey].length) {
						// 选中其下所有叶子节点
						const checked = item.checked;
						item.source[this.childrenKey].forEach(ele => {
							const i = this.treeList.findIndex(treeItem => (treeItem.id == ele[this.idKey]));
							if (i != -1) {
								const data = this.treeList[i];
								if (data.checked != checked) {
									// 选择 / 取消选择 --> 选择状态变为和父节点一致
									this._treeItemSelect(data, i);
								}
							}
						});
					}
					// 修改父级、非叶子节点的选择状态
					if (item.parentId && item.parentId.length) {
						const id = item.parentId[0]; // 最顶级的父节点
						const i = this.treeList.findIndex(treeItem => (treeItem.id == id));
						if (i != -1) {
							const parent = this.treeList[i].source;
							const data = this.changeParentChecked(parent[this.childrenKey]);
							this.changeChecked(id, data);
						}
					}
				}
			},
			_fixMultiple(index) {
				// 处理单选
				if (this.multiple) return;
				this.treeList.forEach((v, i) => {
					if (i != index) {
						this.treeList[i].checked = false;
					} else {
						this.treeList[i].checked = true;
					}
				});
			},
			_reTreeList() {
				// 重置数据
				this.treeList.forEach((v, i) => {
					this.treeList[i].checked = v.orChecked;
				});
			},
			_initTree(options = this.options) {
				this.treeList = [];
				this._renderTreeList(options);
				if (this.expandLevel1) {
					// 展开第一级
					options.forEach((rangeItem) => {
						const index = this.treeList.findIndex(treeItem => (treeItem.id == rangeItem[this.idKey]));
						if (index != -1) {
							const item = this.treeList[index];
							if (item.lastRank === true) return; // 最后一级
							if (!item.showChild) this._treeItemTap(item, index);
						}
					});
				}
				this.$nextTick(() => {
					this._defaultSelect(options)
				})
			},
			changeValue(value = this.value) {
				let list = [];
				if (Array.isArray(value)) {
					list = value;
				} else {
					if (value) {
						list = [value];
					}
				}
				if (list.length > 0) {
					// const arr = [];
					list.forEach(id => {
						const index = this.treeList.findIndex(treeItem => (treeItem.id == id));
						if (index != -1) {
							const data = this.treeList[index];
							if (!data.checked) {
								this._treeItemSelect(data, index);
							}
							// arr.push({
							// 	...data.source
							// });
						}
					});
					// this.$emit('getLabel', arr);
				}
			},
			changeParentChecked(list = this.options) {
				// 修改非叶子节点的选择状态 (手动全选了叶子节点 或 手动取消选择全部叶子节点)
				// 默认遍历整棵树
				let checkedNum = 0,
					nodeNum = 0;
				list.forEach(item => {
					if (item[this.childrenKey] && item[this.childrenKey].length) {
						// 递归遍历所有子节点 返回: {选择数量, 所有叶子节点数量}
						const data = this.changeParentChecked(item[this.childrenKey]);
						this.changeChecked(item[this.idKey], data);
						checkedNum += data.checkedNum;
						nodeNum += data.nodeNum;
					} else {
						// 叶子节点
						nodeNum += 1;
						const data = this.treeList.find(treeItem => (treeItem.id == item[this.idKey]));
						if (data && data.checked) {
							checkedNum += 1;
						}
					}
				});
				return {
					checkedNum,	// 选择的叶子节点数量
					nodeNum		// 所有的叶子节点数量
				};
			},
			changeChecked(id, data) {
				// 修改checked indeterminate 状态
				const index = this.treeList.findIndex(treeItem => (treeItem.id == id));
				if (index != -1) {
					let checked = false,
						indeterminate = false;
					if (data.checkedNum == data.nodeNum) {
						// checked 全部选中
						checked = true;
					} else if (data.checkedNum == 0) {
						// false 没有选中的叶子节点
						checked = false;
						indeterminate = false;
					} else {
						// 部分选中
						indeterminate = true;
					}
					this.$set(this.treeList[index], 'checked', checked);
					this.$set(this.treeList[index], 'indeterminate', indeterminate);
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.hf-tree {
		padding: 20rpx;
		.hf-tree-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: $font-df;
			color: $u-main-color;
			line-height: 1;
			height: 0;
			opacity: 0;
			transition: 0.2s;
			position: relative;
			overflow: hidden;
			&.show {
				height: 80rpx;
				opacity: 1;
			}
			&.showchild:before {
				transform: rotate(90deg);
			}
			&.last:before {
				opacity: 0;
			}
		}
		.hf-tree-label {
			flex: 1;
			display: flex;
			align-items: center;
			height: 100%;
			&__icon {
				width: 36rpx;
				display: flex;
				justify-content: center;
			}
			&__content {
				flex: 1;
				padding-left: $xs;
			}
		}
		.hf-tree-check {
			width: 40px;
			height: 40px;
			display: flex;
			justify-content: center;
			align-items: center;
			.hf-tree-check-yes,
			.hf-tree-check-no {
				width: 20px;
				height: 20px;
				border-radius: 50%;
				display: flex;
				justify-content: center;
				align-items: center;
				box-sizing: border-box;
			}
			.hf-tree-check-yes {
				border: 1rpx solid $u-primary;
				background-color: $u-primary;
			}
			.hf-tree-check-no {
				border: 2px solid $u-border-color;
			}
			// .radio {}
		}
	}
</style>
