<template>
	<view class="hf-list">
		<!-- top 顶部固定 -->
		<slot name="top"></slot>
		
		<hf-list-only
			ref="hfListOnly"
			:fetch-list="fetchList"
			:limit="limit"
			:list-style="listStyle"
			:empty-text="emptyText"
			:row-key="rowKey"
			:init-no-fetch-list="initNoFetchList">
			
			<!-- <slot></slot> -->
			
			<!-- 处理 scopedSlots -->
			<template v-if="$scopedSlots.list" #list="scoped">
				<!-- list 整个列表替换 (带删除的列表) -->
				<slot name="list" v-bind="scoped"></slot>
			</template>
			<template v-if="$scopedSlots.item" #item="scoped">
				<!-- item 常规 自定义列表每一项样式 -->
				<slot name="item" v-bind="scoped"></slot>
			</template>
			
			<!-- <template v-for="slotName in scopedSlotsKeys" :slot="slotName">
				scoped {{ slotName }}
				<slot :name="slotName"></slot>
			</template> -->
			<!-- <template v-for="slotName in scopedSlotsKeys" #[slotName]="scoped">
				list {{ slotName }}
				<slot :name="slotName" v-bind="scoped"></slot>
			</template> -->
			
			<!-- 处理 slots -->
			<template v-for="slotName in slotsKeys" v-slot:[slotName]>
				<slot :name="slotName"></slot>
			</template>
		</hf-list-only>
		
		<!-- bottom 底部固定 -->
		<slot name="bottom"></slot>
	</view>
</template>

<script>
	/**
	 * @description 列表页
	 * 可自定义上下固定区域
	 */
	export default {
		name: 'HfList',
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
				type: String
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
				// 内部使用的 slots 不再处理
				usedSlots: ['top', 'bottom']
			};
		},
		computed: {
			scopedSlotsKeys() {
				return Object.keys(this.$scopedSlots).filter(key => !this.usedSlots.includes(key));
			},
			slotsKeys() {
				return Object.keys(this.$slots).filter(key => !this.usedSlots.includes(key));
			}
		},
		methods: {
			async getList(...args) {
				if (!this.$refs.hfListOnly) {
					await this.nextTick();
				}
				await this.$refs.hfListOnly.getList(...args);
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
	.hf-list {
		height: 100vh;
		display: flex;
		flex-direction: column;
	}
</style>
