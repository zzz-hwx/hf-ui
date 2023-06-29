<template>
	<view class="page-form">
		<scroll-view scroll-y>
			<view class="title">编辑</view>
			<basic-info ref="basicInfo" :info="basicInfo"></basic-info>
			
			<view class="title">详情</view>
			<basic-info :info="basicInfo" disabled></basic-info>
		</scroll-view>
		<view class="btns">
			<u-button @click="reset">重置</u-button>
			<u-button type="primary" @click="submit">提交</u-button>
		</view>
	</view>
</template>

<script>
	import BasicInfo from './components/basic-info.vue';
	export default {
		name: 'Form',
		components: {
			BasicInfo
		},
		data() {
			return {
				basicInfo: {
					// area: "411627",
					// articleId: "8",
					// avatar: "",
					// birthday: "1986-05-14",
					// cascader: "1-1-1-1",
					// education: "3",
					// fruit: "1,3",
					// interest: "1,6",
					// introduction: "广袤星河里亿万生命，何其有幸，与你一同在场，就在，这里。",
					// name: "邢牧",
					// name_: "异步校验呀...",
					// nationality: "1",
					// photo: "",
					// sex: "1",
					// tree: "2-1",
				}
			}
		},
		methods: {
			reset() {
				this.$refs.basicInfo.reset();
			},
			async submit() {
				const model = await this.$refs.basicInfo.validate();
				console.log('--- 提交表单 --->', uni.$u.deepClone(model));
				uni.$u.toast('提交表单');
				this.basicInfo = model;
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/common/styles/form.scss';
	.page-form {
		height: 100vh;
		/* #ifdef H5 */
		height: calc(100vh - 44px);
		/* #endif */
		display: flex;
		flex-direction: column;
		scroll-view {
			flex: 1;
			height: 0;
		}
	}
</style>
