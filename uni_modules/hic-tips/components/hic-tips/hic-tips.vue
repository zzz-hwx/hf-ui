<template>
	<view class="hic-tips">
		<template v-if="loading">
			<slot name="loading">
				<template v-if="loadingOnlyText">
					<view class="line-between">
						<text class="text">{{ loadingText }}</text>
					</view>
				</template>
				<template v-else>
					<view class="iconfont" :class="loadingIcon"></view>
					<view class="border-radius"></view>
					<view class="text">{{ loadingText }}</view>
					<slot name="loading-desc"></slot>
				</template>
			</slot>
		</template>
		<template v-else-if="error">
			<slot name="error">
				<template v-if="errorOnlyText">
					<view class="line-between">
						<text class="text">{{ errorText }}</text>
					</view>
				</template>
				<template v-else>
					<view class="iconfont" :class="errorIcon"></view>
					<view class="border-radius"></view>
					<view class="text">{{ errorText }}</view>
					<button class="btn" @click="load">{{ errorBtnText }}</button>
					<slot name="error-desc"></slot>
				</template>
			</slot>
		</template>
		<template v-else-if="empty && showEmpty">
			<slot name="empty">
				<template v-if="emptyOnlyText">
					<view class="line-between">
						<text class="text">{{ emptyText }}</text>
					</view>
				</template>
				<template v-else>
					<view class="iconfont" :class="emptyIcon"></view>
					<view class="border-radius"></view>
					<text class="text">{{ emptyText }}</text>
					<slot name="empty-desc"></slot>
				</template>
			</slot>
		</template>
		<template v-else-if="finished">
			<slot name="finished">
				<template v-if="finishedOnlyText">
					<view class="line-between">
						<text class="text">{{ finishedText }}</text>
					</view>
				</template>
				<template v-else>
					<view class="iconfont" :class="finishedIcon"></view>
					<view class="border-radius"></view>
					<text class="text">{{ finishedText }}</text>
					<slot name="finished-desc"></slot>
				</template>
			</slot>
		</template>
		<template v-else>
			<!-- 数据不够一页时，无法触发页面的onReachBottom生命周期 => 点击加载下一页 -->
			<slot name="loadmore">
				<template v-if="loadMoreOnlyText">
					<view class="line-between" @click="loadMore">
						<text class="text">{{ loadMoreText }}</text>
					</view>
				</template>
				<template v-else>
					<view class="iconfont" :class="loadmoreIcon"></view>
					<view class="border-radius"></view>
					<view class="text">{{ loadMoreText }}</view>
					<button class="btn" @click="loadMore">{{ loadmoreBtnText }}</button>
					<slot name="loadmore-desc"></slot>
				</template>
			</slot>
		</template>
	</view>
</template>

<script>
	import config from './config.js';
	export default {
		name: 'HicTips',
		props: {
			page: {
				type: Number,
				default: 1
			},
			limit: {
				type: Number,
				default: 10
			},
			total: {
				type: Number,
				default: 0
			},
			loading: {
				type: Boolean,
				default: false
			},
			error: {
				type: Boolean,
				default: false
			},
			showEmpty: {
				type: Boolean,
				default: true
			},
			loadingOnlyText: {
				type: Boolean,
				default: config.loadingOnlyText
			},
			emptyOnlyText: {
				type: Boolean,
				default: config.emptyOnlyText
			},
			finishedOnlyText: {
				type: Boolean,
				default: config.finishedOnlyText
			},
			errorOnlyText: {
				type: Boolean,
				default: config.errorOnlyText
			},
			loadMoreOnlyText: {
				type: Boolean,
				default: config.loadMoreOnlyText
			},
			loadingText: {
				type: String,
				default: config.loadingText
			},
			emptyText: {
				type: String,
				default: config.emptyText
			},
			finishedText: {
				type: String,
				default: config.finishedText
			},
			errorText: {
				type: String,
				default: config.errorText
			},
			loadMoreText: {
				type: String,
				default: config.loadMoreText
			},
			errorBtnText: {
				type: String,
				default: config.errorBtnText
			},
			loadmoreBtnText: {
				type: String,
				default: config.loadmoreBtnText
			},
			loadingIcon: {
				type: String,
				default: config.loadingIcon
			},
			emptyIcon: {
				type: String,
				default: config.emptyIcon
			},
			finishedIcon: {
				type: String,
				default: config.finishedIcon
			},
			errorIcon: {
				type: String,
				default: config.errorIcon
			},
			loadmoreIcon: {
				type: String,
				default: config.loadmoreIcon
			}
		},
		data() {
			return {
				// 
			}
		},
		computed: {
			empty() {
				return this.total === 0;
			},
			finished() {
				return this.page * this.limit >= this.total;
			}
		},
		emits: ['load', 'loadmore'],
		methods: {
			load() {
				if (this.loading) return;
				// 错误 重新加载
				this.$emit('load');
			},
			loadMore() {
				if (!this.isLoadMore()) return;
				// 加载下一页
				this.$emit('loadmore');
			},
			isLoadMore() {
				// 是否可加载下一页
				if (this.finished || this.loading || this.error) return false;
				return true;
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import './iconfont.css';
	.hic-tips {
		padding: 100rpx 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		box-sizing: border-box;
		text-align: center;
		.iconfont {
			display: block;
			color: $hic-tips-main;
			font-size: $hic-tips-font;
		}
		.border-radius {
			width: 200rpx;
			height: 50rpx;
			border-radius: 50% 50% 0 0;
			border-top: 10rpx solid $hic-tips-border;
		}
		.text {
			color: $font-light;
			font-size: 35rpx;
			padding-bottom: 30rpx;
			text-align: center;
		}
		.btn {
			height: 80rpx;
			line-height: 1;
			padding: 0 80rpx;
			font-size: 32rpx;
			font-weight: bold;
			border-radius: 1000rpx;
			display: inline-flex;
			align-items: center;
			text-align: center;
			justify-content: center;
			box-sizing: border-box;
			background-image: $hic-tips-btn-bg-color;
			color: #ffffff;
			&:after {
				display: none;
			}
		}
	}
	.line-between {
		position: relative;
		&::before,
		&::after {
			content: '';
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			width: 140rpx;
			height: 2rpx;
			background-color: #dcdfe6;
		}
		&::before {
			left: calc(100% + 30rpx);
		}
		&::after {
			right: calc(100% + 30rpx);
		}
	}
</style>
