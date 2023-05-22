<template>
	<view class="hf-select" >
		<u-form-item :label="label" :prop="prop" :required="required" :label-position="labelPosition" :borderBottom="borderBottom" @click="openCheckOptions">
			<hf-form-content ref="input" :placeholder="placeholder"></hf-form-content>
			<template #right>
				<slot name="right"></slot>
			</template>
		</u-form-item>
		<!-- 检查项列表 -->
		<slot name="checkList" :info="checkOptionsVal">
			<view class="check-list"  @click="openCheckOptions">
				<view v-for="(item, index) in checkOptionsVal">
					{{item}}
				</view>
			</view>
		</slot>
		
		<u-popup :show="visible" @close="visible = false">
			<view class="pop-head">
				<text class="pop-cancel" @click="noSelectCheckOptions">取消</text>
				<text class="pop-tt">{{ label }}</text>
				<text class="pop-confirm" @click="selectCheckOptions">确定</text>
			</view>
			<view>
				<u-checkbox-group 
					v-model="checkOptionsVal"
					iconPlacement="right" 
					placement="column"
				>
					<u-checkbox
						:customStyle="{padding: '10px'}"
						shape="circle"
						v-for="(item, index) in options"
						:key="index"
						:label="item.label"
						:name="item.label"
						
						:activeColor="primaryColor"
					></u-checkbox>
				</u-checkbox-group>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import mixin from '../../libs/mixins/form.js';
	import loadData from '../../libs/util/loadData.js';
	export default {
		name: 'HfFormCheckBox',
		mixins: [mixin],
		props: {
			splitChar: {
				type: String,
				default: ','
			},
			dictCode: {	// 字典code
				type: String,
				default: ''
			},
			primaryColor: {
				type: String,
				default: uni.$u.config.color['u-primary']
			}
		},
		data() {
			return {
				visible: false,
				options: [],
				checkOptionsVal: [],  // [label, label]  - 选中的label
				checkedValueList: [],  // 选中的项的value列表
				tempCheckOptionsVal: [],  // 临时[label, label]列表
			}
		},
		watch: {
			value: {
				async handler(newVal, oldVal){
					// "2,3,4" => [2,3,4]
					// console.log("newVal: ", newVal, "oldVal:", oldVal)
					this.checkedValueList = newVal.split(this.splitChar)
					this.checkOptionsVal = [];
					await this.loadDictOptions();
					this.options.forEach(item => {
						this.checkedValueList.indexOf(item.value) != -1 ?  this.checkOptionsVal.push(item.label) : ''
					})
				},
				immediate: true
			}
		},
		created() {
			
		},
		methods: {
			async loadDictOptions() {
				// this.options = await loadData.loadDictOptions(this.dictCode);
				// 临时代码 ***
				this.options = [{
					label: '消防通道堵塞',
					value: '01'
				},{
					label: '安全出口被阻塞',
					value: '02'
				},{
					label: '无疏散指示标识',
					value: '03'
				},{
					label: '防火门损坏',
					value: '04'
				},{
					label: '应急照明损坏',
					value: '05'
				},{
					label: '未组织消防演练',
					value: '06'
				}]
				
			},
			openCheckOptions() {
				if (this.disabled) return;
				this.tempCheckOptionsVal = this.checkOptionsVal;
				this.visible = true; 
				uni.hideKeyboard();
			},
		
			noSelectCheckOptions(){
				this.checkOptionsVal = this.tempCheckOptionsVal;
				this.visible = false;
			},
			selectCheckOptions(){
				this.visible = false;
				this.checkedValueList = [];
				console.log(this.checkOptionsVal)
				// 将options的checked值为true筛选出来
				this.options.forEach(item => {
					 if(this.checkOptionsVal.indexOf(item.label) != -1){
						 this.checkedValueList.push(item.value)
					 }
				})
				this.$emit('input', this.checkedValueList.join(this.splitChar))
			},
		}
	}
</script>

<style lang="scss" scoped>
	.check-list{
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		view {
			padding: 10rpx;
			margin-right: 10rpx;
			
			background-color: #16C2C119;
			border: 1rpx #16C2C1 solid;
			border-radius: 5rpx;
			color: #16C2C1;
			white-space: nowrap;
		}
	}
	.pop-head{
		padding: 26rpx 8rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.pop-cancel{
			color: #A3A3A3;
		}
		.pop-tt {
			font-weight: 800;
			font-size: 34rpx;
		}
		.pop-confirm{
			color: $bg-primary;
		}
	}
</style>
