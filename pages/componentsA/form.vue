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
					area: "411627",
					articleId: "8",
					avatar: "",
					birthday: "1986-05-14",
					cascader: "1-1-1-1",
					education: "3",
					fruit: "01,02,03,04,05,06,07,08,09",
					interest: "1,6,2,3,4,5,9",
					introduction: "从每一个寻寻觅觅的日子里，穿行而过，看似捕手的，可能也是猎物，看似平常的，可能正是宝藏。灵魂触角，敏感或是迟钝，都有权尽情舞蹈，大千世界啊，风马牛秘密联络，肉眼所得，仅供参考。\n过去，当下，未来，未必真有界限，时间，只是行一个方便的幻觉。所以，无忧无惧，专心游戏，无牵无挂，寻宝之旅。\n广袤星河里亿万生命，何其有幸，与你一同在场，就在，这里。",
					name: "一个好长好长好长好长好长好长的名字",
					name_: "异步校验呀...",
					nationality: "1",
					photo: "",
					sex: "1",
					tree: "2-1",
					location: "福州市闽侯县环城路145号福州市闽侯县环城路145号"
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
