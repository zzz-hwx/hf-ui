<template>
	<view class="img-list">
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
				<template v-else>
					<view class="video-item" @click="onPreviewVideo(item)">
						<u-icon :color="primaryColor" size="26" :name="item.isVideo || (item.type && item.type === 'video') ? 'movie' : 'folder'"></u-icon>
						<text class="other-text">{{ item.isVideo || (item.type && item.type === 'video') ? '视频' : '文件' }}</text>
					</view>
					<u-overlay :show="showVideo" @click="showVideo = false">
						<view class="video-wrap" @tap.stop>
							<hf-video :videoSrc="item.url"></hf-video>
						</view>
					</u-overlay>
				</template>
			</template>
		</view>
		
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
			width: {
				type: [String, Number],
				default: uni.$u.props.upload.width
			},
			height: {
				type: [String, Number],
				default: uni.$u.props.upload.height
			},
			value: {
				type: String,
				default: ''
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
				showVideo: false,
				lists: []
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
				if (!item.isVideo) return;
				this.showVideo =  true;
			}
		}
	}
</script>

<style lang="scss" scoped>
	$hf-preview-image-width: 80px;
	$hf-preview-image-height: $hf-preview-image-width;
	
	.img-list {
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
			margin-right: 10rpx;
			.other-text {
				font-size: $font-xs;
				color: $u-tips-color;
				margin-top: 2px;
			}
		}
	}
	.video-wrap {
		margin-top: 30vh;
	}
</style>
