<template>
	<view class="padding-sm">
		<view class="padding-sm">
			<text>
				mask 的 z-index 原先 为 970
				两层弹框叠加 mask 的 z-index 不够，下一层弹框的内容依旧可以点击
				设置 mask 和 popup 弹框一样的 z-index 值(975)
				同层相互覆盖 解决bug
			</text>
		</view>
		
		<u-button text="打开右侧弹框" @click="rightShow"></u-button>
		
		<u-popup :show="rightVis" mode="right" @close="rightHide">
			<view class="padding-sm" style="width: 80vw;">
				<u-button text="关闭当前弹框" @click="rightHide"></u-button>
				<u-button text="打开底部弹框" @click="bottomShow"></u-button>
			</view>
		</u-popup>
		
		<u-popup :show="bottomVis" mode="bottom" @close="bottomHide">
			<view class="padding-sm" style="height: 40vw;">
				<u-button text="关闭当前弹框" @click="bottomHide"></u-button>
				<u-button text="打开上方弹框" @click="topShow"></u-button>
			</view>
		</u-popup>
		
		<u-popup :show="topVis" mode="top" @close="topHide">
			<view class="padding-sm" style="height: 40vw;">
				<u-button text="关闭当前弹框" @click="topHide"></u-button>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				rightVis: false,
				bottomVis: false,
				topVis: false,
			};
		},
		methods: {
			rightShow() {
				this.rightVis = true;
			},
			rightHide() {
				this.rightVis = false;
			},
			bottomShow() {
				this.bottomVis = true;
			},
			bottomHide() {
				this.bottomVis = false;
			},
			topShow() {
				this.topVis = true;
			},
			topHide() {
				this.topVis = false;
			}
		}
	}
</script>

<style lang="scss" scoped>
.u-button + .u-button {
	margin-top: $sm;
}
</style>
