const SCOPE = 'scope.userLocation';
let SYS_INFO;

/**
 * @description 获取位置
 * 封装 uni.getLocation
 * @returns {Object} 经纬度 latitude longitude
 */
export function getLocation () {
	return new Promise((resolve, reject) => {
		uni.getLocation({
			type: 'wgs84',
			success: (res) => {
				// console.log(res);
				resolve({
					latitude: res.latitude,
					longitude: res.longitude
				});
			},
			fail: (err) => {
				console.log(err);
				reject('获取位置信息失败');
			}
		});
	});
}

/**
 * @description 获取系统信息
 * 封装 uni.getSystemInfoSync()
 */
export function getSystemInfoSync () {
	if (SYS_INFO) {
		return SYS_INFO;
	}
	const system = uni.getSystemInfoSync();
	SYS_INFO = {
		platform: system.platform
	};
	return SYS_INFO;
}

/**
 * @description 获取用户的当前设置
 * 封装 uni.getSetting
 */
export function getSetting() {
	return new Promise((resolve, reject) => {
		uni.getSetting({
			success: (res) => {
				resolve(res.authSetting[SCOPE]);
			},
			fail: (err) => {
				console.log(err);
				reject();
			}
		});
	});
}

/**
 * @description 向用户发起授权请求
 * 封装 uni.authorize
 */
export function authorize () {
	return new Promise((resolve, reject) => {
		uni.authorize({
			scope: SCOPE,
			success: (res) => {
				resolve();
			},
			fail: (err) => {
				// 用户拒绝授权
				console.log(err);
				reject();
			}
		});
	})
}

/**
 * @description 调起客户端小程序设置界面，返回用户设置的操作结果 
 * 封装 uni.openSetting
 */
export function openSetting () {
	return new Promise((resolve, reject) => {
		uni.openSetting({
			success: (res) => {
				if (res.authSetting[SCOPE] === true) {
					resolve();
				} else {
					// 用户未授权
					console.log(res);
					reject();
				}
			},
			fail: (err) => {
				// wx.openSetting() 需用户手动触发 => wx.showModal()
				console.log(err);
				reject();
			}
		})
	});
}

export function delay (duration = 500) {
	return new Promise((resolve) => {
		setTimeout(resolve, duration);
	});
}
