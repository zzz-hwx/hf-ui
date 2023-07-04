<template>
	<view>
		<view id="container"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				latitude: 26.037806,
				longitude: 119.22,
				markers: [{
					latitude: 26.037806,
					longitude: 119.22,
					iconPath: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png'
				}, {
					latitude: 26.037806,
					longitude: 119.222,
					iconPath: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png'
				}],
				map: null
			}
		},
		mounted() {
			this.initAMap();
		},
		beforeDestroy() {
			this.map.destroy();
		},
		methods: {
			async initAMap() {
				const AMap = await MapLoader();
				this.map = new AMap.Map('container', {
					center: [this.longitude, this.latitude],	// 地图中心
					zoom: 16
				});
				this.markers.forEach((item) => {
					const marker = new AMap.Marker({
						icon: new AMap.Icon({
							image: item.iconPath,
							imageSize: [25, 34]
						}),
						position: [item.longitude, item.latitude],
						offset: new AMap.Pixel(-13, -30)
					});
					this.map.add(marker);
				});
			}
		}
	}
	
	function MapLoader() {
		window._AMapSecurityConfig = {
			securityJsCode: 'ce7897fd309110548b9b3b929cabe52e',
		}
		return new Promise((resolve, reject) => {
			if (window.AMap) {
				resolve(window.AMap);
			} else {
				var script = document.createElement('script');
				script.type = 'text/javascript';
				script.async = true;
				script.src = 'https://webapi.amap.com/maps?v=2.0&key=be10f484d85dc7714a234e9bf2ab3a91&callback=initAMap';
				script.onerror = reject;
				document.head.appendChild(script);
			}
			window.initAMap = () => {
				resolve(window.AMap);
			};
		});
	}
</script>

<style lang="scss" scoped>
#container {
	width: 100vw;
	height: 90vh;
}
</style>
