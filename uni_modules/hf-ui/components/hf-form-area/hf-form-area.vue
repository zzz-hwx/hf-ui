<template>
	<view class="hf-form-area">
		<u-form-item :label="label" :prop="prop" :required="required" :label-position="labelPosition" :borderBottom="borderBottom" @click="pickerShow">
			<hf-form-content ref="input" :value="valueName" :placeholder="placeholder"></hf-form-content>
		</u-form-item>
		<u-picker
			ref="uPicker"
			:show="visible"
			:title="label"
			:columns="columns"
			:defaultIndex="defaultIndex"
			keyName="label"
			immediateChange
			@change="handlerChange"
			@confirm="handleConfirm"
			@cancel="handleClose"
			@close="handleClose"></u-picker>
	</view>
</template>

<!-- #ifdef APP-VUE || H5 -->
<script module="test" lang="renderjs">
	export default {
		mounted() {
			(document.querySelector('uni-page-wrapper') || document.body).appendChild(this.$refs.uPicker.$el);
		},
	}
</script>
<!-- #endif -->

<script>
	/**
	 * 省市县三级选择 picker-view
	 * [保存最后1级]
	 */
	import mixin from '../../libs/mixins/form.js';
	import pcaa from './china-area-data/data.json';
	import { rootPid, all } from './china-area-data/index.js';
	// import { getAreaTreeNode } from '@/api/index.js';
	
	export default {
		name: 'HfFormArea',
		mixins: [mixin],
		props: {
			level: {
				// 默认显示 省/市/区三级的行政区划
				type: Number,
				default: 3,
				validator: (val) => {
					return val <= 3;	// 最多3级
				}
			},
			fullPath: {
				// 是否全路径 '350000,350400,350403'
				// 默认最后一级 '350403'
				type: Boolean,
				default: false
			},
			separator: {
				// 分隔符
				type: String,
				default: ','
			},
			textSeparator: {
				// 选项名的分隔符
				type: String,
				default: '/'
			}
		},
		data() {
			return {
				visible: false,
				innerValue: [],
				defaultIndex: [],
				columns: []
			}
		},
		computed: {
			valueName() {
				if (this.innerValue.length) {
					return this.innerValue.map((value, index) => {
						const item = all.find(item => (item.value === value && item.level === index + 1));
						if (item) return item.label;
					}).filter(Boolean).join(this.textSeparator);
				}
				return '';
			}
		},
		watch: {
			value: {
				handler(val) {
					this.loadDataByValue(val);
					this.loadColumns();
				},
				immediate: true
			}
		},
		created() {
			// this.queryAreaTreeList();
		},
		methods: {
			// async queryAreaTreeList() {
			// 	const res = await getAreaTreeNode({ pid: 0 });
			// 	console.log(res);
			// },
			loadColumns() {
				const picker = this.$refs.uPicker;
				this.columns = [];
				let pid = rootPid;
				for (let i = 0; i < this.level; i++) {
					const list = Object.entries(pcaa[pid]).map(([value, label]) => ({ value, label }));
					this.columns.push(list);
					if (picker && picker.setColumnValues) {
						picker.setColumnValues(i, list);
					}
					pid = this.innerValue[i] || list[0].value;
				}
			},
			loadDataByValue(value) {
				if (value) {
					let arr = [];
					if (this.fullPath) {
						arr = value.split(this.separator).map((value, index) => {
							const item = all.find(item => (item.value === value && item.level === (index + 1)));
							return item;
						}).filter(Boolean);
					} else {
						// 通过 value 反推
						arr = this.getRealCode(value, this.level);
					}
					this.innerValue = arr.map((item) => (item.value));
					this.defaultIndex = arr.map((item) => (item.index));
				} else {
					this.innerValue = [];
				}
			},
			getRealCode(value, level, arr = []) {
				if (level === 0) return arr;
				const item = all.find(item => (item.value === value && item.level === level));
				if (item) {
					arr.unshift(item);
					this.getRealCode(item.pid, level - 1, arr);
				}
				return arr;
			},
			pickerShow() {
				if (this.disabled) return;
				this.visible = true;
				uni.hideKeyboard();
			},
			handlerChange(event) {
				const {
					columnIndex,	// 第几列
					index,			// 选中的第几个 索引
					value,
					picker = this.$refs.uPicker	// 微信小程序无法将picker实例传出来，只能通过ref操作
				} = event;
				if (columnIndex < this.level - 1) {
					let pid = value[columnIndex].value;	// 选中项的value
					for (let i = columnIndex + 1; i < this.level; i++) {
						const list = Object.entries(pcaa[pid]).map(([value, label]) => ({ value, label }));
						picker.setColumnValues(i, list);
						pid = list[0].value;
					}
				}
			},
			handleConfirm(event) {
				const arr = event.value;
				if (arr.length) {
					if (this.fullPath) {
						const val = arr.map(item => (item.value)).join(this.separator);
						this.$emit('input', val, arr);
					} else {
						const item = arr[arr.length - 1];
						this.$emit('input', item.value, arr);
					}
				}
				this.handleClose();
			},
			handleClose() {
				this.visible = false;
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
	
</style>
