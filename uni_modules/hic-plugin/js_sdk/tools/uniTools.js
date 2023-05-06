import toast from '../message/toast';
/**
 * uni.navigateBack 的封装
 * 关闭当前页面，返回上一页面或多级页面
 * @param {Number} delta 返回的页面数，如果 delta 大于现有页面数，则返回到首页
 */
export function navigateBack(delta = 1) {
	return new Promise((resolve, reject) => {
		const num = Number(delta);
		if (isNaN(num)) {
			return reject('delta 不是数字类型');
		}
		uni.navigateBack({
			delta: num,
			success: () => {
				resolve();
			},
			fail: (err) => {
				reject(err);
			}
		});
	});
}


/**
 * uni.navigateTo 的封装
 * 保留当前页面，跳转到应用内的某个页面
 * @param {String} path 需要跳转的应用内非 tabBar 的页面的路径
 * @param {Object} params
 * @param {Boolean} encode
 */
export function navigateTo(path, params, encode = false) {
	return new Promise((resolve, reject) => {
		if (!path) return reject('path is required');
		let url = path;
		if (params) {
			let str = JSON.stringify(params);
			if (encode) {
				str = encodeURIComponent(str);
			}
			url += '?data=' + str;
		}
		uni.navigateTo({
			url,
			success: (res) => {
				resolve(res);
			},
			fail: (err) => {
				console.log(err);
				reject(err);
			}
		});
	});
}

/**
 * uni.redirectTo 的封装
 * 关闭当前页面，跳转到应用内的某个页面
 * @param {String} path 需要跳转的应用内非 tabBar 的页面的路径
 * @param {Object} params
 * @param {Boolean} encode
 */
export function redirectTo(path, params, encode = false) {
	return new Promise((resolve, reject) => {
		if (!path) return reject('path is required');
		let url = path;
		if (params) {
			let str = JSON.stringify(params);
			if (encode) {
				str = encodeURIComponent(str);
			}
			url += '?data=' + str;
		}
		uni.redirectTo({
			url,
			success: (res) => {
				resolve(res);
			},
			fail: (err) => {
				console.log(err);
				reject(err);
			}
		});
	});
}

/**
 * uni.reLaunch 的封装
 * 关闭所有页面 打开到应用内的某个页面
 * @param {String} path 需要跳转的应用内非 tabBar 的页面的路径
 * @param {Object} params
 * @param {Boolean} encode
 */
export function reLaunch(path, params, encode = false) {
	return new Promise((resolve, reject) => {
		if (!path) return reject('path is required');
		let url = path;
		if (params) {
			let str = JSON.stringify(params);
			if (encode) {
				str = encodeURIComponent(str);
			}
			url += '?data=' + str;
		}
		uni.reLaunch({
			url,
			success: (res) => {
				resolve(res);
			},
			fail: (err) => {
				console.log(err);
				reject(err);
			}
		});
	});
}

/**
 * uni.scanCode 的封装
 * @param {Array} scanType 扫码类型
 * @param {Boolean} onlyFromCamera 是否只能从相机扫码，不允许从相册选择图片
 */
export function scanCode (scanType = ['qrCode'], onlyFromCamera = false) {
	return new Promise((resolve, reject) => {
		uni.scanCode({
			scanType,
			success: (res) => {
				const result = res.result;	// 扫码的内容
				resolve(result);
			},
			fail: (err) => {
				console.log(err);
				reject();
			}
		});
	});
}

/**
 * uni.chooseImage 的封装 从本地相册选择图片或使用相机拍照。
 * @param {Number} 			count		最多可以选择的图片张数，默认9
 * @param {Array<String>}	sizeType	original 原图，compressed 压缩图，默认二者都有
 * @param {Array<String>}	sourceType	album 从相册选图，camera 使用相机，默认二者都有。如需直接开相机或直接选相册，请只使用一个选项
 */
export function chooseImage({
	count = 9,
	sizeType = ['original', 'compressed'],
	sourceType = ['camera', 'album']
} = {}) {
	return new Promise((resolve, reject) => {
		uni.chooseImage({
			count,
			sizeType,
			sourceType,
			success: (res) => {
				resolve(res);
			},
			fail: (err) => {
				console.log(err);
				reject(err);
			}
		});
	})
}

/**
 * uni.setClipboardData 的封装 设置系统剪贴板内容
 * @param {Object} data 需要设置的内容
 * @param {Boolean} tip 复制完成是否提示
 */
export function copyData(data, tip = false) {
	return new Promise((resolve, reject) => {
		uni.setClipboardData({	// 设置系统剪贴板的内容
			data,
			success: () => {
				if (tip) {
					toast('复制完成');
				}
				resolve();
			},
			fail: (err) => {
				console.log(err);
				reject();
			}
		});
	});
}
