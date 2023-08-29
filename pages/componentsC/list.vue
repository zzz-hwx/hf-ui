<template>
	<view class="page">
		<hf-search v-model="searchForm.keyword" placeholder="请输入关键字" @search="refreshList"></hf-search>
		<hf-list-only
			ref="hfList"
			:fetch-list="getList"
			style="flex: 1; height: 0;"
		>
			<template v-slot:item="{ item }">
				<u-cell :title="item.title" :label="item.content"></u-cell>
			</template>
		</hf-list-only>
	</view>
</template>

<script>
	import pageMixin from '@/mixins/page.js';
	export default {
		mixins: [pageMixin],
		data() {
			return {
				searchForm: {
					keyword: ''
				}
			};
		},
		// #ifdef MP-WEIXIN
		mounted() {
			this.$refs.hfList.setFetchList(this.getList);
		},
		// #endif
		methods: {
			getList(pagination) {
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
