<template>
	<view
		v-if="active"
		class="hf-dropdown-item"
		@touchmove.stop.prevent="() => {}"
		@tap.stop.prevent="() => {}"
	>
		<block v-if="!$slots.default && !$slots.$default">
			<u-list :custom-style="{height: `${$u.addUnit(height)} !important`}">
				<u-list-item v-for="item in renderList" :key="item.value">
					<view class="item-wrap">
						<view class="item" @click="cellClick(item.value)">
							<view
								class="slot"
								:class="{selected: item.selected, disabled: item.disabled}"
							>
								<text>{{ item.label }}</text>
							</view>
							<template v-if="item.selected">
								<u-icon name="checkbox-mark" :size="20" :color="item.disabled ? disabledColor : 'primary'"></u-icon>
							</template>
						</view>
						<u-line></u-line>
					</view>
				</u-list-item>
			</u-list>
		</block>
		<slot v-else></slot>
	</view>
</template>

<script>
	/**
	 * dropdown-item 下拉菜单
	 * @description 该组件一般用于向下展开菜单，同时可切换多个选项卡的场景
	 * @tutorial https://v1.uviewui.com/components/dropdown.html
	 * @property {String | Number} v-model 双向绑定选项卡选择值
	 * @property {String} title 菜单项标题
	 * @property {Array[Object]} options 选项数据，如果传入了默认slot，此参数无效
	 * @property {Boolean} disabled 是否禁用此选项卡（默认false）
	 * @property {String | Number} duration 选项卡展开和收起的过渡时间，单位ms（默认300）
	 * @property {String | Number} height 弹窗下拉内容的高度(内容超出将会滚动)（默认auto）
	 * @example <hf-dropdown-item title="标题"></hf-dropdown-item>
	 */
	export default {
		name: 'HfDropdownItem',
		props: {
			value: {
				// 当前选中项的value值
				type: [Number, String, Array],
				default: ''
			},
			title: {
				// 菜单项标题
				type: [String, Number],
				default: ''
			},
			options: {
				// 选项数据，如果传入了默认slot，此参数无效
				type: Array,
				default: () => ([])
			},
			disabled: {
				// 是否禁用此菜单项
				type: Boolean,
				default: false
			},
			height: {
				// 下拉弹窗的高度
				type: [Number, String],
				default: 'auto'
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
		},
		data() {
			return {
				active: false, // 当前项是否处于展开状态
				disabledColor: uni.$u.config.color['u-disabled-color'],
			}
		},
		computed: {
			// 监听props是否发生了变化，有些值需要传递给父组件hf-dropdown，无法双向绑定
			propsChange() {
				return `${this.title}-${this.disabled}`;
			},
			renderList() {
				if (!(Array.isArray(this.options) && this.options.length)) return [];
				return this.options.map(item => {
					return {
						label: item[this.keyName],
						value: item[this.keyValue],
						disabled: !!item[this.keyDisabled],
						selected: this.value === item[this.keyValue]
					}
				})
			}
		},
		watch: {
			propsChange(n) {
				// 当值变化时，通知父组件重新初始化，让父组件执行每个子组件的init()方法
				// 将所有子组件数据重新整理一遍
				if (this.parent) this.parent.init();
			}
		},
		created() {
			// 父组件的实例
			this.parent = false;
		},
		mounted() {
			this.init();
		},
		methods: {
			init() {
				// 获取父组件hf-dropdown
				let parent = this.$u.$parent.call(this, 'HfDropdown');
				if (parent) {
					this.parent = parent;
					// 将本组件的this，放入到父组件的children数组中，让父组件可以操作本(子)组件的方法和属性
					// push进去前，显判断是否已经存在了本实例，因为在子组件内部数据变化时，会通过父组件重新初始化子组件
					let exist = parent.children.find(val => {
						return this === val;
					})
					if (!exist) parent.children.push(this);
					if (parent.children.length == 1) this.active = true;
					// 父组件无法监听children的变化，故将子组件的title，传入父组件的menuList数组中
					parent.menuList.push({
						title: this.title,
						disabled: this.disabled
					});
				}
			},
			// cell被点击
			cellClick(value) {
				const item = this.renderList.find(item => (item.value === value));
				if (item.disabled) return;
				// 修改通过v-model绑定的值
				this.$emit('input', value);
				// 通知父组件(hf-dropdown)收起菜单
				this.parent.close();
				// 发出事件，抛出当前勾选项的value
				this.$emit('change', value);
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~@/uni_modules/uview-ui/libs/css/components.scss';
	.hf-dropdown-item {
		background-color: #FFFFFF;
	}
	.item-wrap {
		margin: 0 $sm;
		.item {
			padding: $sm $xs;
			@include flex(row);
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
</style>
