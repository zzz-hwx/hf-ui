const originalParams = {
	title: '',
	content: '',
	showCancel: true,
	cancelText: '取消',
	cancelColor: '#000000',
	confirmText: '确定',
	confirmColor: '#5e6d8a',
	editable: false,
	placeholderText: ''
}

const systemInfo = uni.getSystemInfoSync()

function modal(params) {
	let data = Object.assign({}, originalParams, params)
	
	let cancelText = data.cancelText
	let cancelColor = data.cancelColor
	let confirmText = data.confirmText
	let confirmColor = data.confirmColor
	
	let reverse = false
	// #ifdef APP-PLUS
		if(systemInfo.platform === 'android' && data.showCancel) {
			reverse = true
		}
	// #endif
	
	if(reverse) {
		// app - android && 展示取消按钮 => 按钮文字 相反
		cancelText = data.confirmText
		cancelColor = data.confirmColor
		confirmText = data.cancelText
		confirmColor = data.cancelColor
	}
	
	return new Promise((resolve, reject) => {
		uni.showModal({
			title: data.title,
			content: data.content,
			showCancel: data.showCancel,
			cancelText,
			cancelColor,
			confirmText,
			confirmColor,
			success: (res) => {
				if(reverse) {
					if(res.confirm) {
						reject()
					} else {
						resolve()
					}
				} else {
					if(res.confirm) {
						resolve()
					} else {
						reject()
					}
				}
			}
		})
	})
}

export default modal
