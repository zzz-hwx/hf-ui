<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "@/uni_modules/uview-ui/index.scss";
	
	body {
		background-color: $u-bg-color;
		font-size: $font-df;
		// color: #333333;
		font-family: Helvetica Neue, Helvetica, sans-serif;
	}
	
	.bg-white {
		background-color: $bg-white;
	}
	
	.font-xl {
		font-size: $font-xl;
	}
	.font-lg {
		font-size: $font-lg;
	}
	.font-df {
		font-size: $font-df;
	}
	.font-sm {
		font-size: $font-sm;
	}
	.font-xs {
		font-size: $font-xs;
	}
</style>
