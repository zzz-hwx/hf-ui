<template>
	<u-form ref="uForm" :model="model" :rules="rules" :label-style="labelStyle">
		<view class="form">
			<hf-form-input
				v-model="model.name"
				label="姓名"
				prop="name"
				:required="!disabled"
				:disabled="disabled"
				placeholder="请输入"
			></hf-form-input>
			<hf-form-radio
				v-model="model.sex"
				label="性别"
				prop="sex"
				:required="!disabled"
				:disabled="disabled"
				:options="dictOptions.sex"
			></hf-form-radio>
			<hf-form-checkbox
				v-model="model.fruit"
				label="水果"
				prop="fruit"
				:required="!disabled"
				:disabled="disabled"
				placeholder="请选择"
				:options="dictOptions.fruit"
			></hf-form-checkbox>
			<hf-form-textarea
				v-model="model.introduction"
				label="简介"
				prop="introduction"
				:required="!disabled"
				:disabled="disabled"
				placeholder="请输入"
				:maxlength="500"
				count
			></hf-form-textarea>
			<hf-form-datetime
				v-model="model.birthday"
				label="生日"
				prop="birthday"
				:required="!disabled"
				:disabled="disabled"
				placeholder="请选择"
				mode="date"
			></hf-form-datetime>
			<hf-form-select
				v-model="model.education"
				label="学历"
				prop="education"
				:required="!disabled"
				:disabled="disabled"
				placeholder="请选择"
				:options="dictOptions.education"
			></hf-form-select>
			<hf-form-select
				v-model="model.nationality"
				label="国籍"
				prop="nationality"
				:required="!disabled"
				:disabled="disabled"
				placeholder="请选择"
				:options="dictOptions.nationality"
				mode="right"
				search
			></hf-form-select>
			<hf-form-select
				v-model="model.interest"
				label="兴趣爱好"
				prop="interest"
				:required="!disabled"
				:disabled="disabled"
				placeholder="请选择"
				:options="dictOptions.interest"
				mode="right"
				search
				multiple
			></hf-form-select>
			<hf-form-autocomplete
				v-model="model.articleId"
				label="分页文章列表"
				prop="articleId"
				:required="!disabled"
				:disabled="disabled"
				placeholder="请选择"
				:fetch-list="fetchArticleList"
				key-name="title"
				key-value="id"
				search
			>
				<template v-slot:item="{ item }">
					<u-text :text="item.title" bold></u-text>
					<u-text :text="item.content" type="info"></u-text>
				</template>
			</hf-form-autocomplete>
			<hf-form-area
				v-model="model.area"
				label="省市县"
				prop="area"
				:required="!disabled"
				:disabled="disabled"
				placeholder="请选择"
			></hf-form-area>
			<hf-form-cascader
				v-model="model.cascader"
				label="区域"
				prop="cascader"
				:required="!disabled"
				:disabled="disabled"
				placeholder="请选择"
				:options="cascaderOptions"
			></hf-form-cascader>
			<hf-form-tree
				v-model="model.tree"
				label="树形区域"
				prop="tree"
				:required="!disabled"
				:disabled="disabled"
				placeholder="请选择"
				:options="cascaderOptions"
			></hf-form-tree>
			<hf-form-upload
				v-model="model.photo"
				label="图片"
				prop="photo"
				:required="!disabled"
				:disabled="disabled"
			></hf-form-upload>
			<hf-form-avatar
				v-model="model.avatar"
				label="头像"
				prop="avatar"
				:required="!disabled"
				:disabled="disabled"
			></hf-form-avatar>
			<!-- #ifndef H5 -->
			<hf-form-location
				v-model="model.location"
				label="地点"
				prop="location"
				:disabled="disabled"
				placeholder="请选择"
				initialize-location
				:latitude.sync="model.latitude"
				:longitude.sync="model.longitude"
			></hf-form-location>
			<!-- #endif -->
			<hf-form-input
				v-model="model.name_"
				label="异步校验"
				prop="name_"
				:required="!disabled"
				:disabled="disabled"
				placeholder="请输入"
			></hf-form-input>
			
			<!-- :borderBottom="false" -->
		</view>
	</u-form>
</template>

<script>
	import formMixin from '@/mixins/form.js';
	export default {
		name: 'BasicInfo',
		mixins: [formMixin],
		data() {
			return {
				model: {
					name: '',
					introduction: '',
					// sex: '1',
					latitude: '119.21183303843688',
					longitude: '26.043699914865964'
				},
				rules: {
					name: [{ type: 'string', required: true, message: '请输入', trigger: ['blur', 'change'] }],
					sex: [{ type: 'string', required: true, message: '请选择', trigger: ['change'] }],
					fruit: [
						{ type: 'string', required: true, message: '请选择', trigger: ['change'] },
						{
							validator: (rule, value, callback) => {
								if (!value) return false;
								const arr = value.split(',');
								return arr.length <= 2;
							},
							message: '最多选择两项..',
							trigger: ['change'],
						}
					],
					introduction: [
						{ type: 'string', required: true, message: '请输入', trigger: ['blur', 'change'] },
						{ type: 'string', max: 500, message: '最多不能超过500个字符', trigger: ['blur', 'change'] },
					],
					birthday: [{ type: 'string', required: true, message: '请选择', trigger: ['change'] }],
					education: [{ type: 'string', required: true, message: '请选择', trigger: ['change'] }],
					nationality: [{ type: 'string', required: true, message: '请选择', trigger: ['change'] }],
					interest: [{ type: 'string', required: true, message: '请选择', trigger: ['change'] }],
					articleId: [{ type: 'string', required: true, message: '请选择', trigger: ['change'] }],
					area: [{ type: 'string', required: true, message: '请选择', trigger: ['change'] }],
					cascader: [{ type: 'string', required: true, message: '请选择', trigger: ['change'] }],
					tree: [{ type: 'string', required: true, message: '请选择', trigger: ['change'] }],
					photo: [{ type: 'string', required: true, message: '请选择', trigger: ['change'] }],
					avatar: [{ type: 'string', required: true, message: '请选择', trigger: ['change'] }],
					
					name_: [
						{ type: 'string', required: true, message: '请输入', trigger: ['blur', 'change'] },
						{
							asyncValidator: (rule, value, callback) => {
								setTimeout(() => {
									// 模拟异步请求
									const arr = ['abc', '123'];
									if (arr.includes(value)) {
										console.log('异步姓名重复判断结束');
										callback(new Error('姓名重复'));
									} else {
										callback();
									}
								}, 1000);
							},
							trigger: ['blur'],
						}
					]
				},
				dictOptions: {
					sex: [
						{ value: '1', label: '男' },
						{ value: '2', label: '女' },
					],
					fruit: [
						{ value: '01', label: '苹果' },
						{ value: '02', label: '梨' },
						{ value: '03', label: '香蕉' },
						{ value: '04', label: '葡萄' },
						{ value: '05', label: '草莓' },
						{ value: '06', label: '荔枝' },
						{ value: '07', label: '樱桃' },
						{ value: '08', label: '车厘子' },
						{ value: '09', label: '榴莲' },
						{ value: '10', label: '火龙果' },
					],
					education: [
						{ value: '1', label: '博士' },
						{ value: '2', label: '研究生' },
						{ value: '3', label: '本科' },
						{ value: '4', label: '大专' },
					],
					nationality: [
						{ value: '1', label: '中国' },
						{ value: '2', label: '美国' },
						{ value: '3', label: '英国' },
						{ value: '4', label: '巴基斯坦' },
					],
					interest: [
						{ value: '1', label: '羽毛球' },
						{ value: '2', label: '跑步' },
						{ value: '3', label: '爬山' },
						{ value: '4', label: '游泳' },
						{ value: '5', label: '瑜伽' },
						{ value: '6', label: '舞蹈' },
						{ value: '7', label: '足球' },
						{ value: '8', label: '篮球' },
						{ value: '9', label: '排球' },
						{ value: '10', label: '攀岩' },
						{ value: '11', label: '钓鱼' },
					]
				},
				cascaderOptions: [{
						value: '1',
						text: '一级 1',
						children: [{
							value: '1-1',
							text: '二级 1-1',
							children: [{
								value: '1-1-1',
								text: '三级 1-1-1',
								children: [{
									value: '1-1-1-1',
									text: '四级 1-1-1-1'
								}]
							}]
						}, {
							value: '1-2',
							text: '二级 1-2',
						}]
					}, {
						value: '2',
						text: '一级 2',
						children: [{
							value: '2-1',
							text: '二级 2-1'
						}]
					}
				]
			};
		},
		methods: {
			async fetchArticleList(param, pagination) {
				// param = { keyword: '搜索关键字' }, pagination = { pageNo: 1, pageSize: 20 }
				const records = [];
				for (let i = 0; i < pagination.pageSize; i++) {
					const id = (pagination.pageNo - 1) * pagination.pageSize + i + 1;
					records.push({ id: String(id), title: `文章${id}`, content: '文章内容文章内容文章内容...' });
				}
				return {
					total: 160,
					records
				}
			},
			reset() {
				this.$refs.uForm.resetFields();		// 将所有字段值重置为初始值并移除校验结果
				this.$refs.uForm.clearValidate();	// 清空校验结果
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/common/styles/form.scss';
</style>
