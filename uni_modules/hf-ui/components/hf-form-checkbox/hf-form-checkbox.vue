<template>
	<view class="hf-form-checkbox">
		<u-form-item :prop="prop" :required="required" :label-position="labelPosition" :border-bottom="borderBottom" @click="pickerShow">
			<template #label>
				<view class="label">
					<view class="left-content" :style="labelStyle">
						<text v-if="required" class="left-content__required">*</text>
						<template v-if="$slots.label">
							<slot name="label"></slot>
						</template>
						<template v-else>
							<view class="" :style="[parentData.labelStyle]">{{ label }}</view>
						</template>
					</view>
					<view class="input-wrap">
						<text v-show="!value" class="placeholder">{{ placeholder }}</text>
					</view>
				</view>
			</template>
			
			<view v-show="value" class="wrap">
				<template v-if="!disabled">
					<u-line></u-line>
					<u-gap height="10"></u-gap>
				</template>
				<view class="scroll-wrap">
					<scroll-view ref="input" scroll-x class="check-area">
						<view class="check-list">
							<slot name="checkList" :info="valueName">
								<view v-for="(item, index) in valueName" :key="index" class="check-item">{{ item }}</view>
							</slot>
						</view>
					</scroll-view>
				</view>
			</view>
		</u-form-item>
		
		<u-popup :show="visible" :close-on-click-overlay="false" @close="handleClose">
			<view class="top">
				<view @click="handleCancel">
					<text class="cancel">{{ cancelText }}</text>
				</view>
				<view class="title">{{ label }}</view>
				<view>
					<u-text :text="confirmText" type="primary" @click="handleConfirm"></u-text>
				</view>
			</view>
			<scroll-view scroll-y style="height: 50vh;">
				<u-checkbox-group v-model="selected" icon-placement="right" placement="column" border-bottom>
					<u-checkbox
						v-for="(item, index) in list_"
						:key="index"
						:label="item[keyName]"
						:name="item[keyValue]"
						shape="circle"
						:activeColor="confirmColor"
						:customStyle="checkboxStyle"
					></u-checkbox>
				</u-checkbox-group>
			</scroll-view>
		</u-popup>
	</view>
</template>

<script>
	import mixin from '../../libs/mixins/form.js';
	import loadData from '../../libs/util/loadData.js';
	export default {
		name: 'HfFormCheckbox',
		mixins: [mixin],
		props: {
			dictCode: {
				// 字典code
				type: String,
				default: ''
			},
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
			confirmColor: {
				type: String,
				default: uni.$u.config.color['u-primary']
			},
			labelPosition: {
				type: String,
				default: 'top'
			},
		},
		// #ifdef MP-WEIXIN
		options: {
			styleIsolation: 'shared'
		},
		// #endif
		data() {
			return {
				cancelText: uni.$u.props.picker.cancelText,		// 取消按钮的文字
				confirmText: uni.$u.props.picker.confirmText,	// 确认按钮的文字
				list: [],
				selected: [],
				visible: false,
				
				checkboxStyle: {
					padding: '24rpx 30rpx',
					paddingBottom: '24rpx'	// vue有做合并 ?
				}
			};
		},
		computed: {
			list_() {
				return this.list;
			},
			valueName() {
				// 选中的选项名
				const selected = (this.value || '').split(this.separator);
				return this.list_.filter(item => (selected.indexOf(item[this.keyValue]) !== -1)).map(item => (item[this.keyName]));
			}
		},
		watch: {
			value: {
				handler(val) {
					if (val) {
						this.selected = val.split(this.separator);
					} else {
						this.selected = [];
					}
				},
				immediate: true
			},
			dictCode: {
				handler() {
					this.loadDictOptions();
				},
				immediate: true
			},
			options: {
				handler(val) {
					if (!this.dictCode) {
						this.list = uni.$u.deepClone(val);
					}
				},
				immediate: true
			}
		},
		methods: {
			async loadDictOptions() {
				if (this.dictCode) {
					// 获取字典数据
					this.list = await loadData.loadDictOptions(this.dictCode);
				}
			},
			pickerShow() {
				if (this.disabled) return;
				this.visible = true; 
				uni.hideKeyboard();
			},
			handleConfirm() {
				const selected = this.selected.join(this.separator);
				this.$emit('input', selected);
				this.handleClose();
			},
			handleCancel() {
				this.selected = this.value ? this.value.split(this.separator) : [];	// 清空选择
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
	@import '../../libs/css/form.scss';
	.hf-form-checkbox {
		/deep/ .u-form-item__body__right__message {
			// 表单校验的错误提示 放左侧
			margin-left: 0 !important;
		}
		.label {
			display: flex;
			justify-content: space-between;
			align-items: center;
			.left-content {
				white-space: nowrap;
			}
		}
		.wrap {
			padding-top: $sm;
			width: 100%;
			.scroll-wrap {
				display: flex;
				.check-area {
					flex: 1;
					width: 0;
				}
			}
			.check-list {
				display: flex;
				flex-direction: row;
				flex-wrap: nowrap;
				.check-item {
					padding: $xs;
					margin-right: $xs;
					background-color: $u-primary-light;
					border: 1rpx $u-primary solid;
					border-radius: 5rpx;
					color: $u-primary;
					white-space: nowrap;
				}
			}
		}
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
