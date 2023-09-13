<template>
	<u-form-item :label="label" :prop="prop" :required="required" :label-position="labelPosition" :borderBottom="borderBottom">
		<u-input ref="input" :value="value" :placeholder="placeholder" disabled border="none" disabled-color="#ffffff" @input="handleInput"></u-input>
		<template #right>
			<view class="m-l-xs">
				<hf-icon name="location-fill" color="primary" size="24" @click="chooseLocation"></hf-icon>
			</view>
		</template>
	</u-form-item>
</template>

<script>
	import mixin from '../../libs/mixins/form.js';
	import { getLocation, chooseLocation, config } from '@/uni_modules/hf-middleware';
	export default {
		name: 'HfFormLocation',
		mixins: [mixin],
		props: {
			latitude: {
				type: [Number, String],
				default: ''
			},
			longitude: {
				type: [Number, String],
				default: ''
			},
			initializeLocation: {
				// 是否初始化位置信息 详情、修改 不主动获取定位
				type: Boolean,
				default: false
			},
			coordinateSystem: {
				// 经纬度坐标系
				type: String,
				default: config.coordinateSystem
			}
		},
		data() {
			return {
				
			};
		},
		created() {
			if (this.initializeLocation) {
				this.getLocation();
			}
		},
		methods: {
			getLocation() {
				if (this.disabled) return;
				getLocation({ coordinateSystem: this.coordinateSystem }).then(res => {
					this.$emit('input', res.address);
					this.$emit('update:latitude', res.latitude);
					this.$emit('update:longitude', res.longitude);
					this.$emit('change', res);
				});
			},
			chooseLocation() {
				if (this.disabled) return;
				chooseLocation({
					latitude: this.latitude,
					longitude: this.longitude,
					coordinateSystem: this.coordinateSystem
				}).then((res) => {
					this.$emit('input', res.address);
					this.$emit('update:latitude', res.latitude);
					this.$emit('update:longitude', res.longitude);
					this.$emit('change', res);
				});
			},
			handleInput(val) {
				this.$emit('input', val);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.m-l-xs {
		margin-left: $xs;
	}
</style>
