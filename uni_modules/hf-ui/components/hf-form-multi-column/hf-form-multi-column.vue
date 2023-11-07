<template>
	<view class="hf-form-multi-column">
		<!--  -->
	</view>
</template>

<script>
	import mixin from '../../libs/mixins/form.js';
	export default {
		name: 'HfFormMultiColumn',
		mixins: [mixin],
		props: {
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
			separator: {
				// 选项分隔符
				type: String,
				default: ','
			},
		},
		// #ifdef MP-WEIXIN
		options: {
			styleIsolation: 'shared'
		},
		// #endif
		data() {
			return {
				cancelText: uni.$u.props.picker.cancelText, // 取消按钮的文字
				// confirmText: uni.$u.props.picker.confirmText,	// 确认按钮的文字
				disabledColor: uni.$u.config.color['u-disabled-color'],
				visible: false,
				list: [],
			}
		},
		computed: {
			list_() {
				if (this.showAll) {
					return [{
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
				// ???
			},
			defaultIndex() {
				// 各列的默认索引
				let index = this.list_.findIndex((item) => (item[this.keyValue] == this.value));
				if (index === -1) index = 0;
				return [index];
			},
		},
		watch: {
			value: {
				handler(val) {
					// ???
				},
				immediate: true
			},
			options: {
				handler(val) {
					this.list = uni.$u.deepClone(val);
				},
				immediate: true
			}
		},
		methods: {
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
			handleClose() {
				this.visible = false;
				if (this.mode == 'right') {
					this.selected = this.value ? this.value.split(this.separator) : []; // 清空选择
				}
				if (this.$refs.input) {
					this.$nextTick(() => {
						uni.$u.formValidate(this.$refs.input, 'change');
					});
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	@import '../../libs/css/form.scss';

	.hf-form-multi-column {
		// 
	}
</style>