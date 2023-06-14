<template>
	<view>
		<!-- 预览文件 -->
		<web-view :src="src" :webview-styles="webviewStyles"></web-view>
	</view>
</template>

<script>
	export default {
		name: 'Preview',
		data() {
			return {
				src: '',
				webviewStyles: {
					progress: {
						color: '#F40'
					}
				}
			}
		},
		onLoad(event) {
			const query = event;
			const url = decodeURIComponent(query.url);
			// const url = 'http://storage.xuetangx.com/public_assets/xuetangx/PDF/PlayerAPI_v1.0.6.pdf';
			
			this.pdfReader(url);
			// this.webview(url);
			
			console.log(this.src);
		},
		methods: {
			pdfReader(url) {
				// https://ext.dcloud.net.cn/plugin?id=11924
				this.src = `/uni_modules/hf-ui/hybrid/html/pdf-reader/index.html?file=${encodeURIComponent(url)}`;
			},
			webview(url) {
				this.src = url;
			}
		}
	}
</script>

<style>

</style>
