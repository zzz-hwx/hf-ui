<template>
	<u-list class="hf-list-only" :scroll-top="scrollTop" :customStyle="listStyle" scroll-with-animation @scrolltolower="scrolltolower">
		<template v-if="$slots['list-top']">
			<!-- list-top 列表上方 -->
			<slot name="list-top"></slot>
		</template>
		<template v-if="$scopedSlots.list">
			<!-- list 整个列表替换 (带删除的列表) -->
			<slot name="list" :list="list"></slot>
		</template>
		<template v-if="$scopedSlots.item">
			<!-- item 常规 自定义列表每一项样式 -->
			<u-list-item v-for="item in list" :key="item[rowKey]">
				<slot name="item" :item="item"></slot>
			</u-list-item>
		</template>
		<hic-tips
			ref="hicTips"
			:page="pagination.page"
			:limit="limit === 0 ? pagination.total : limit"
			:total="pagination.total"
			:loading="pagination.loading"
			:error="pagination.error"
			:emptyText="emptyText"
			@load="getList"
			@loadmore="loadmore">
			<!-- ??? 空提示....和UI一致 -->
			<template v-if="$slots.empty" #empty>
				<!-- empty 自定义空提示 -->
				<slot name="empty"></slot>
			</template>
		</hic-tips>
	</u-list>
</template>

<script>
	/**
	 * @description 列表滚动组件
	 */
	import { promiseDebounce } from '@/uni_modules/hic-plugin';
	export default {
		name: 'HfListOnly',
		props: {
			fetchList: {
				// 获取数据的函数
				// 返回promise {total: 0, records: []}
				type: Function
			},
			limit: {
				// 分页每页条数 0-不分页
				type: Number,
				default: 20
			},
			listStyle: {	// u-list 样式
				type: Object
			},
			emptyText: {
				type: String,
				default: '暂未查询到相关信息'
			},
			rowKey: {	// 唯一标识
				type: String,
				default: 'id'
			},
			initNoFetchList: {
				// 初始化 不获取数据
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				scrollTop: 0,
				pagination: {
					page: 1,
					total: 0,
					loading: false,
					error: false
				},
				list: []
			}
		},
		created() {
			if (!this.initNoFetchList) {
				this.getList(true);
			}
		},
		methods: {
			getList: promiseDebounce(async function (refresh = false) {
				if (refresh) {
					this.pagination.page = 1;
				}
				this.pagination.loading = true;
				this.pagination.error = false;
				try {
					if (typeof(this.fetchList) !== 'function') {
						throw new Error('fetchList must be a function');
					}
					const res = await this.fetchList({
						pageNo: this.pagination.page,
						pageSize: this.limit === 0 ? -1 : this.limit	// limit == 0 不分页
					});
					if (refresh) {
						this.list = [];
						this.scrollTop = '';
						await this.nextTick();
						this.scrollTop = 0;	// 滚动到顶部
					}
					if (res && Array.isArray(res.records)) {
						this.list.push(...res.records);
						this.pagination.total = res.total;
					}
				} catch (e) {
					console.log(e);
					this.pagination.error = true;
				} finally {
					this.pagination.loading = false;
					uni.stopPullDownRefresh();
				}
			}),
			loadmore() {
				this.pagination.page++;
				this.getList();
			},
			scrolltolower() {
				// 页面上拉触底事件的处理函数
				if (!this.$refs['hicTips'].isLoadMore()) return;
				this.loadmore();
			},
			nextTick() {
				return new Promise((resolve) => {
					this.$nextTick(resolve);
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.hf-list-only {
		flex: 1;
		height: 0 !important;
		/deep/ .u-cell {
			background-color: $bg-white;
		}
	}
</style>