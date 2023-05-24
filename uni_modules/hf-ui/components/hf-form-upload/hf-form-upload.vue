<template>
	<view class="hf-form-upload" v-show="!disabled || (disabled && value)">
		<!-- hf-upload 添加属性: disable-no-show-btn, 禁用状态 && 没有文件 => 不显示表单项 -->
		<u-form-item :prop="prop" :required="required" :label-position="labelPosition" :borderBottom="borderBottom">
			<template #label>
				<view class="left-content">
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
				<u-line v-if="!disabled"></u-line>
				<u-gap v-if="!disabled" height="10"></u-gap>
				<hf-upload
					:value="value"
					:disabled="disabled"
					:accept="accept"
					:max-count="maxCount"
					:max-size="maxSize"
					:biz-path="bizPath"
					disable-no-show-btn
					@input="handleInput">
					<view class="button">
						<template v-if="accept === 'image' || accept === 'media'">
							<hf-icon name="photo-square" size="44" :color="tipsColor"></hf-icon>
						</template>
						<template v-else-if="accept === 'video'">
							<hf-icon name="video-square" size="44" :color="tipsColor"></hf-icon>
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
				default: 50 * 1024 * 1024	// 50M
			}
		},
		data() {
			return {
				tipsColor: uni.$u.config.color['u-tips-color'],
				parentData: {
					// 提示文本的样式
					labelStyle: {},
				}
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
		mounted() {
			this.updateParentData();
		},
		methods: {
			handleInput(val) {
				this.$emit('input', val);
			},
			updateParentData() {
				// 获取父组件的参数
				// 此方法写在uview的全局mixin中
				this.getParentData('u-form');
			},
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
	}
</style>
