
export default {
	props: {
		label: {
			type: String,
			default: ''
		},
		prop: {
			type: String,
			default: ''
		},
		value: {
			type: [String, Number],
			default: ''
		},
		disabled: {
			type: Boolean,
			default: false
		},
		placeholder: {
			type: String,
			default: ''
		},
		required: {
			type: Boolean,
			default: false
		},
		labelPosition: {
			type: String,
			default: 'left'
		},
		labelWidth: {
			type: [String, Number]
		},
		borderBottom: {
			type: Boolean,
			default: true,
		}
	},
	data() {
		return {
			parentData: {
				// 提示文本的样式
				labelStyle: {},
				// 提示文字的宽度
				labelWidth: '',
			},
		}
	},
	computed: {
		labelStyle() {
			return `min-width: ${uni.$u.addUnit(this.labelWidth || this.parentData.labelWidth)}`;
		}
	},
	mounted() {
		this.updateParentData();
	},
	methods: {
		updateParentData() {
			// 获取父组件的参数
			// 此方法写在uview的全局mixin中
			this.getParentData('u-form');
		},
	}
};
