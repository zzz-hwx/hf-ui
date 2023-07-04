<template>
	<view>
		<map class="map" :latitude="latitude" :longitude="longitude" :markers="markers"></map>
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
				}]
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
map.map {
	width: 100vw;
	height: 90vh;
}
</style>
