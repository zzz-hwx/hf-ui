<template>
	<view>
		<u-picker
			ref="uPicker"
			:show="show"
			:columns="columns"
			@confirm="confirm"
			@change="changeHandler"
		></u-picker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: true,
				options: [{
					label: '中国',
					value: 'china',
					children: [
						{ label: '深圳', value: 'shenzhen' },
						{ label: '厦门', value: 'xiamen' },
						{ label: '上海', value: 'shanghai' },
						{ label: '拉萨', value: 'lasa' },
					]
				}, {
					label: '美国',
					value: 'us',
					children: [
						{ label: '得州', value: '1' },
						{ label: '华盛顿', value: '2' },
						{ label: '纽约', value: '3' },
						{ label: '阿拉斯加', value: '4' },
					]
				}],
				columns: [
					['中国', '美国'],
					['深圳', '厦门', '上海', '拉萨']
				],
				columnData: [
					['深圳', '厦门', '上海', '拉萨'],
					['得州', '华盛顿', '纽约', '阿拉斯加']
				]
			}
		},
		computed: {
			defaultIndex() {
				return [0, 0];
			},
			// columns() {
			// 	const columns = [];
			// 	const temp = this.options;
			// 	for (let i = 0; i < this.defaultIndex.length; i++) {
			// 		// 
			// 	}
			// }
		},
		methods: {
			changeHandler(e) {
				const {
					columnIndex,
					value,
					values, // values为当前变化列的数组内容
					index,
					// 微信小程序无法将picker实例传出来，只能通过ref操作
					picker = this.$refs.uPicker
				} = e
				// 当第一列值发生变化时，变化第二列(后一列)对应的选项
				if (columnIndex === 0) {
					// picker为选择器this实例，变化第二列对应的选项
					picker.setColumnValues(1, this.columnData[index])
				}
			},
			// 回调参数为包含columnIndex、value、values
			confirm(e) {
				console.log('confirm', e)
				this.show = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/common/styles/form.scss';
</style>
