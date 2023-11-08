<template>
	<view class="hf-select">
		<u-form-item :label="label" :prop="prop" :required="required" :label-position="labelPosition" @click="pickerShow" :borderBottom="borderBottom">
			<hf-form-content ref="input" :value="valueName" :placeholder="placeholder"></hf-form-content>
			<template #right>
				<slot name="right"></slot>
			</template>
		</u-form-item>
		<u-picker
			ref="uPicker"
			:show="visible"
			:title="label"
			:columns="columns"
			:defaultIndex="defaultIndex"
			keyName="label"
			immediateChange
			@change="changeHandler"
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
	import mixin from '../../libs/mixins/form.js';
	export default {
		name: 'HfFormTSelect',
		mixins: [mixin],
		props: {
			columns: {
				type: Array,
				default: []
			},
			columnData: {
				type: Array,
				default: []
			}
		},
		data() {
			return {
				visible: false,
				inColumns: [],
				inColumnData: [],
			}
		},
		watch: {
			columnData(val) {
				this.inColumnData = this.$u.deepClone(this.columnData)
				// console.log('watch::::',this.columnData)
			},
			columns(val) {
				this.inColumns = this.$u.deepClone(this.columns)
			}
		},
		computed: {
			defaultIndex() {
				// 各列的默认索引
				const valOption = this.value.split('/')
				const valIndex = []
				valOption.forEach((item, index) => {
					if (Array.isArray(this.inColumns[index])) {
						valIndex[index] = this.inColumns[index].findIndex(item => valOption[index] == item.value)
						if(index == 0 && valIndex[0] != -1) {
							this.$set(this.inColumns, "1" , this.inColumnData[valIndex[0]])
						}
					}
				})
				
				if (valIndex[0] === -1) {
					valIndex[0] = 0;
					valIndex[1] = 0;
				}
				if (valIndex[1] === -1) {
					valIndex[1] = 0;
				}
				// console.log(valIndex)
				return valIndex;
			},
			valueName() {
				// 选中的选项名 [1, 2]
				const valOption = this.value.split('/')
				// console.log("valOption",valOption)
				// console.log(this.inColumns[1])
				const valLabels = []
				valOption.forEach((item, index) => {
					if (Array.isArray(this.inColumns[index])) {
						valLabels[index] = this.inColumns[index].find(item => item.value == valOption[index])
					}
				})
				// console.log("valLabels", valLabels)
				if (!valLabels[0]) return '';
				if (!valLabels[1]) return valLabels[0].label;
				return valLabels[0].label + '/' + valLabels[1].label;
			},
		},
		created() {
			this.loadInColumns();
		},
		methods: {
			async loadInColumns() {
				// console.log('loadInColumns',this.columns)
				this.inColumns = this.$u.deepClone(this.columns)
				this.inColumnData = this.$u.deepClone(this.columnData)
			},
			pickerShow() {
				if (this.disabled) return;
				this.visible = true; 
				uni.hideKeyboard();
				
			},
			changeHandler(event) {
				const {
					columnIndex,
					index,
					// 微信小程序无法将picker实例传出来，只能通过ref操作
					picker = this.$refs.uPicker
				} = event
				// console.log('changeHandler')
				// console.log(columnIndex, index, this.inColumnData[index])
				if (columnIndex === 0) {
					if(this.inColumnData[index]) {
						picker.setColumnValues(1, this.inColumnData[index])
					}
					this.inColumns[1] = this.inColumnData[index]
				}
				// console.log("changeHandler", this.inColumns)
			},
			handleConfirm(event){  // 回调参数为包含columnIndex、value、values
				console.log(event.value)
				if (event.value.length) {
					// 回填 1/2
					if(event.value[1] == undefined) {
						this.$emit('input', event.value[0].value + '/' + '');
					}else {
						this.$emit('input', event.value[0].value + '/' + event.value[1].value);
					}
					// console.log(event.value[0].value + '/' + event.value[1].value)
				}
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

</style>
