<template>
	<u-form-item :label="label" :prop="prop" :required="required" :label-position="labelPosition" :borderBottom="borderBottom">
		<template v-if="disabled">
			<view>{{ valueName }}</view>
		</template>
		<template v-else>
			<hf-radio :value="value" :options="list" @input="handleInput"></hf-radio>
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
		},
		data() {
			return {
				list: []	// {value: '', label: ''}
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
			handleInput(val) {
				this.$emit('input', val);
			}
		}
	}
</script>

<style lang="scss" scoped>
	
</style>
