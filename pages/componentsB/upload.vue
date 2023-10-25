<template>
	<view class="">
		<view class="section">
			<hf-upload
				v-model="model.upload"
				label="图片"
				prop="image"
				:required="!disabled"
				:disabled="disabled"
				accept="image"
				:max-count="3"
				biz-path="image"
				:max-size="maxSize"
				:uploading.sync="uploadUploading"
			></hf-upload>
		</view>
		<u-gap></u-gap>
		<u-form ref="uForm" :model="model" :rules="rules">
			<view class="form">
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
					:uploading.sync="imageUploading"
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
			</view>
			<u-gap></u-gap>
			<view class="form">
				<hf-form-avatar
					v-model="model.avatar"
					label="头像"
					prop="avatar"
					:required="!disabled"
					:disabled="disabled"
					biz-path="avatar"
					:max-size="maxSize"
					:uploading.sync="avatarUploading"
				></hf-form-avatar>
			</view>
		</u-form>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				model: {
					upload: '',
					image: '',
					video: '',
					media: '',
					file: '',
					avatar: ''
				},
				rules: {
					// 
				},
				disabled: false,
				maxSize: 5 * 1024 * 1024, // 5M
				
				uploadUploading: false,
				imageUploading: false,
				avatarUploading: false,
			};
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
@import "~@/common/styles/form.scss";
</style>
