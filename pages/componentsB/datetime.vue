<template>
	<view>
		<view class="title">表单</view>
		<view class="form">
			<u-form :model="model">
				<hf-form-datetime
					v-model="model.datetime"
					label="日期时间"
					placeholder="请选择"
					mode="datetime"
				></hf-form-datetime>
				<hf-form-datetime
					v-model="model.date"
					label="日期"
					placeholder="请选择"
					mode="date"
				></hf-form-datetime>
				<hf-form-datetime
					v-model="model.time"
					label="时间"
					placeholder="请选择"
					mode="time"
				></hf-form-datetime>
				<hf-form-datetime
					v-model="model.yearMonth"
					label="年月"
					placeholder="请选择"
					mode="year-month"
				></hf-form-datetime>
			</u-form>
		</view>
		
		<view class="title">自定义展示部分 (页面查询条件)</view>
		<view class="section">
			<hf-form-datetime v-model="model.startTime" mode="date">
				<template v-slot:display-section="{ valueName, visible }">
					<u-icon
						:name="visible ? 'arrow-up-fill' : 'arrow-down-fill'"
						size="14"
						:label="valueName || '开始时间'"
						labelPos="left"
					></u-icon>
				</template>
			</hf-form-datetime>
		</view>
		
		<temp-data :info="model"></temp-data>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				model: {
					datetime: '',
					date: '',
					time: '12:24',
					yearMonth: '',
					startTime: ''
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/common/styles/form.scss';
</style>
