<template>
	<view class="hf-form-checkbox">
		<u-form-item :label="label" :prop="prop" :required="required" :label-position="labelPosition" :borderBottom="borderBottom" @click="openCheckOptions">
			<template #label>
				<view class="label">
					<view class="left-content" :style="labelStyle">
						<text v-if="required" class="left-content__required">*</text>
						<text :style="[parentData.labelStyle]">{{ label }}</text>
					</view>
					<view class="input-wrap">
						<text v-if="!checkOptionsVal.length" class="placeholder">{{ placeholder }}</text>
					</view>
				</view>
			</template>
			<!-- <hf-form-content ref="input" :placeholder="placeholder"></hf-form-content> -->
			
			<view v-show="checkOptionsVal.length" class="wrap">
				<template v-if="!disabled">
					<u-line></u-line>
					<u-gap height="10"></u-gap>
				</template>
				<view class="scroll-wrap">
					<scroll-view ref="input" scroll-x class="check-area">
						<view class="check-list" @click="openCheckOptions">
							<slot name="checkList" :info="checkOptionsVal">
								<view v-for="(item, index) in checkOptionsVal" :key="index" class="check-item">{{ item }}</view>
							</slot>
						</view>
					</scroll-view>
				</view>
			</view>
		</u-form-item>


		<u-popup :show="visible">
			<view class="pop-head">
				<text class="pop-cancel" @click="noSelectCheckOptions">{{ cancelText }}</text>
				<text class="pop-tt">{{ label }}</text>
				<text class="pop-confirm" @click="selectCheckOptions">{{ confirmText }}</text>
			</view>
			<scroll-view scroll-y style="height: 50vh;">
				<u-checkbox-group v-model="checkOptionsVal" iconPlacement="right" placement="column" borderBottom>
					<u-checkbox
						v-for="(item, index) in list"
						:key="index"
						:label="item.label"
						:name="item.label"
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
				type: String,
				default: ''
			},
			options: {
				type: Array,
				default: () => ([])
			},
			separator: {
				type: String,
				default: ','
			},
			labelPosition: {
				type: String,
				default: 'top'
			},
			confirmColor: {
				type: String,
				default: uni.$u.config.color['u-primary']
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
				visible: false,
				list: [],
				checkOptionsVal: [], // [label, label] - 选中的label
				checkedValueList: [], // 选中的项的value列表
				tempCheckOptionsVal: [], // 临时[label, label]列表
				
				checkboxStyle: {
					padding: '24rpx 30rpx',
					paddingBottom: '24rpx'	// vue有做合并 ?
				}
			}
		},
		watch: {
			value: {
				async handler(newVal, oldVal) {
					// "2,3,4" => [2,3,4]
					// console.log("newVal: ", newVal, "oldVal:", oldVal)
					const value = newVal || '';
					this.checkedValueList = value.split(this.separator)
					this.checkOptionsVal = [];
					await this.loadDictOptions();
					this.list.forEach(item => {
						this.checkedValueList.indexOf(item.value) != -1 ? this.checkOptionsVal.push(item.label) : ''
					})
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
					this.list = await loadData.loadDictOptions(this.dictCode);
				}
			},
			openCheckOptions() {
				if (this.disabled) return;
				this.tempCheckOptionsVal = this.checkOptionsVal;
				this.visible = true;
				uni.hideKeyboard();
			},
			noSelectCheckOptions() {
				this.checkOptionsVal = this.tempCheckOptionsVal;
				this.handleClose();
			},
			selectCheckOptions() {
				this.checkedValueList = [];
				// console.log(this.checkOptionsVal)
				// 将list的checked值为true筛选出来
				this.list.forEach(item => {
					if (this.checkOptionsVal.indexOf(item.label) != -1) {
						this.checkedValueList.push(item.value)
					}
				})
				this.$emit('input', this.checkedValueList.join(this.separator))
				this.handleClose();
			},
			handleClose() {
				this.visible = false;
				this.$nextTick(() => {
					if (this.$refs.input) {
						uni.$u.formValidate(this.$refs.input, 'change');
					}
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import '../../libs/css/form.scss';
	.hf-form-checkbox {
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
		/deep/ .u-form-item__body__right__message {
			// 表单校验的错误提示 放左侧
			margin-left: 0 !important;
		}
	}
	
	.pop-head {
		height: 100rpx;
		padding: 0 $df;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.pop-cancel {
			color: $u-tips-color;
		}
		.pop-tt {
			font-size: $font-lg;
			font-weight: bold;
		}
		.pop-confirm {
			color: $u-primary;
		}
	}
</style>
