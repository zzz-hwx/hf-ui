<template>
	<view class="hf-avatar">
		<u-form-item :label="label" :prop="prop" :required="required" :label-position="labelPosition" :border-bottom="borderBottom">
			<view class="flex-end">
				<hf-upload :value="value" :maxCount="1" :disabled="disabled" :width="60" :height="60" @input="handleInput">
					<u-avatar icon="account-fill" size="60" font-size="50" bg-color="#EDEEF5" color="#586ABA"></u-avatar>
				</hf-upload>
			</view>
		</u-form-item>
	</view>
</template>

<script>
	/**
	 * @description 头像
	 */
	import mixin from '../../libs/mixins/form.js';
	export default {
		name: 'HfFormAvatar',
		mixins: [mixin],
		methods: {
			handleInput(val) {
				this.$emit('input', val);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.flex-end {
		width: 100%;
		display: flex;
		justify-content: flex-end;
		/deep/ .hf-upload__wrap {
			justify-content: flex-end;
			.hf-upload__wrap__preview {
				margin: 0;
				border-radius: 50%;
			}
		}
	}
</style>
