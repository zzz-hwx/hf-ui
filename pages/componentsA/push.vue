<template>
	<view>
		<!-- #ifdef APP-PLUS -->
		<view class="cid" @click="copyCid">
			<text>{{ cid }}</text>
		</view>
		<u-gap></u-gap>
		<u-button text="创建本地通知栏消息" @click="handleTest"></u-button>
		<u-button text="获取全部通知" @click="handleAll"></u-button>
		<u-button text="清空数据" @click="handleClear"></u-button>
		<!-- #endif -->
		<u-gap></u-gap>
		<view class="temp-data" @click="copyPushData">
			<scroll-view scroll-x>
				<text class="temp-data__content">{{ pushData }}</text>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import { formatMap } from '@/uni_modules/hf-ui/libs/util/dateFormat.js';
	export default {
		data() {
			return {
				cid: '',
				pushData: [{aaa: 'aaa', bbb: 123}],
			};
		},
		onLoad() {
			// #ifdef APP-PLUS
			this.getCid();
			// #endif
			uni.$on('onPushMessage', this.onPushMessage);
		},
		onUnload() {
			uni.$off('onPushMessage', this.onPushMessage);
		},
		methods: {
			// #ifdef APP-PLUS
			getCid() {
				// 获取推送cid
				uni.getPushClientId({
					success: (res) => {
						console.log(res.cid);
						this.cid = res.cid;
					},
					fail: (err) => {
						console.log(err);
					}
				});
			},
			handleTest() {
				// 创建本地通知栏消息
				uni.createPushMessage({
					title: '本地通知栏消息',
					content: '广袤星河里亿万生命，何其有幸，与你一同在场',
					payload: { payloadKey: 'payload key 111' },
					success: (res) => {
						console.log('--- createPushMessage --->', res);
					},
					fail: (err) => {
						console.log('--- createPushMessage fail --->', err);
					}
				});
			},
			handleAll() {
				uni.$emit('onResendAllData');
			},
			handleClear() {
				this.pushData.splice(0);
			},
			onPushMessage(res) {
				console.log(res);
				if (Array.isArray(res)) {
					// 获取全部通知
					this.pushData.push(...res);
				} else {
					// 收到推送消息
					this.pushData.push({
						...res,
						_time: uni.$u.timeFormat(Date.now(), formatMap.get('datetime'))
					});
					
					const payload = (res.data || {}).payload;
					if (typeof(payload.type) === 'undefined') {
						// ??? 是否可以通过payload里的特定参数 判断是否处理
						return;
					}
					if (res.type === 'click') {
						this.disposeClickMessage(res);
					} else if (res.type === 'receive') {
						this.disposeReceiveMessage(res);
					}
				}
			},
			disposeClickMessage(res) {
				// click 处理通知消息 || 透传消息创建的通知栏消息
				uni.showModal({	// ??? 各种消息的处理....
					title: '处理push通知',
					content: JSON.stringify((res.data || {}).payload)
				});
			},
			disposeReceiveMessage(res) {
				// receive 处理透传消息 -> 创建本地通知栏消息
				uni.createPushMessage({
					title: '接收到透传消息',
					content: '您有1条新的待办件；若消息未查看，又有新的待办件转入，则待办件数量累计',
					payload: (res.data || {}).payload
				});
			},
			// #endif
			async copyCid() {
				await this.setClipboardData(this.cid);
				uni.$u.toast('cid 复制到剪贴板');
			},
			async copyPushData() {
				await this.setClipboardData(this.pushData);
				uni.$u.toast('pushData 复制到剪贴板');
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
.temp-data,
.cid {
	padding: $df;
	background-color: $bg-white;
}
.temp-data {
	&__content {
		white-space: pre;
		word-wrap: break-word;
		word-break: break-all;
	}
}
</style>