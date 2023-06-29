<template>
	<view class="">
		<view class="form">
			<u-form ref="uForm" :model="model" :rules="rules">
				<hf-form-upload
					v-model="model.image"
					label="图片"
					prop="image"
					:required="!disabled"
					:disabled="disabled"
					accept="image"
					:max-count="3"
					biz-path="image"
					:max-size="maxSize"
				></hf-form-upload>
				
				<hf-form-upload
					v-model="model.video"
					label="视频"
					prop="video"
					:required="!disabled"
					:disabled="disabled"
					accept="video"
					:max-count="1"
					biz-path="video"
					:max-size="maxSize"
				></hf-form-upload>
				
				<hf-form-upload
					v-model="model.media"
					label="图片和视频"
					prop="media"
					:required="!disabled"
					:disabled="disabled"
					accept="media"
					:max-count="3"
					biz-path="media"
					:max-size="maxSize"
				></hf-form-upload>
				
				<hf-form-upload
					v-model="model.file"
					label="文件"
					prop="file"
					:required="!disabled"
					:disabled="disabled"
					accept="file"
					:max-count="9"
					biz-path="file"
					:max-size="maxSize"
				></hf-form-upload>
			</u-form>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				model: {
					image: '',
					video: '',
					media: '',
					file: ''
				},
				rules: {
					// 
				},
				disabled: false,
				maxSize: 5 * 1024 * 1024, // 5M
			};
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
@import "~@/common/styles/form.scss";
</style>
