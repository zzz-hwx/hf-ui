<template>
	<view class="hf-form-upload">
		<u-form-item :prop="prop" :required="required" :label-position="labelPosition" :borderBottom="borderBottom">
			<template #label>
				<view class="left-content" :style="labelStyle">
					<text v-if="required" class="left-content__required">*</text>
					<text :style="[parentData.labelStyle]">{{ label }}</text>
					<text class="tip" v-if="!disabled">
						<slot name="tip">
							<text>文件最多支持上传{{ maxCount }}个</text>
							<text v-if="sizeShow">, 大小不超过{{ sizeShow }}</text>
						</slot>
					</text>
				</view>
			</template>
			
			<view class="wrap">
				<template v-if="!disabled">
					<u-line></u-line>
					<u-gap height="10"></u-gap>
				</template>
				<hf-upload
					ref="hfUpload"
					:value="value"
					:disabled="disabled"
					:accept="accept"
					:max-count="maxCount"
					:max-size="maxSize"
					:max-duration="maxDuration"
					:biz-path="bizPath"
					disable-no-show-btn
					:uploading="uploading"
					:uploading-text="uploadingText"
					@input="handleInput"
					@update:uploading="handleUploading"
				>
					<view class="button">
						<template v-if="accept === 'video'">
							<hf-icon name="video-square" size="44" :color="tipsColor"></hf-icon>
						</template>
						<template v-else>
							<hf-icon name="photo-square" size="44" :color="tipsColor"></hf-icon>
						</template>
					</view>
				</hf-upload>
			</view>
		</u-form-item>
	</view>
</template>

<script>
	/**
	 * @description 图片选择 + 图片上传
	 */
	import mixin from '../../libs/mixins/form.js';
	export default {
		name: 'HfFormUpload',
		mixins: [mixin],
		props: {
			labelPosition: {
				type: String,
				default: 'top'
			},
			accept: {
				type: String,
				default: 'image'
			},
			maxCount: {		// 最大选择图片的数量
				type: Number,
				default: 9
			},
			bizPath: {	// 控制文件上传的业务路径
				type: String,
				default: 'temp'
			},
			maxSize: {
				type: [String, Number],
				default: 10 * 1024 * 1024	// 10M
			},
			maxDuration: {
				// 拍摄视频最长拍摄时间，单位秒
				type: Number,
				default: uni.$u.props.upload.maxDuration
			},
			uploading: {
				// 是否上传中
				type: Boolean,
				default: false
			},
			uploadingText: {
				type: String,
				default: '文件上传中，请稍后再试'
			}
		},
		// #ifdef MP-WEIXIN
		options: {
			styleIsolation: 'shared'
		},
		// #endif
		data() {
			return {
				tipsColor: uni.$u.config.color['u-tips-color'],
			}
		},
		computed: {
			sizeShow() {
				if (this.maxSize == Number.MAX_VALUE) return '';
				if (isNaN(this.maxSize)) return '';
				const unit = ['B', 'KB', 'M', 'G'];
				let size = Number(this.maxSize);
				let index = 0;
				while ((size / 1024) > 1) {
					size /= 1024;
					index++;
				}
				return `${size}${unit[index]}`
			}
		},
		methods: {
			handleInput(val) {
				this.$emit('input', val);
				this.$nextTick(() => {
					uni.$u.formValidate(this.$refs.hfUpload, 'change');
				});
			},
			handleUploading(val) {
				this.$emit('update:uploading', val);
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '../../libs/css/form.scss';
	
	.hf-form-upload {
		.left-content {
			position: relative;
			.tip {
				padding-left: $xs;
				color: #E67D7D;
				font-size: $font-xs;
			}
		}
		.wrap {
			padding-top: $sm;
			width: 100%;
		}
		.button {
			width: 160rpx;
			height: 160rpx;
			background-color: #F5F5F5;
			display: flex;
			justify-content: center;
			align-items: center;
			image {
				width: 88rpx;
				height: 88rpx;
			}
		}
		/deep/ .u-form-item__body__right__message {
			// 表单校验的错误提示 放左侧
			margin-left: 0 !important;
		}
	}
</style>
