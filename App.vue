<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// #ifdef APP-PLUS
			const msgData = [];
			// 启动监听推送消息事件
			uni.onPushMessage((res) => {
				console.log('--- 收到推送消息 --->', res);
				uni.$emit('onPushMessage', res);
				msgData.push(res);
			});
			
			uni.$on('onResendAllData', () => {
				// 监听 重新发送全部数据
				uni.$emit('onPushMessage', msgData);
			});
			// #endif
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
	/* 每个页面公共css */
	@import "@/uni_modules/uview-ui/index.scss";
	
	body {
		background-color: $u-bg-color;
		font-size: $font-df;
		// color: #333333;
		font-family: Helvetica Neue, Helvetica, sans-serif;
	}
	
	/**
	 * 一些共用样式
	 */
	.sub-title {
		padding-top: $sm;
		padding-bottom: $sm;
		color: $u-primary;
	}
	.section {
		padding: $df;
		background-color: $bg-white;
	}
	.flex {
		display: flex;
	}
	
	.bg-white {
		background-color: $bg-white;
	}
	
	
	/**
	 * 字体样式
	 */
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
	
	/**
	 * 一些边距样式
	 */
	.padding-sm {
		padding: $sm;
	}
	.p-tb-xs {
		padding-top: $xs;
		padding-bottom: $xs;
	}
	.p-tb-sm {
		padding-top: $sm;
		padding-bottom: $sm;
	}
	.p-l-xs {
		padding-left: $xs;
	}
	.p-r-xs {
		padding-right: $xs;
	}

	/**
	 * 重写uni样式
	 */
	uni-page-head .uni-page-head {
		z-index: 970;
	}
</style>
