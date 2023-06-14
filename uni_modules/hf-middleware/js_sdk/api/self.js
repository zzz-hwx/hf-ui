import { useBase } from '../utils/base.js';
import { base64ToPath, getFileType } from '../utils/index.js';
import { gcj02towgs84 } from '../utils/mapConversion.js';
import { showActionSheet as uniShowActionSheet, delay } from '@/uni_modules/hic-plugin';

/* ====================
		自研api
 ==================== */

/**
 * @description 选择图片
 * 从本地相册选择图片或使用相机拍照
 * @param {Object} params 参数
 * 	@param {Number} count 最多可以选择的图片张数，默认9
 */
export async function chooseImage({ count = 9 } = {}) {
	const tapIndex = await uniShowActionSheet({ itemList: ['从相册选择', '相机'] });
	if (tapIndex === 0) {
		// 从相册选择
		if (count < 1) count = 1;
		if (count > 9) count = 9;
		const res = await useBase('select', {
			maxCount: count,	// 图片数量
			selectType: 1		// 1选取图片, 2选取视频
		});
		// [{ fileName: 'IMG_20230314_162517.jpg', fileSize: '6498', fileType: 'jpg', fileBase64: 'base64', filePath: '/storage/emulated/0/DCIM/Screenshots/IMG_20230314_162517.jpg' }]
		const fileArr = res.map((item) => {
			return {
				path: base64ToPath(item.fileBase64, item.fileType, item.fileName),
				name: item.fileName,
				size: item.fileSize,
				type: getFileType(item.fileType)
			}
		});
		return fileArr;
	} else {
		// 拍照
		const res = await useBase('camera', {
			cameraType: 1	// 1拍照, 2拍视频, 3拍照+拍视频
		});
		// 返回经过压缩的图片base64
		// { fileName: 'photo_16802262889.png', fileSize: '380358', fileType: 'png', fileBase64: 'base64', filePath: '/storage/emulated/0/CityRenovate/image/photo_1680226289.png' }
		return [{
			path: base64ToPath(res.fileBase64, res.fileType, res.fileName),
			name: res.fileName,
			size: res.fileSize,
			type: getFileType(res.fileType)
		}];
	}
}

/**
 * @description 选择视频，只能选择1个
 */
export async function chooseVideo() {
	const tapIndex = await uniShowActionSheet({ itemList: ['从相册选择', '相机'] });
	if (tapIndex === 0) {
		// 从相册选择视频
		const res = await useBase('select', {
			maxCount: 1,	// 视频只能为1
			selectType: 2	// 1选取图片, 2选取视频
		});
		// { fileName: 'MP4_20230315_144107_PHOTOMOVIE.mp4', fileSize: '3005288', fileType: 'mp4', fileBase64: 'base64', filePath: '/storage/emulated/0/DCIM/Creative/MP4_20230315_144107_PHOTOMOVIE.mp4' }
		return [{
			path: base64ToPath(res.fileBase64, res.fileType, res.fileName),
			name: res.fileName,
			size: res.fileSize,
			type: getFileType(res.fileType)
		}];
	} else {
		// 拍视频
		const res = await useBase('camera', {
			cameraType: 2	// 1拍照, 2拍视频, 3拍照+拍视频
		});
		// { fileName: 'video_1680229869255.mp4', fileSize: '441990', fileType: 'mp4', fileBase64: 'base64', filePath: '/storage/emulated/0/CityRenovate/video/Renovate/video_1680229869255.mp4' }
		return [{
			path: base64ToPath(res.fileBase64, res.fileType, res.fileName),
			name: res.fileName,
			size: res.fileSize,
			type: getFileType(res.fileType)
		}];
	}
}

/**
 * @description 选择图片或视频
 * @param {Object} params 参数
 * 	@param {Number} count = [9] 最多可选择的数量，默认9，视频只可选择1
 */
export async function chooseMedia({ count = 9 } = {}) {
	const tapIndex = await uniShowActionSheet({ itemList: ['图片', '视频']});
	await delay(100);	// 等待样式过渡时间 .3s
	switch (tapIndex) {
		case 0:
			return chooseImage({ count });
		case 1:
			return chooseVideo();
	}
}

/**
 * @description 选择文件
 */
export async function chooseFile() {
	const res = await useBase('fileSelect');
	// { fileName: 'MP4_20230315_144107_PHOTOMOVIE.mp4', fileSize: '3005288', fileType: 'mp4', fileBase64: 'base64', filePath: '/storage/emulated/0/DCIM/Creative/MP4_20230315_144107_PHOTOMOVIE.mp4' }
	return [{
		path: base64ToPath(res.fileBase64, res.fileType, res.fileName),
		name: res.fileName,
		size: res.fileSize,
		type: getFileType(res.fileType)
	}];
}

/**
 * @description 定位
 */
export async function getLocation() {
	const res = await useBase('location');
	console.log('--- 定位 --->', res);
	// 底座返回经纬度坐标系为gcj02(高德)
	// PC端坐标系为wgs84
	// ∴ 转换为gcj02
	const [longitude, latitude] = gcj02towgs84(res.longitude, res.latitude);
	return {
		latitude,	// 纬度
		longitude,	// 经度
		address: res.address	// 地址
	};
}

/**
 * @description 证件OCR正/反面
 * @param {Object} params 参数
 * 	@param {Number} ocrType = [1] 身份证正反面 1正面, 2反面
 */
export async function getIdCardOcr({ ocrType = 1 } = {}) {
	const res = await useBase('idCardOcr', {
		ocrType	// 1身份证正面, 2身份证反面
	});
	/**
	 * 正面: { name: '张三', people: '汉族', idNumber: '123456123412121234', sex: '女', address: 'xx省xx市xx镇xx村xx号', birthday: '20010520' }
	 * 反面: { validPeriod: '2025年12月04日' } // 证件有效期
	 */
	if (ocrType === 1) {
		return {
			name: res.name,			// 姓名
			sex: res.sex,			// 性别
			nation: res.people,		// 民族
			birthday: formatBirthday(res.birthday),	// 出生日期
			address: res.address,	// 住址
			idcard: res.idNumber,	// 证件号
		};
	} else {
		return {
			expirationDate: formatDate(res.validPeriod)	// 到期时间
		};
	}
}

/**
 * @description 拨打电话
 * @param {String} phoneNumber 需要拨打的电话号码
 */
export async function makePhoneCall(phoneNumber) {
	if (!phoneNumber) {
		console.warn('phoneNumber is required');
		return;
	}
	await useBase('call', {
		telephoneNumber: phoneNumber
	}, true);
}

/**
 * @description AnyRtc 视频/语音通话
 * @param {Object} params 参数
 * 	@param {String} userId 用户id(必传)
 * 	@param {Number} type 类型 0-视频, 1-语音
 */
export async function anyRtc({ userId = '', type = 0 } = {}) {
	if (!userId) {
		throw new Error('userId is required');
	}
	await useBase('anyRtc', {
		anyRtcUserId: userId,
		anyRtcType: type
	}, true);
}

/**
 * @description 二维码扫描
 */
export async function scanCode() {
	const res = await useBase('scan');
	// { "codeInfo": "***" }
	console.log(res);
	if (!(res && res.codeInfo)) {
		throw new Error('二维码扫描失败', res);
	}
	return {
		result: res.codeInfo
	};
}

/**
 * @description 退出登录
 */
export async function logout() {
	await useBase('logout', {}, true);
}

/**
 * 返回键监听返回
 * ??? 问建秋
 */
// export async function 

let systemInfo = {};

/**
 * @description 获取用户信息
 */
export async function getUserInfo() {
	const res = await useBase('systemInfo');
	if (res) systemInfo = res;
	if (!(res && res.userInfo)) {
		throw new Error('获取用户信息失败', res);
	}
	return {
		...res.userInfo
	};
	/**
	{
		"userInfo": {
			"birthday": "2018-12-05",
			"relTenantIds": "",
			"sex": 2,
			"activitiSync": 1,
			"departIds": "b55e8e022b5a4c6681a4821cbfa2a3f3",
			"updateTime": "2023-03-28 14:10:57",
			"avatar": "framework/temp/W1USPJKL9OSC53CYQTK_1675674294991.png",
			"userIdentity": 2,
			"delFlag": 0,
			"realname": "管理员",
			"workNo": "00001",
			"createBy": "e9ca23d68d884d4ebb19d07889727dae",
			"post": "GLY",
			"createTime": "2019-06-21 17:54:10",
			"phone": "18611111111",
			"updateBy": "e9ca23d68d884d4ebb19d07889727dae",
			"orgCode": "A03",
			"id": "e9ca23d68d884d4ebb19d07889727dae",
			"email": "jeecg@163.com",
			"status": 1,
			"username": "admin"
		},
		"serverInfo": {
			"baseUrl": "http://172.16.40.41:8080/hf-back-scpsm-dev/",
			"token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2ODAxNjUwOTIsInVzZXJuYW1lIjoiYWRtaW4ifQ.GThrgyr1bJMNEQSB8Q_oNlnJ3hv48KZF0qRyLpN0YGM "
		},
		"versionInfo": {
			"versionCode": "xx",
			"versionName": "xx"
		}
	}
	 */
}

/**
 * @description 获取版本号
 */
export async function getVersion() {
	if (systemInfo && systemInfo.versionInfo) {
		return {
			...systemInfo.versionInfo
		};
	}
	const res = await useBase('systemInfo');
	if (res) systemInfo = res;
	if (!(res && res.versionInfo)) {
		throw new Error('获取版本号失败', res);
	}
	return {
		...res.versionInfo
	};
}

/**
 * @description 获取token
 */
export async function getToken() {
	const res = await useBase('systemInfo');
	if (res) systemInfo = res;
	if (!(res && res.serverInfo && res.serverInfo.token)) {
		throw new Error('获取token失败', res);
	}
	return res.serverInfo.token;
}

/**
 * @description 刷新token(重新获取token)
 */
export async function refreshToken() {
	const res = await useBase('tokenRefresh');
	if (!(res && res.token)) {
		throw new Error('获取token失败', res);
	}
	return res.token;
}

/**
 * @description 布局静默
 * @param {Object} params 参数
 * 	@param {Number} type 类型 1-布局静默, 2-布局上拉直至输入框可见
 */
export async function softInputMode({ type = 1 } = {}) {
	await useBase('softInputMode', {
		softInputModeType: type
	}, true);
}

/* ====================
		一些工具方法
 ==================== */

/**
 * @description 日期格式化
 * @param {Object} str
 */
function formatBirthday(str) {
	// '20230403'
	const year = str.substring(0, 4);
	const month = str.substring(4, 6);
	const day = str.substring(6, 8);
	return `${year}-${month}-${day}`;
}

/**
 * @description 日期格式化
 * @param {Object} str
 */
function formatDate(str) {
	// 2025年12月04日
	const yearIndex = str.indexOf('年');
	const monthIndex = str.indexOf('月');
	const dayIndex = str.indexOf('日');
	const year = str.substring(0, yearIndex);
	const month = str.substring(yearIndex + 1, monthIndex);
	const day = str.substring(monthIndex + 1, dayIndex);
	if (month.length == 1) {
		month = '0' + month;
	}
	if (day.length == 1) {
		day = '0' + day;
	}
	return `${year}-${month}-${day}`;
}
