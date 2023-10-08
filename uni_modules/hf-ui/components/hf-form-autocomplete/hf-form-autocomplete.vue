<template>
	<view class="hf-autocomplete">
		<u-form-item :label="label" :prop="prop" :required="required" :label-position="labelPosition" :border-bottom="borderBottom" @click="pickerShow">
			<hf-form-content ref="input" :value="valueName" :placeholder="placeholder"></hf-form-content>
		</u-form-item>
		<u-popup
			:show="visible"
			mode="right"
			@close="handleClose">
			<view class="u-popup-slot">
				<u-navbar
					:fixed="false"
					titleWidth="0rpx"
					@rightClick="handleClose">
					<template #left>{{ label }}</template>
					<template #right>
						<u-icon name="close"></u-icon>
					</template>
				</u-navbar>
				<hf-search v-if="search" v-model="searchForm.keyword" placeholder="请输入地址关键字" @search="handleSearch"></hf-search>
				<u-list
					:scroll-top="scrollTop"
					customStyle="flex: 1; height: 0 !important;"
					@scrolltolower="scrolltolower"
				>
					<u-list-item v-for="item in list_" :key="item[keyValue]">
						<view class="item-wrap">
							<view class="item" @click="handleConfirm(item)">
								<view class="slot">
									<slot name="item" :item="item">
										<u-text :text="item[keyName]" :type="item.selected ? 'primary' : ''"></u-text>
									</slot>
								</view>
								<template v-if="item.selected">
									<u-icon name="checkbox-mark" :size="20" color="primary"></u-icon>
								</template>
							</view>
							<u-line></u-line>
						</view>
					</u-list-item>
					<hic-tips
						ref="hicTips"
						:page="pagination.page"
						:limit="limit"
						:total="pagination.total"
						:loading="pagination.loading"
						:error="pagination.error"
						:emptyText="emptyText"
						@load="getList"
						@loadmore="loadmore"></hic-tips>
				</u-list>
			</view>
		</u-popup>
	</view>
</template>

<script>
	/**
	 * @description 
	 * 	1. 初始为空，输入关键字搜索后，显示列表
	 * 	2. 直接显示搜索列表，可输入关键字搜索 (通过 trigger-on-show 控制)
	 * 	3. 不可搜索 直接显示列表
	 */
	import mixin from '../../libs/mixins/form.js';
	export default {
		name: 'HfFormAutocomplete',
		mixins: [mixin],
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
			search: {
				// 是否显示搜索
				type: Boolean,
				default: false
			},
			triggerOnShow: {
				// 是否在展开弹框 显示列表
				type: Boolean,
				default: true
			},
			keyName: {
				// 控制显示的字段
				type: String,
				default: 'label'
			},
			keyValue: {
				// 控制取值的字段
				type: String,
				default: 'value'
			},
			defaultItem: {
				// ∵ 分页 ∴ 传入默认选中回填的对象
				type: Object,
				default: () => ({})
			},
		},
		data() {
			return {
				visible: false,
				already: false,		// 是否请求过数据
				isSearch: false,	// 是否搜索的标记 用于修改没有数据的文字提示
				searchForm: {
					keyword: ''
				},
				scrollTop: 0,
				pagination: {
					page: 1,
					total: 0,
					loading: false,
					error: false
				},
				list: []
			};
		},
		computed: {
			list_() {
				return this.list.map(item => {
					return {
						...item,
						selected: this.value === item[this.keyValue]
					};
				});
			},
			valueName() {
				const index = this.list.findIndex(item => (item[this.keyValue] == this.value));
				if (index !== -1) {
					return this.list[index][this.keyName];
				}
				if (this.defaultItem && (this.defaultItem[this.keyValue] == this.value)) {
					return this.defaultItem[this.keyName];
				}
				return '';
			},
			emptyText() {
				if (!this.search) {
					return '没有数据~~';
				}
				if (!this.triggerOnShow) {
					return this.isSearch ? undefined : '请输入地址关键字进行搜索';
				}
				return undefined;
			}
		},
		methods: {
			pickerShow() {
				if (this.disabled) return;
				this.visible = true;
				uni.hideKeyboard();
				if (!this.already) {
					if (!this.search) {	// 不显示搜索
						this.getList(true);
					} else if (this.triggerOnShow) {
						// 显示搜索 && 展开弹框 显示数据列表
						this.getList(true);
					}
				}
			},
			handleConfirm(item) {
				this.$emit('input', item[this.keyValue]);
				this.$emit('confirm', item);
				this.handleClose();
			},
			handleClose() {
				this.visible = false;
				this.$nextTick(() => {
					if (this.$refs.input) {
						uni.$u.formValidate(this.$refs.input, 'change');
					}
				});
			},
			handleSearch() {
				this.getList(true);
			},
			async getList(refresh = false) {
				if (refresh) {
					this.pagination.page = 1;
				}
				this.isSearch = Boolean(this.searchForm.keyword);
				this.pagination.loading = true;
				this.pagination.error = false;
				try {
					const params = {};
					if (this.search) {
						params.keyword = this.searchForm.keyword;
					}
					if (typeof(this.fetchList) !== 'function') {
						throw new Error('fetchList must be a function');
					}
					const res = await this.fetchList(params, {
						pageNo: this.pagination.page,
						pageSize: this.limit
					});
					if (refresh) {
						this.list = [];
						this.scrollTop = '';
						await this.nextTick();
						this.scrollTop = 0;	// 滚动到顶部
					}
					this.list.push(...res.records);
					this.pagination.total = res.total;
					this.already = true;
				} catch (e) {
					this.pagination.error = true;
				} finally {
					this.pagination.loading = false;
				}
			},
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
	.hf-autocomplete {
		.u-popup-slot {
			width: 90vw;
			height: 100vh;
			background-color: $bg-white;
			display: flex;
			flex-direction: column;
			.item-wrap {
				margin: 0 $sm;
			}
			.item {
				padding: $sm $xs;
				display: flex;
				.slot {
					flex: 1;
					width: 0;
				}
			}
		}
	}
</style>
