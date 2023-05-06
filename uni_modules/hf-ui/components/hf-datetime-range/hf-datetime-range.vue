<template>
	<view class="hf-datetime-range">
		<view class="editor">
			<view class="range" :class="{active: current === 0}" @click="handleClick(0)">
				<u-input
					:value="valueShow[0]"
					placeholder="开始时间"
					:color="current === 0 ? primaryColor : mainColor"
					disabled disabled-color="#ffffff" border="bottom" input-align="center"></u-input>
			</view>
			<view class="separator">至</view>
			<view class="range" :class="{active: current === 1}" @click="handleClick(1)">
				<u-input
					:value="valueShow[1]"
					placeholder="结束时间"
					:color="current === 1 ? primaryColor : mainColor"
					disabled disabled-color="#ffffff" border="bottom" input-align="center"></u-input>
			</view>
		</view>
		<view v-if="placeholder" v-show="current === ''" :style="placeholderStyle"></view>
		<view v-show="current === 0">
			<hf-datetime-picker :mode="mode" :value="valueTemp[0]" @input="handleInput"></hf-datetime-picker>
		</view>
		<view v-show="current === 1">
			<hf-datetime-picker :mode="mode" :value="valueTemp[1]" @input="handleInput"></hf-datetime-picker>
		</view>
	</view>
</template>

<script>
	/**
	 * @description 嵌入页面的滚动日期范围选择器
	 * @property {Array} value 日期范围
	 * @example 
	 */
	import dayjs from '@/uni_modules/uview-ui/libs/util/dayjs.js';
	import { formatMap, formatShowMap } from '../../libs/util/dateFormat.js';
	export default {
		name: 'HfDatetimeRange',
		props: {
			value: {
				type: Array,
				default: () => ([])
			},
			mode: {	// 展示格式
				type: String,
				default: 'date',
				validator: (val) => {
					return ['datetime', 'date', 'time', 'year-month'].includes(val);
				}
			},
			placeholder: {	// 未选择开始结束时间前 是否显示一个占位高度 进行展位
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				primaryColor: uni.$u.config.color['u-primary'],
				mainColor: uni.$u.config.color['u-main-color'],
				current: ''
			}
		},
		computed: {
			format() {
				return formatMap.get(this.mode);
			},
			formatShow() {
				return formatShowMap.get(this.mode);
			},
			valueTemp() {
				const value = this.value;
				const arr = [];
				if (Array.isArray(value)) {
					arr.push(...value);
				}
				
				const timestamp = Number(new Date());
				const now = uni.$u.timeFormat(timestamp, this.format);
				
				return new Array(2).fill(0).map((item, index) => {
					if (arr[index] && dayjs(arr[index]).isValid()) {
						return arr[index];
					}
					return now;
				});
			},
			valueShow() {
				const value = this.value;
				const arr = [];
				if (Array.isArray(value)) {
					arr.push(...value);
				}
				
				return new Array(2).fill(0).map((item, index) => {
					if (arr[index] && dayjs(arr[index]).isValid()) {
						return uni.$u.timeFormat(arr[index], this.formatShow);
					}
					return '';
				});
			},
			placeholderStyle() {
				const visibleItemCount = uni.$u.props.datetimePicker['visibleItemCount'];
				const itemHeight = uni.$u.props.datetimePicker['itemHeight'];
				// return `height: ${uni.$u.addUnit(this.visibleItemCount * this.itemHeight)}`;
				return `height: ${uni.$u.addUnit(visibleItemCount * itemHeight)}`;
			}
		},
		created() {
			// 弹窗popup关闭 会销毁内部组件dom元素, 让视觉上不那么明显...的...妥协处理
			if (this.valueShow[0]) {
				this.current = 0;
			} else if (this.valueShow[1]) {
				this.current = 1;
			}
		},
		methods: {
			handleInput(val, index = this.current) {
				const value = this.value;
				const arr = [];
				if (Array.isArray(value)) {
					arr.push(...value);
				}
				arr[index] = val;
				this.$emit('input', arr);
			},
			handleClick(index) {
				this.current = index;
				if (!this.valueShow[index]) {
					// 选择开始结束时间 默认填入当天
					this.handleInput(this.valueTemp[index], index);
				}
				this.$emit('click');
			}
		}
	}
</script>

<style lang="scss" scoped>
	.hf-datetime-range {
		.editor {
			display: flex;
			align-items: center;
			.range {
				flex: 1;
				padding: 0 $df;
				&.active /deep/ .u-border-bottom {
					border-color: $u-primary !important;
				}
			}
		}
	}
</style>
