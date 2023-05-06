<template>
	<view class="hf-radio">
		<template v-if="mode === 'radio'">
			<u-radio-group :value="value" @input="handleInput">
				<u-radio v-for="item in options" :key="item.value" :name="item.value" :label="item.label"></u-radio>
			</u-radio-group>
		</template>
		<template v-else-if="mode === 'text'">
			<view class="hf-radio__text">
				<u-text
					v-for="item in options"
					:key="item.value"
					:type="item.value === value ? 'primary' : ''"
					:text="item.label"
					@click="handleInput(item.value)"></u-text>
			</view>
		</template>
		<template v-else-if="mode === 'btn'">
			<view class="hf-radio__btn">
				<u-button
					v-for="item in options"
					:key="item.value"
					:type="item.value === value ? 'primary' : 'info'"
					:text="item.label"
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
			options: {	// 选项 格式: {label: '', value: ''}
				type: Array,
				default: () => ([])
			}
		},
		data() {
			return {
				// 
			}
		},
		methods: {
			handleInput(val) {
				this.$emit('input', val);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.hf-radio {
		.u-radio + .u-radio {
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
			.u-text + .u-text {
				margin-left: $df !important;
			}
		}
		&__btn {
			display: flex;
			justify-content: space-around;
			.u-button + .u-button {
				margin-left: $df;
			}
		}
	}
</style>
