<template>
	<u-form-item :label="label" :prop="prop" :required="required" :label-position="labelPosition" :borderBottom="borderBottom">
		<u-input ref="input" :value="value" :placeholder="placeholder" disabled border="none" disabled-color="#ffffff" input-align="right" @input="handleInput"></u-input>
		<template #right>
			<image src="@/static/sj_icon_location.png" @click="chooseLocation"></image>
		</template>
	</u-form-item>
</template>

<script>
	import mixin from '../../libs/mixins/form.js';
	import { getLocation } from '@/uni_modules/hf-middleware';
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
			}
		},
		data() {
			return {
				primaryColor: uni.$u.config.color['u-primary']
			}
		},
		created() {
			if (this.initializeLocation) {
				this.getLocation();
			}
		},
		methods: {
			getLocation() {
				if (this.disabled) return;
				getLocation().then(res => {
					this.$emit('input', res.address);
					this.$emit('update:latitude', res.latitude);
					this.$emit('update:longitude', res.longitude);
					this.$emit('change', res);
				});
			},
			chooseLocation() {
				if (this.disabled) return;
				uni.chooseLocation({
					latitude: this.latitude,
					longitude: this.longitude,
					success: (res) => {
						res.location = res.name;
						this.$emit('input', res.address);
						this.$emit('update:latitude', res.latitude);
						this.$emit('update:longitude', res.longitude);
						this.$emit('change', res);
					}
				});
			},
			handleInput(val) {
				this.$emit('input', val);
			}
		}
	}
</script>

<style lang="scss" scoped>
	image {
		width: 24px;
		height: 24px;
		margin-left: $xs;
	}
</style>
