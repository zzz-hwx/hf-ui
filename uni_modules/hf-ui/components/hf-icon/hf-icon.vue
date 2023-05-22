<template>
	<text
		class="hf-icon"
		:class="hfClasses"
		:style="[iconStyle]"
		@click="clickHandler"
	></text>
</template>

<script>
	export default {
		name: 'HfIcon',
		props: {
			name: {
				type: String,
				default: ''
			},
			color: {
				type: String,
				default: uni.$u.config.color['u-content-color']
			},
			size: {
				type: [String, Number],
				default: '16px'
			},
			bold: {
				type: Boolean,
				default: false
			},
			customFamily: {	// Font Family
				type: String,
				default: 'hf'
			},
			customPrefix: {	// 前缀
				type: String,
				default: 'hf'
			},
			stop: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				
			}
		},
		computed: {
			hfClasses() {
				const classes = [];
				classes.push(this.customFamily);
				classes.push(this.customPrefix + '-' + this.name);
				// 主题色，通过类配置
				if (this.color && uni.$u.config.type.includes(this.color)) {
					classes.push('hf-icon__icon--' + this.color);
				}
				return classes.filter(Boolean).join(' ');
			},
			iconStyle() {
				let style = {
					fontSize: uni.$u.addUnit(this.size),
					lineHeight: uni.$u.addUnit(this.size),
					fontWeight: this.bold ? 'bold' : 'normal',
				};
				if (this.color && !uni.$u.config.type.includes(this.color)) {
					// 非主题色值时，才当作颜色值
					style.color = this.color;
				}
				return style;
			}
		},
		methods: {
			clickHandler(e) {
				this.$emit('click');
				// 是否阻止事件冒泡
				this.stop && this.preventEvent(e);
			}
		}
	}
</script>

<style lang="scss" scoped>
@import './icon.scss';

.hf-icon {
	&__icon {
		position: relative;
		&--primary {
			color: $u-primary;
		}
		&--success {
			color: $u-success;
		}
		&--error {
			color: $u-error;
		}
		&--warning {
			color: $u-warning;
		}
		&--info {
			color: $u-info;
		}
	}
}
</style>
