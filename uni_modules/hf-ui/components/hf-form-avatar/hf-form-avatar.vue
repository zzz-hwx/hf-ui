<template>
	<view class="hf-avatar">
		<u-form-item :label="label" :prop="prop" :required="required" :label-position="labelPosition" :border-bottom="borderBottom">
			<view class="flex-end">
				<hf-upload
					ref="hfUpload"
					:value="value"
					:maxCount="1"
					:disabled="disabled"
					:width="60"
					:height="60"
					use-before-preview
					:before-preview="beforePreview"
					use-before-read
					:before-read="beforeRead"
					:deletable="false"
					@input="handleInput">
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
			},
			beforeRead() {
				// 选择的头像前 清空图片列表
				// #ifdef H5
				this.$refs.hfUpload.deleteItem(0);
				// #endif
				// #ifdef MP-WEIXIN
				this.deleteItem(0);
				// #endif
			},
			beforePreview() {
				// 重新选择头像
				console.log('--- beforePreview --->', this.$options.name);
				// #ifdef H5
				this.$refs.hfUpload.chooseFile();
				// #endif
				// #ifdef MP-WEIXIN
				// props传入函数, 组件内调用
				// 微信小程序 this 指向当前组件实例 hf-upload
				this.chooseFile();
				// #endif
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
