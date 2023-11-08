<template>
	<view class="page-test">
		<view class="top title">顶部内容</view>
		<scroll-view scroll-y>
			<u-button @click="pickerShow">打开popup</u-button>
			<u-popup ref="uPopup" :show="visible" @close="handleClose">
				<view class="popup-slot">
					<text>
						从每一个寻寻觅觅的日子里，穿行而过，看似捕手的，可能也是猎物，看似平常的，可能正是宝藏。灵魂触角，敏感或是迟钝，都有权尽情舞蹈，大千世界啊，风马牛秘密联络，肉眼所得，仅供参考。
						过去，当下，未来，未必真有界限，时间，只是行一个方便的幻觉。所以，无忧无惧，专心游戏，无牵无挂，寻宝之旅。
						广袤星河里亿万生命，何其有幸，与你一同在场，就在，这里。
						寻宝游戏演唱会
					</text>
				</view>
			</u-popup>
		</scroll-view>
		<view class="btns">
			<u-button type="primary" @click="submit">按钮按钮</u-button>
		</view>
	</view>
</template>

<!-- #ifdef APP-VUE || H5 -->
<script module="test" lang="renderjs">
	export default {
		mounted() {
			(document.querySelector('uni-page-wrapper') || document.body).appendChild(this.$refs.uPopup.$el);
		},
	}
</script>
<!-- #endif -->

<script>
	export default {
		data() {
			return {
				visible: false
			}
		},
		
		methods: {
			pickerShow() {
				this.visible = true;
			},
			handleClose() {
			  this.visible = false;
			},
			submit() {
				console.log('--- submit --->');
			}
		}
	}
</script>

<style lang="scss" scoped>
@import '@/common/styles/form.scss';
.page-test {
	height: 100vh;
	/* #ifdef H5 */
	height: calc(100vh - 44px);
	/* #endif */
	display: flex;
	flex-direction: column;
	& > scroll-view {
		flex: 1;
		height: 0;
	}
}

.popup-slot {
	padding: $df;
	background-color: #282c34;
	& > text {
		color: #fff;
		line-height: 1.5;
	}
}
</style>
