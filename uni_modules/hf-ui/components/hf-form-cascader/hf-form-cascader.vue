<template>
	<view class="hf-form-cascader">
		<u-form-item :label="label" :prop="prop" :required="required" :label-position="labelPosition" :border-bottom="borderBottom" @click="pickerShow">
			<hf-form-content ref="input" :value="valueName" :placeholder="placeholder"></hf-form-content>
			<template #right>
				<slot name="right"></slot>
			</template>
		</u-form-item>
		
		<u-popup ref="uPopup" :show="visible" :close-on-click-overlay="false" @close="handleClose">
			<view class="top">
				<view @click="handleClose">
					<text class="cancel">{{ cancelText }}</text>
				</view>
				<view class="title">{{ label }}</view>
				<view>
					<u-text :text="confirmText" type="primary" @click="handleConfirm"></u-text>
				</view>
			</view>
			<hf-cascader-picker
				v-model="innerValue"
				:options="options"
				:select-parent="selectParent"
				:default-props="defaultProps"
				:visible-item-count="visibleItemCount"
			></hf-cascader-picker>
		</u-popup>
	</view>
</template>

<!-- #ifdef APP-VUE || H5 -->
<script module="test" lang="renderjs">
	export default {
		mounted() {
			(document.querySelector('uni-page-wrapper') || document.body).appendChild(this.$refs.uPopup.$el);
		},
	}
</script>
<!-- #endif -->

<script>
	/**
	 * @description 多列级联选择
	 */
	import mixin from '../../libs/mixins/form.js';
	import { treeFindPath } from '@/uni_modules/hic-plugin';
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
			},
			selectParent: {
				type: Boolean,
				default: false
			},
			defaultProps: {
				type: Object,
				default: () => ({})
			},
			visibleItemCount: { // 每列中可见选项数量
				type: Number,
				default: 5
			},
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
				const path = treeFindPath(this.value, this.options, this.defaultProps);
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
				const path = treeFindPath(this.innerValue, this.options, this.defaultProps);
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
	// .hf-form-cascader {}
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
</style>
