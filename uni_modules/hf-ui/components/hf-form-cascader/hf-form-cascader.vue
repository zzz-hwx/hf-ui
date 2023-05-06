<template>
	<view class="hf-form-cascader">
		<u-form-item :label="label" :prop="prop" :required="required" :label-position="labelPosition" :borderBottom="borderBottom" @click="pickerShow">
			<view ref="input" class="input-wrap">
				<text v-if="valueName">{{ valueName }}</text>
				<text v-else class="placeholder">{{ placeholder }}</text>
			</view>
			<template #right>
				<slot name="right"></slot>
			</template>
		</u-form-item>
		
		<u-popup :show="visible" @close="handleClose">
			<view class="top">
				<view @click="handleClose">
					<text class="cancel">{{ cancelText }}</text>
				</view>
				<view class="title">{{ label }}</view>
				<view>
					<u-text :text="confirmText" type="primary" @click="handleConfirm"></u-text>
				</view>
			</view>
			<hf-cascader-picker v-model="innerValue" :options="options"></hf-cascader-picker>
		</u-popup>
	</view>
</template>

<script>
	/**
	 * @description 多列级联选择
	 */
	import mixin from '../../libs/mixins/form.js';
	import { treeFindPath } from '../../libs/util/utils.js';
	export default {
		name: 'HfFormCascader',
		mixins: [mixin],
		props: {
			options: {
				type: Array,
				default: () => ([])
			},
			showAllLevels: {
				// 是否显示选中值的完整路径
				type: Boolean,
				default: false
			},
			separator: {
				type: String,
				default: '/'
			}
		},
		data() {
			return {
				cancelText: uni.$u.props.picker.cancelText,		// 取消按钮的文字
				confirmText: uni.$u.props.picker.confirmText,	// 确认按钮的文字
				visible: false,
				innerValue: '',	// 选中的最后一级key
			}
		},
		watch: {
			value: {
				handler(value) {
					this.innerValue = value;
				},
				immediate: true
			}
		},
		computed: {
			valueName() {
				// 选中的选项名
				const path = treeFindPath(this.value, this.options);
				if (!path.length) return '';
				if (this.showAllLevels) {
					return path.map(item => (item.text)).join(this.separator);
				}
				const last = path[path.length - 1];
				return last.text;
			}
		},
		methods: {
			pickerShow() {
				if (this.disabled) return;
				this.visible = true; 
				uni.hideKeyboard();
			},
			handleConfirm() {
				const path = treeFindPath(this.innerValue, this.options);
				this.$emit('input', this.innerValue, path);	// 选中的最后一级key, 路径
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
	@import '../../libs/css/form.scss';
	.hf-form-cascader {
		.top {
			height: 100rpx;
			padding: 0 $df;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.cancel {
				color: $u-tips-color;
			}
			.title {
				font-size: $font-lg;
				font-weight: bold;
			}
		}
	}
</style>