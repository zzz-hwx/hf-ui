<template>
	<view class="">
		<u-gap></u-gap>
		<view class="temp-data" @click="copyData">
			<scroll-view scroll-x>
				<text class="temp-data__content">{{ info }}</text>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"temp-data",
		props: {
			info: {
				type: [Array, Object, String],
				default: () => ({})
			}
		},
		data() {
			return {
				// 
			};
		},
		methods: {
			async copyData() {
				await this.setClipboardData(this.info);
				uni.$u.toast('复制到剪贴板');
			},
			setClipboardData(data) {
				return new Promise((resolve, reject) => {
					uni.setClipboardData({
						data: JSON.stringify(data),
						success: () => {
							resolve();
						},
						fail: (err) => {
							console.log(err);
							reject(err);
						}
					});
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
.temp-data {
	padding: $df;
	background-color: $bg-white;
	&__content {
		white-space: pre;
		word-wrap: break-word;
		word-break: break-all;
	}
}
</style>