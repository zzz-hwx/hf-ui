<template>
	<view class="hf-form-datetime">
		<!-- #ifdef MP-WEIXIN -->
		<template v-if="$slots['display-section']">
			<view class="flex" @click="pickerShow">
				<slot name="display-section" :valueName="valueShow" :visible="visible"></slot>
			</view>
		</template>
		<!-- #endif -->
		<!-- #ifndef MP-WEIXIN -->
		<template v-if="$scopedSlots['display-section']">
			<view class="flex" @click="pickerShow">
				<slot name="display-section" :valueName="valueShow" :visible="visible"></slot>
			</view>
		</template>
		<!-- #endif -->
		
		<template v-else>
			<u-form-item :label="label" :prop="prop" :required="required" :label-position="labelPosition" :borderBottom="borderBottom" @click="pickerShow">
				<hf-form-content ref="input" :value="valueShow" :placeholder="placeholder"></hf-form-content>
			</u-form-item>
		</template>
		
		<u-datetime-picker
			ref="uDatetimePicker"
			:show="visible"
			:title="label"
			:value="valueTemp"
			:mode="mode"
			:min-date="minDate"
			:max-date="maxDate"
			closeOnClickOverlay
			@confirm="handleConfirm"
			@cancel="handleClose"
			@close="handleClose"></u-datetime-picker>
	</view>
</template>

<script>
	import mixin from '../../libs/mixins/form.js';
	import { formatMap, formatShowMap } from '../../libs/util/dateFormat.js';
	
	export default {
		name: 'HfFormDatetime',
		mixins: [mixin],
		props: {
			mode: {	// 展示格式
				type: String,
				default: 'datetime',
				validator: (val) => {
					return ['datetime', 'date', 'time', 'year-month'].includes(val);
				}
				// datetime 完整日期格式
				// date 日期选择
				// time 时间选择
				// year-month 年月选择
			},
			minDate: {
				type: Number,
				default: uni.$u.props.datetimePicker.minDate
			},
			maxDate: {
				type: Number,
				default: uni.$u.props.datetimePicker.maxDate
			}
		},
		data() {
			return {
				visible: false
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
				if (this.value) {
					return this.value;
				}
				return Number(new Date());
			},
			valueShow() {
				if (!this.value) return '';
				if (this.mode === 'time') {
					return this.value;	// 时间 12:24
				}
				return uni.$u.timeFormat(this.value, this.formatShow);
			}
		},
		watch: {
			value: {
				handler(val) {
					// value改变 不会触发组件u-datetime-picker改变 遂...手动触发
					this.$nextTick(() => {
						this.$refs.uDatetimePicker.init();
					});
				}
			}
		},
		methods: {
			pickerShow() {
				if (this.disabled) return;
				this.visible = true; 
				uni.hideKeyboard();
			},
			handleConfirm(event) {
				const value = uni.$u.timeFormat(event.value, this.format);
				this.$emit('input', value);
				this.handleClose();
			},
			handleClose() {
				this.visible = false;
				if (this.$refs.input) {
					this.$nextTick(() => {
						uni.$u.formValidate(this.$refs.input, 'change');
					});
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
.flex {
	display: flex;
}
</style>
