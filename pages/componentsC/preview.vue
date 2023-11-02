<template>
	<view class="page">
		<hf-preview :value="img"></hf-preview>
	</view>
</template>

<script>
	export default {
		data() {
			const arr = [
				'https://web-assets.dcloud.net.cn/unidoc/zh/hx.png',
				'https://web-assets.dcloud.net.cn/unidoc/zh/uni.png',
				'https://web-assets.dcloud.net.cn/unidoc/zh/uniCloud.png',
				'https://web-assets.dcloud.net.cn/unidoc/zh/s.png'
			]
			return {
				img: arr.join(','),
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
.page {
	background-color: $bg-white;
}
</style>
