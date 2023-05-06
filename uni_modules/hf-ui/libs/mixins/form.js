
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
		borderBottom: {
			type: Boolean,
			default: true,
		}
	}
};
