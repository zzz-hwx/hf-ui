<template>
	<view class="hf-video">
		<video
			id="myVideo"
			class="video"
			:src="videoUrl"
			:title="videoTitle"
			controls="true"
			page-gesture="true"
			object-fit="contain"
			show-mute-btn="true"
			enable-play-gesture="true"
			vslide-gesture="true"
			@error="videoErrorCallback"
			@waiting="videoWaiting"
			@loadedmetadata="videoLoadOk"
		></video>
	</view>
</template>

<script>
	export default {
		name: 'videoPlayer',
		props: {
			title: {
				type: String,
				default: ''
			},
			firstPic: {
				type: String,
				default: ''
			},
			videoType: {
				type: String,
				default: ''
			},
			videoSrc: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				videoUrl: this.videoSrc,
				firstImg: this.firstPic,
				videoTitle: this.title
			};
		},
		watch: {
			videoSrc() {
				this.setVideoUrl();
			}
		},
		mounted() {
			this.setVideoUrl();
		},

		onReady: function(res) {
			// #ifndef MP-ALIPAY
			this.videoContext = uni.createVideoContext('myVideo');
			// #endif
		},
		methods: {
			setVideoUrl() {
				console.log(this.videoSrc)
				// uni.setNavigationBarTitle({
				// 	title: this.title
				// });
				this.videoUrl = this.videoSrc;
				this.firstImg = this.firstPic;
				this.videoTitle = this.title;
			},
			videoErrorCallback(e) {
				if (!e.target.errMsg) return;
				uni.showModal({
					content: e.target.errMsg,
					showCancel: false
				});
			},
			videoWaiting() {
				// uni.showLoading({
				//     title: '加载中'
				// });
			},
			videoLoadOk() {
				// uni.hideLoading();
			}
		}
	};
</script>

<style lang="scss" scoped>
.hf-video,
video.video {
	width: 100%;
	height: 100%;
}
</style>
