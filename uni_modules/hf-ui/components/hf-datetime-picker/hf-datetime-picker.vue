<template>
	<view class="hf-datetime-picker">
		<picker-view
			class="u-picker__view"
			:indicator-style="indicatorStyle"
			:value="innerIndex"
			immediateChange
			:style="pickerViewStyle"
			@change="changeHandler">
			<picker-view-column
				v-for="(item, index) in columns"
				:key="index"
				class="u-picker__view__column">
				<text
					v-if="$u.test.array(item)"
					class="u-picker__view__column__item u-line-1"
					v-for="(item1, index1) in item"
					:key="index1"
					:style="{
						height: $u.addUnit(itemHeight),
						lineHeight: $u.addUnit(itemHeight),
						fontWeight: index1 === innerIndex[index] ? 'bold' : 'normal'
					}"
				>{{ getItemText(item1) }}</text>
			</picker-view-column>
		</picker-view>
	</view>
</template>

<script>
	/**
	 * @description 嵌入页面的滚动日期选择器
	 * 逻辑从<u-picker>和<u-datetime-picker>拷贝粘贴(版本: 2.0.34)
	 * 参数和<u-datetime-picker>一致(可能部分没有复制 没有实现)
	 */
	import props from '@/uni_modules/uview-ui/components/u-datetime-picker/props.js';
	import dayjs from '@/uni_modules/uview-ui/libs/util/dayjs.js';
	import { formatMap } from '../../libs/util/dateFormat.js';
	export default {
		name: 'HfDatetimePicker',
		mixins: [props],
		data() {
			return {
				// ------ copy from u-datetime-picker ------
				columns: [],
				innerDefaultIndex: [],
				innerFormatter: (type, value) => value,
				
				// ------ copy from u-picker ------
				// 上一次选择的列索引
				lastIndex: [],
				// 索引值 ，对应picker-view的value
				innerIndex: [],
				// 上一次的变化列索引
				columnIndex: 0
			};
		},
		watch: {
			propsChange() {
				this.init()
			},
			innerDefaultIndex: {
				handler(n) {
					this.setIndexs(n, true)
				},
				immediate: true
			},
			columns: {
				handler(columns) {
					// 如果在设置各列数据时，没有被设置默认的各列索引defaultIndex，那么用0去填充它，数组长度为列的数量
					if (this.innerIndex.length === 0) {
						this.innerIndex = new Array(columns.length).fill(0)
					}
				},
				immediate: true
			}
		},
		computed: {
			propsChange() {
				// 如果以下这些变量发生了变化，意味着需要重新初始化各列的值
				return [this.mode, this.maxDate, this.minDate, this.minHour, this.maxHour, this.minMinute, this.maxMinute, this.filter, ]
			},
			indicatorStyle() {
				return `height: ${uni.$u.addUnit(this.itemHeight)}`;
			},
			pickerViewStyle() {
				return `height: ${uni.$u.addUnit(this.visibleItemCount * this.itemHeight)}`;
			}
		},
		created() {
			this.init();
		},
		methods: {
			// -------- copy from u-picker --------
			changeHandler(e) {
				// const val = e.detail.value
				// this.year = this.years[val[0]]
				// this.month = this.months[val[1]]
				// this.day = this.days[val[2]]
				const { value } = e.detail;
				let index = 0,
					columnIndex = 0
				// 通过对比前后两次的列索引，得出当前变化的是哪一列
				for (let i = 0; i < value.length; i++) {
					let item = value[i]
					if (item !== (this.lastIndex[i] || 0)) { // 把undefined转为合法假值0
						// 设置columnIndex为当前变化列的索引
						columnIndex = i
						// index则为变化列中的变化项的索引
						index = item
						break // 终止循环，即使少一次循环，也是性能的提升
					}
				}
				this.columnIndex = columnIndex
				// 将当前的各项变化索引，设置为"上一次"的索引变化值
				this.setLastIndex(value)
				this.setIndexs(value)
				const selectValue = this.change({
					indexs: value,
					values: this.columns
				});
				const format = formatMap.get(this.mode);
				const dateValue = uni.$u.timeFormat(selectValue, format);
				this.$emit('input', dateValue);
			},
			setIndexs(index, setLastIndex) {
				// 设置index索引，此方法可被外部调用设置
				this.innerIndex = uni.$u.deepClone(index)
				if (setLastIndex) {
					this.setLastIndex(index)
				}
			},
			setLastIndex(index) {
				// 记录上一次的各列索引位置
				// 当能进入此方法，意味着当前设置的各列默认索引，即为“上一次”的选中值，需要记录，是因为changeHandler中
				// 需要拿前后的变化值进行对比，得出当前发生改变的是哪一列
				this.lastIndex = uni.$u.deepClone(index)
			},
			// -------- copy from u-datetime-picker --------
			init() {
				this.innerValue = this.correctValue(this.value)
				this.updateColumnValue(this.innerValue)
			},
			getItemText(item) {
				// 获取item需要显示的文字，判别为对象还是文本
				if (uni.$u.test.object(item)) {
					return item[this.keyName]
				} else {
					return item
				}
			},
			change(e) {
				// 列发生变化时触发
				const { indexs, values } = e
				let selectValue = ''
				if(this.mode === 'time') {
					// 根据value各列索引，从各列数组中，取出当前时间的选中值
					selectValue = `${this.intercept(values[0][indexs[0]])}:${this.intercept(values[1][indexs[1]])}`
				} else {
					// 将选择的值转为数值，比如'03'转为数值的3，'2019'转为数值的2019
					const year = parseInt(this.intercept(values[0][indexs[0]],'year'))
					const month = parseInt(this.intercept(values[1][indexs[1]]))
					let date = parseInt(values[2] ? this.intercept(values[2][indexs[2]]) : 1)
					let hour = 0, minute = 0
					// 此月份的最大天数
					const maxDate = dayjs(`${year}-${month}`).daysInMonth()
					// year-month模式下，date不会出现在列中，设置为1，为了符合后边需要减1的需求
					if (this.mode === 'year-month') {
					    date = 1
					}
					// 不允许超过maxDate值
					date = Math.min(maxDate, date)
					if (this.mode === 'datetime') {
					    hour = parseInt(this.intercept(values[3][indexs[3]]))
					    minute = parseInt(this.intercept(values[4][indexs[4]]))
					}
					// 转为时间模式
					selectValue = Number(new Date(year, month - 1, date, hour, minute))
				}
				// 取出准确的合法值，防止超越边界的情况
				selectValue = this.correctValue(selectValue)
				this.innerValue = selectValue
				this.updateColumnValue(selectValue)
				// 发出change时间，value为当前选中的时间戳
				this.$emit('change', {
					value: selectValue,
					// #ifndef MP-WEIXIN
					// 微信小程序不能传递this实例，会因为循环引用而报错
					picker: this.$refs.picker,
					// #endif
					mode: this.mode
				})
				return selectValue;
			},
			//用正则截取输出值,当出现多组数字时,抛出错误
			intercept(e, type){
				let judge = e.match(/\d+/g)
				//判断是否掺杂数字
				if (judge.length>1) {
					uni.$u.error("请勿在过滤或格式化函数时添加数字")
					return 0
				} else if (type&&judge[0].length==4) {	//判断是否是年份
					return judge[0]
				} else if (judge[0].length>2) {
					uni.$u.error("请勿在过滤或格式化函数时添加数字")
					return 0
				} else {
					return judge[0]
				}
			},
			correctValue(value) {
				// 得出合法的时间
				const isDateMode = this.mode !== 'time'
				if (isDateMode && !uni.$u.test.date(value)) {
					// 如果是日期类型，但是又没有设置合法的当前时间的话，使用最小时间为当前时间
					value = this.minDate
				} else if (!isDateMode && !value) {
					// 如果是时间类型，而又没有默认值的话，就用最小时间
					value = `${uni.$u.padZero(this.minHour)}:${uni.$u.padZero(this.minMinute)}`
				}
				// 时间类型
				if (!isDateMode) {
					if (String(value).indexOf(':') === -1) return uni.$u.error('时间错误，请传递如12:24的格式')
					let [hour, minute] = value.split(':')
					// 对时间补零，同时控制在最小值和最大值之间
					hour = uni.$u.padZero(uni.$u.range(this.minHour, this.maxHour, Number(hour)))
					minute = uni.$u.padZero(uni.$u.range(this.minMinute, this.maxMinute, Number(minute)))
					return `${ hour }:${ minute }`
				} else {
					// 如果是日期格式，控制在最小日期和最大日期之间
					value = dayjs(value).isBefore(dayjs(this.minDate)) ? this.minDate : value
					value = dayjs(value).isAfter(dayjs(this.maxDate)) ? this.maxDate : value
					return value
				}
			},
			updateColumnValue(value) {
				// 更新各列的值，进行补0、格式化等操作
				this.innerValue = value
				this.updateColumns()
				this.updateIndexs(value)
			},
			updateColumns() {
				// 更新各列的值
				const formatter = this.formatter || this.innerFormatter
				// 获取各列的值，并且map后，对各列的具体值进行补0操作
				const results = this.getOriginColumns().map((column) => column.values.map((value) => formatter(column.type, value)))
				this.columns = results
			},
			updateIndexs(value) {
				// 更新索引
				let values = []
				const formatter = this.formatter || this.innerFormatter
				const padZero = uni.$u.padZero
				if (this.mode === 'time') {
					// 将time模式的时间用:分隔成数组
					const timeArr = value.split(':')
					// 使用formatter格式化方法进行管道处理
					values = [formatter('hour', timeArr[0]), formatter('minute', timeArr[1])]
				} else {
					const date = new Date(value)
					values = [
						formatter('year', `${dayjs(value).year()}`),
						// 月份补0
						formatter('month', padZero(dayjs(value).month() + 1))
					]
					if (this.mode === 'date') {
						// date模式，需要添加天列
						values.push(formatter('day', padZero(dayjs(value).date())))
					}
					if (this.mode === 'datetime') {
						// 数组的push方法，可以写入多个参数
						values.push(formatter('day', padZero(dayjs(value).date())), formatter('hour', padZero(dayjs(value).hour())), formatter('minute', padZero(dayjs(value).minute())))
					}
				}
				// 根据当前各列的所有值，从各列默认值中找到默认值在各列中的索引
				const indexs = this.columns.map((column, index) => {
					// 通过取大值，可以保证不会出现找不到索引的-1情况
					return Math.max(0, column.findIndex(item => item === values[index]))
				})
				this.innerDefaultIndex = indexs
			},
			getOriginColumns() {
				// 生成各列的值
				const results = this.getRanges().map(({ type, range }) => {
					let values = times(range[1] - range[0] + 1, (index) => {
						let value = range[0] + index
						value = type === 'year' ? `${value}` : uni.$u.padZero(value)
						return value
					})
					// 进行过滤
					if (this.filter) {
						values = this.filter(type, values)
					}
					return { type, values }
				})
				return results
			},
			getRanges() {
				// 获取每列的最大和最小值
				if (this.mode === 'time') {
					return [
						{
							type: 'hour',
							range: [this.minHour, this.maxHour],
						},
						{
							type: 'minute',
							range: [this.minMinute, this.maxMinute],
						},
					];
				}
				const { maxYear, maxDate, maxMonth, maxHour, maxMinute } = this.getBoundary('max', this.innerValue);
				const { minYear, minDate, minMonth, minHour, minMinute } = this.getBoundary('min', this.innerValue);
				const result = [
					{
						type: 'year',
						range: [minYear, maxYear],
					},
					{
						type: 'month',
						range: [minMonth, maxMonth],
					},
					{
						type: 'day',
						range: [minDate, maxDate],
					},
					{
						type: 'hour',
						range: [minHour, maxHour],
					},
					{
						type: 'minute',
						range: [minMinute, maxMinute],
					}
				];
				if (this.mode === 'date') {
					result.splice(3, 2);
				} else if (this.mode === 'year-month') {
					result.splice(2, 3);
				}
				return result;
			},
			getBoundary(type, innerValue) {
				// 根据minDate、maxDate、minHour、maxHour等边界值，判断各列的开始和结束边界值
				const value = new Date(innerValue)
				const boundary = new Date(this[`${type}Date`])
				const year = dayjs(boundary).year()
				let month = 1
				let date = 1
				let hour = 0
				let minute = 0
				if (type === 'max') {
					month = 12
					date = dayjs(value).daysInMonth()	// 月份的天数
					hour = 23
					minute = 59
				}
				// 获取边界值，逻辑是：当年达到了边界值(最大或最小年)，就检查月允许的最大和最小值，以此类推
				if (dayjs(value).year() === year) {
					month = dayjs(boundary).month() + 1
					if (dayjs(value).month() + 1 === month) {
						date = dayjs(boundary).date()
						if (dayjs(value).date() === date) {
							hour = dayjs(boundary).hour()
							if (dayjs(value).hour() === hour) {
								minute = dayjs(boundary).minute()
							}
						}
					}
				}
				return {
					[`${type}Year`]: year,
					[`${type}Month`]: month,
					[`${type}Date`]: date,
					[`${type}Hour`]: hour,
					[`${type}Minute`]: minute
				}
			}
		}
	}
	
	function times(n, iteratee) {
		let index = -1
		const result = Array(n < 0 ? 0 : n)
		while (++index < n) {
			result[index] = iteratee(index)
		}
		return result
	}
</script>

<style lang="scss" scoped>
	@import '@/uni_modules/uview-ui/libs/css/components.scss';
	.u-picker {
		position: relative;
		&__view {
			&__column {
				@include flex;
				flex: 1;
				justify-content: center;
				&__item {
					@include flex;
					justify-content: center;
					align-items: center;
					font-size: 16px;
					text-align: center;
					/* #ifndef APP-NVUE */
					display: block;
					/* #endif */
					color: $u-main-color;
					&--disabled {
						/* #ifndef APP-NVUE */
						cursor: not-allowed;
						/* #endif */
						opacity: 0.35;
					}
				}
			}
		}
	}
</style>
