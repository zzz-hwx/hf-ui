<template>
	<u-form-item :label="label" :prop="prop" :required="required" :label-position="labelPosition" :borderBottom="borderBottom">
		<template v-if="disabled">
			<view>{{ valueName }}</view>
		</template>
		<template v-else>
			<hf-radio
				:value="value"
				:options="list"
				:key-name="keyName"
				:key-value="keyValue"
				:key-disabled="keyDisabled"
				@input="handleInput"
			></hf-radio>
		</template>
	</u-form-item>
</template>

<script>
	import mixin from '../../libs/mixins/form.js';
	import loadData from '../../libs/util/loadData.js';
	export default {
		name: 'HfFormRadio',
		mixins: [mixin],
		props: {
			dictCode: {	// 字典code
				type: String,
				default: ''
			},
			options: {
				type: Array,
				default: () => ([])
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
			keyDisabled: {
				// 控制禁用的字段
				type: String,
				default: 'disabled'
			}
		},
		data() {
			return {
				list: []
			}
		},
		watch: {
			options: {
				handler(val) {
					if (!this.dictCode) {
						this.list = uni.$u.deepClone(val);
					}
				},
				immediate: true
			}
		},
		computed: {
			valueName() {
				// 选中的选项名
				const item = this.list.find(item => (item.value == this.value));
				if (!item) return '';
				return item.label;
			}
		},
		created() {
			this.loadDictOptions();
		},
		methods: {
			async loadDictOptions() {
				if (this.dictCode) {
					this.list = await loadData.loadDictOptions(this.dictCode);
				}
			},
			handleInput(val, item) {
				this.$emit('input', val, item);
			}
		}
	}
</script>

<style lang="scss" scoped>
	
</style>
