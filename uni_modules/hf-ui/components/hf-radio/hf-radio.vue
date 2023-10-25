<template>
	<view class="hf-radio">
		<template v-if="mode === 'radio'">
			<u-radio-group :value="value" @input="handleInput">
				<u-radio v-for="item in list" :key="item.value" :name="item.value" :label="item.label" :disabled="item.disabled"></u-radio>
			</u-radio-group>
		</template>
		<template v-else-if="mode === 'text'">
			<view class="hf-radio__text">
				<u-text
					v-for="item in list"
					:key="item.value"
					:text="item.label"
					:type="(item.value === value && !item.disabled) ? 'primary' : ''"
					:color="item.disabled ? disabledColor : undefined"
					@click="handleInput(item.value)"></u-text>
			</view>
		</template>
		<template v-else-if="mode === 'btn'">
			<view class="hf-radio__btn">
				<u-button
					v-for="item in list"
					:key="item.value"
					:type="item.value === value ? 'primary' : 'info'"
					:text="item.label"
					:disabled="item.disabled"
					size="small"
					@click="handleInput(item.value)"></u-button>
			</view>
		</template>
	</view>
</template>

<script>
	export default {
		name: 'HfRadio',
		props: {
			value: {
				type: [String, Number],
				default: ''
			},
			mode: {
				type: String,
				default: 'radio',
				validator: (val) => {
					return ['radio', 'text', 'btn'].includes(val);
				}
			},
			options: {	// 选项 格式: {label: '', value: '', disabled: false}
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
			keyDisabled: {
				// 控制禁用的字段
				type: String,
				default: 'disabled'
			}
		},
		// #ifdef MP-WEIXIN
		options: {
			styleIsolation: 'shared'
		},
		// #endif
		data() {
			return {
				disabledColor: uni.$u.config.color['u-disabled-color']
			}
		},
		computed: {
			list() {
				return this.options.map(item => {
					return {
						label: item[this.keyName],
						value: item[this.keyValue],
						disabled: !!item[this.keyDisabled]
					};
				});
			}
		},
		methods: {
			handleInput(val) {
				const item = this.options.find(item => (item[this.keyValue] == val));
				if (!!item[this.keyDisabled]) return;
				this.$emit('input', val, item);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.hf-radio {
		/deep/ .u-radio + .u-radio {
			margin-left: $sm;
		}
		&__text {
			display: flex;
			.u-text {
				white-space: nowrap;
				/deep/ .u-text__value--primary {
					font-weight: bold !important;
				}
			}
			/deep/ .u-text + .u-text {
				margin-left: $df !important;
			}
		}
		&__btn {
			display: flex;
			justify-content: space-around;
			/deep/ .u-button + .u-button {
				margin-left: $df;
			}
		}
	}
</style>
