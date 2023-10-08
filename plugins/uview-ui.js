import Vue from 'vue';
import uView from '@/uni_modules/uview-ui';

Vue.use(uView);

const primaryColor = '#16C2C1';

uni.$u.setConfig({
	config: {
		color: {
			'u-primary': primaryColor,
			'u-error': '#fa3534',
			'u-warn': '#FFA509',
			'u-disabled-color': '#c8c9cc',
			'bg-white': '#ffffff'
		}
	},
	props: {
		form: {
			// labelWidth: 'auto'
			labelWidth: 120
		},
		line: {
			color: '#eeeeee'
		},
		radioGroup: {
			activeColor: primaryColor,
		},
		steps: {
			activeColor: primaryColor,
		},
		datetimePicker: {
			// maxDate: new Date(new Date().getFullYear() + 10, 0, 1).getTime(),	// 可选的最大时间, 默认值为后10年
			minDate: new Date(new Date().getFullYear() - 50, 0, 1).getTime(), // 可选的最小时间, 默认值为前50年
			formatter(type, value) {
				if (type === 'year') return `${value}年`;
				else if (type === 'month') return `${value}月`;
				else if (type === 'day') return `${value}日`;
				return value;
			},
			confirmColor: primaryColor,
			confirmText: '完成'
		},
		picker: {
			confirmColor: primaryColor,
			confirmText: '完成'
		},
		gap: {
			height: 15
		},
		cell: {
			rightIconStyle: 'color: #ccc'
		},
		upload: {
			maxDuration: 15
		},
		/**
		 * uni 几个交互组件 z-index 都为 999
		 * modal/actionsheet/preview-image
		 * uview的 z-index 需要设置为低于uni的z-index
		 */
		toast: {
			zIndex: 990,
		},
		popup: {
			zIndex: 975,
		},
		keyboard: {
			zIndex: 975,
		},
		overlay: {
			zIndex: 970,	// mask
		},
		tooltip: {
			zIndex: 971,
		},
		sticky: {
			zIndex: 10	// u-navbar_z-index: 11, ∴ 设置为10
		}
	}
});
