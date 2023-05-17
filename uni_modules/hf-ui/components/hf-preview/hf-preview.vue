<template>
	<view class="hf-preview">
		<view
			class="img-item"
			v-for="(item, index) in lists" :key="index">
			<template>
				<image v-if="item.isImage"
					:src="item.thumb || item.url"
					:mode="imageMode"
					:style="[{
						width: $u.addUnit(width),
						height: $u.addUnit(height)
					}]"
					@click="onPreviewImage(item)"></image>
				<template v-else-if="item.isVideo || (item.type && item.type === 'video')">
					<view class="video-item" @click="onPreviewVideo(item)">
						<u-icon :color="primaryColor" size="26" name="movie"></u-icon>
						<text class="other-text">视频</text>
					</view>
				</template>
				<template v-else>
					<view class="video-item">
						<u-icon :color="primaryColor" size="26" name="folder"></u-icon>
						<text class="other-text">文件</text>
					</view>
				</template>
			</template>
		</view>
		
		<u-overlay :show="previewVideoVis" @click="previewVideoVis = false">
			<view class="hf-preview__overlay">
				<view class="hf-preview__overlay__video" @tap.stop>
					<hf-video :videoSrc="previewVideoUrl"></hf-video>
				</view>
			</view>
		</u-overlay>
	</view>
</template>

<script>
	import HfVideo from '../hf-upload/hf-video.vue'
	import loadData from '../../libs/util/loadData.js';
	export default {
		name: 'HfPreview',
		components: {
			HfVideo
		},
		props: {
			value: {
				type: String,
				default: ''
			},
			width: {
				type: [String, Number],
				default: uni.$u.props.upload.width
			},
			height: {
				type: [String, Number],
				default: uni.$u.props.upload.height
			},
			separator: {	// 分隔符
				type: String,
				default: ','
			},
			imageMode: {
				type: String,
				default: uni.$u.props.upload.imageMode
			},
		},
		data() {
			return {
				primaryColor: uni.$u.config.color['u-primary'],
				lists: [],
				previewVideoVis: false,
				previewVideoUrl: '',
			}
		},
		watch: {
			value: {
				async handler(val) {
					let lists = [];
					if (val && val.length) {
						lists = val.split(this.separator);
					}
					const absList = await loadData.getAbsPath(val);
					this.lists = lists.map((path, index) => {
						const i = this.lists.findIndex(item =>(item.path === path));
						if (i !== -1) {
							return this.lists[i];
						}
						return {
							url: absList[index].url || '',
							path,
							isImage: uni.$u.test.image(absList[index].name),
							isVideo: uni.$u.test.video(absList[index].name),
							deletable: this.deletable,
						};
					});
				},
				immediate: true
			}
		},
		methods: {
			onPreviewImage(item) {
				// 预览图片
				console.log('onPreviewImage', item);
				if (!item.isImage) return;
				uni.previewImage({
					// 先filter找出为图片的item，再返回filter结果中的图片url
					urls: this.lists.filter((item) => this.accept === 'image' || uni.$u.test.image(item.url || item.thumb)).map((item) => item.url || item.thumb),
					current: item.url || item.thumb,
					fail: () => {
						uni.$u.toast('预览图片失败');
					}
				});
			},
			onPreviewVideo(item) {
				this.previewVideoVis =  true;
				this.previewVideoUrl = item.url;
			}
		}
	}
</script>

<style lang="scss" scoped>
	$hf-preview-image-width: 80px;
	$hf-preview-image-height: $hf-preview-image-width;
	
	.hf-preview {
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
		.img-item {
			width: $hf-preview-image-width;
			height: $hf-preview-image-height;
			margin-right: 10rpx;
		}
		.video-item {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			width: $hf-preview-image-width;
			height: $hf-preview-image-height;
			background-color: $u-bg-color;
			border: 1px solid rgba($color: $u-border-color, $alpha: 0.3);
			margin-right: 10rpx;
			.other-text {
				font-size: $font-xs;
				color: $u-tips-color;
				margin-top: 2px;
			}
		}
		&__overlay {
			height: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			&__video {
				width: 100vw;
				height: calc(100vw *9 / 16);
			}
		}
	}
</style>
