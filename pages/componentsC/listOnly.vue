<template>
	<view class="page">
		<hf-search v-model="searchForm.keyword" placeholder="请输入关键字" @search="refreshList"></hf-search>
		<hf-list-only
			ref="hfList"
			:fetch-list="fetchList"
			style="flex: 1; height: 0;"
		>
			<template v-slot:list="{ list }">
				<view v-for="(item, index) in list" :key="index">
					<!-- <u-cell :title="item.title" :label="item.content"></u-cell> -->
					<view style="background-color: #fff; padding: 30rpx; position: relative;">
						<view class="">{{ item.title }}</view>
						<view class="">{{ item.content }}</view>
						<view style="position: absolute; top: 0; right: 0;">绝对定位</view>
					</view>
				</view>
			</template>
		</hf-list-only>
		<view style="position: absolute; top: 0; right: 0; background-color: #abcdef;">页面的绝对定位</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchForm: {
					keyword: ''
				}
			};
		},
		mounted() {
			// #ifdef MP-WEIXIN
			this.$refs.hfList.setFetchList(this.fetchList);
			// #endif
		},
		onShow() {
			this.refreshList();
		},
		onPullDownRefresh() {
			this.refreshList();
		},
		methods: {
			refreshList() {
				this.$refs.hfList && this.$refs.hfList.getList(true);
			},
			fetchList(pagination) {
				const params = {
					keyword: this.searchForm.keyword,
					...pagination
				}
				const records = [];
				for (let i = 0; i < pagination.pageSize; i++) {
					const id = (pagination.pageNo - 1) * pagination.pageSize + i + 1;
					records.push({ id, title: `文章${id}`, content: '文章内容文章内容文章内容...' });
				}
				return {
					total: 160,
					records
				};
			}
		}
	}
</script>

<style lang="scss" scoped>
.page {
	height: 100vh;
	/* #ifdef H5 */
	height: calc(100vh - 44px);
	/* #endif */
	display: flex;
	flex-direction: column;
}
</style>

