<template>
	<view class="hf-search">
		<u-search
			:value="value"
			:placeholder="placeholder"
			:shape="shape"
			:bg-color="bgColor"
			:border-color="borderColor"
			:show-action="showAction"
			@input="handleInput"
			@focus="handleFocus"
			@blur="handleBlur"
			@search="handleSearch"
			@custom="handleSearch"
			@clear="handleSearch()"></u-search>
	</view>
</template>

<script>
export default {
	name: 'HfSearch',
	props: {
		value: {
			type: String,
			default: ''
		},
		placeholder: {
			type: String,
			default: ''
		},
		bgColor: {
			type: String,
			default: '#fff'
		},
		shape: {
			type: String,
			default: 'square'
		},
	},
	data() {
		return {
			focus: false
		}
	},
	computed: {
		showAction() {
			return Boolean(this.focus || this.value);
		},
		borderColor() {
			return this.focus ? '#061D4A' : '#DADADA';
		}
	},
	methods: {
		handleInput(val) {
			this.$emit('input', val);
		},
		handleFocus() {
			this.focus = true;
		},
		handleBlur() {
			this.focus = false;
		},
		handleSearch(val = '') {
			this.$emit('search', val);
		}
	}
}
</script>

<style lang="scss" scoped>
	.hf-search {
		padding: 14rpx 24rpx;
		background-color: $bg-white;
	}
</style>
