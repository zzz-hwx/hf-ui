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
 * uni.chooseImage 的封装 从本地相册选择图片或使用相机拍照
 */
export function chooseImage({
	count = 9,
	sizeType = ['original', 'compressed'],
	extension,
	sourceType = ['camera', 'album'],
	crop
} = {}) {
	return new Promise((resolve, reject) => {
		uni.chooseImage({
			count,
			sizeType,
			extension,
			sourceType,
			crop,
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
 * uni.chooseVideo 的封装 拍摄视频或从手机相册中选视频，返回视频的临时文件路径
 */
export function chooseVideo({
	sourceType = ['album', 'camera'],
	extension,
	compressed,
	maxDuration,
	camera
} = {}) {
	return new Promise((resolve, reject) => {
		uni.chooseVideo({
			sourceType,
			extension,
			compressed,
			maxDuration,
			camera,
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
 * uni.chooseMedia 的封装 拍摄或从手机相册中选择图片或视频（仅小程序支持）
 */
export function chooseMedia({
	count = 9,
	mediaType = ['image', 'video'],
	sourceType = ['album', 'camera'],
	maxDuration = 10,
	sizeType = ['original', 'compressed'],
	camera = 'back'
} = {}) {
	return new Promise((resolve, reject) => {
		uni.chooseMedia({
			count,
			mediaType,
			sourceType,
			maxDuration,
			sizeType,
			camera,
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
 * uni.chooseFile 的封装 从本地选择文件
 */
export function chooseFile({
	count = 100,
	type = 'all',	// 所选的文件的类型 all, video, image
	extension,
	sourceType = ['album','camera']
} = {}) {
	return new Promise((resolve, reject) => {
		uni.chooseFile({
			count,
			type,
			extension,
			sourceType,
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

/**
 * uni.showActionSheet 的封装 从底部向上弹出操作菜单
 * @param {Array<String>} itemList 按钮的文字数组
 * @returns {Number} 用户点击的按钮，从上到下的顺序，从0开始
 */
export function showActionSheet({
	title,
	alertText,
	itemList,
	itemColor,
	popover
	
} = {}) {
	return new Promise((resolve, reject) => {
		if (!Array.isArray(itemList)) {
			throw new Error('itemList 必填');
		}
		uni.showActionSheet({
			title,
			alertText,
			itemList,
			itemColor,
			popover,
			success: (res) => {
				resolve(res.tapIndex);
			},
			fail: (err) => {
				console.log(err);
				reject(err);
			}
		});
	});
}

/**
 * uni.makePhoneCall 的封装 拨打电话
 * @param {String } phoneNumber 需要拨打的电话号码
 */
export function makePhoneCall(phoneNumber) {
	return new Promise((resolve, reject) => {
		uni.makePhoneCall({
			phoneNumber,
			success: (res) => {
				resolve(res);
			},
			fail: (err) => {
				reject(err);
			}
		});
	});
}
