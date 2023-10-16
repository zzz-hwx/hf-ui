import { config } from '../config.js';
import { useBase } from '../utils/base.js';
import { base64ToPath, getFileType } from '../utils/index.js';
import { mapConversion } from '../utils/mapConversion.js';
import {
	modal,
	showActionSheet as uniShowActionSheet
} from '@/uni_modules/hic-plugin';

/* ====================
		快应api
 ==================== */

/**
 * @description 选择图片
 * 从本地相册选择图片或使用相机拍照
 * @param {Object} params 参数
 * 	@param {Number} count 最多可以选择的图片张数，默认9
 */
export async function chooseImage({ count = 9 } = {}) {
	if (count < 1) count = 1;
	if (count > 9) count = 9;
	const res = await useBase('selectImage', {
		maxCount: count,	// 图片支持最多可选的个数,(1~9)
		way: 3	// 方式: 1相册, 2摄像头, 3相册+摄像头
	});
	// 返回经过压缩的图片base64
	// [{"name":"IMG_20230314_162517.jpg","size":6498,"fileType":"jpg","image":"不完整的base64"}]
	const fileArr = res.map((item) => {
		return {
			path: base64ToPath(item.image, item.fileType, item.name),
			name: item.name,
			size: item.size,
			type: getFileType(item.fileType)
		};
	});
	console.log('--- chooseImage --->', fileArr);
	return fileArr;
}

/**
 * @description 拍摄视频或从手机相册中选视频
 * @param {Object} params 参数
 * 	@param {Number} maxDuration 拍摄视频最长拍摄时间，单位秒
 */
export async function chooseVideo({ maxDuration = 10 } = {}) {
	const count = 1;	// 只允许选择1个
	const res = await useBase('selectVideo', {
		maxCount: count,
		maxDuration
	});
	const fileArr = res.map((item) => {
		return {
			path: base64ToPath(item.video, item.fileType, item.name),	// 不知道怎么拼文件类型 (埋雷 T^T)
			name: item.name,
			size: item.size,
			type: getFileType(item.fileType)
		}
	}).filter(Boolean);
	console.log('--- quick.chooseVideo --->', JSON.stringify(fileArr));
	return fileArr;
}

/**
 * @description 选择图片或视频
 * @param {Object} params 参数
 * 	@param {Number} count = [9] 最多可选择的数量，默认9，视频只可选择1
 * 	@param {Number} maxDuration 拍摄视频最长拍摄时间，单位秒
 */
export async function chooseMedia({ count = 9, maxDuration = 10 } = {}) {
	const tapIndex = await uniShowActionSheet({ itemList: ['图片', '视频']});
	switch (tapIndex) {
		case 0:
			return chooseImage({ count });
		case 1:
			return chooseVideo({ maxDuration });
	}
}

/**
 * @description 选择文件
 * @param {Object} params 参数
 * 	@param {Number} count 文件支持最多可选的个数
 */
// export async function chooseFile({ count = 1 } = {}) {
// 	if (count !== 1) count = 1;	// 底座目前仅支持1个
// 	const res = await useBase('selectFiles', {
// 		maxCount: count
// 	});
// 	// [{"name":"文件名","size":单位字节,"fileType":"文件类型","file":"不完整的base64"}]
// 	const fileArr = res.map((item) => {
// 		return {
// 			path: base64ToPath(item.file, item.fileType, item.name),	// 不知道怎么拼文件类型 (埋雷 T^T)
// 			name: item.name,
// 			size: item.size,
// 			type: getFileType(item.fileType)
// 		};
// 	})
// 	console.log('--- chooseFile --->', fileArr);
// 	return fileArr;
// }

/**
 * @description 获取当前的地理位置
 * @param {Object} params 参数
 * 	@param {String} coordinateSystem 返回的经纬度坐标系 默认值为空 不进行坐标系转换
 */
export async function getLocation({ coordinateSystem = config.coordinateSystem } = {}) {
	const res = await useBase('location');
	res.coordinateSystem = res.coordinateSystem || 'wgs84';	// 如果底座没有返回 设置默认值 'wgs84'
	const [longitude, latitude] = mapConversion(res.lon, res.lat, res.coordinateSystem, coordinateSystem);
	return {
		latitude,	// 纬度
		longitude,
		address: res.address	// 地址信息
	};
}

/**
 * @description 打开地图选择位置
 * @param {Object} params 参数
 * 	@param {String | Number} latitude 纬度
 * 	@param {String | Number} longitude 经度
 * 	@param {String} coordinateSystem 坐标系
 */
export async function chooseLocation({ latitude = '', longitude = '', coordinateSystem = config.coordinateSystem } = {}) {
	const coord = 'gcj02';
	// 微信小程序 默认打开腾讯地图 坐标系: gcj02
	// APP 默认打开高德地图 坐标系: gcj02
	// uni.chooseLocation 返回经纬度 使用 gcj02 国测局坐标系
	[longitude, latitude] = mapConversion(longitude, latitude, coordinateSystem, coord);	// 坐标系转换
	const res = await useBase('chooseLocation', {
		latitude,
		longitude,
	});
	const [lng, lat] = mapConversion(res.longitude, res.latitude, coord, coordinateSystem);
	return {
		latitude: lat,
		longitude: lng,
		address: res.address
	};
}

/**
 * @description 调起客户端扫码界面，扫码成功后返回对应的结果
 * @param {Object} params 参数
 * @return {Object} 扫码对应结果
 * 	@param {String} result 所扫码的内容
 */
export async function scanCode() {
	const res = await useBase('scan', {
		action: 1	// 0-默认跳转 1-返回文字
	});
	if (!(res && res.result)) {
		throw new Error('二维码扫描失败', res);
	}
	return {
		result: res.result
	};
}

/**
 * @description 文档预览
 * @param {Object} params 参数
 * 	@param {String} path 文件地址
 */
export async function openDocument({ path = '' } = {}) {
	if (!path) {
		throw new Error('缺少参数 path');
	}
	await useBase('document', {
		documentPath: encodeURIComponent(path)	// 文档下载地址
	}, true);
}

/**
 * @description 获取token
 */
export async function getToken() {
	const res = await useBase('userAuth', {
		authType: 1
	});
	if (!res) {
		throw new Error('获取token失败', res);
	}
	return res;
}

/**
 * @description 刷新token(重新获取token)
 */
export async function refreshToken() {
	const res = await useBase('userAuth', {
		authType: 1
	});
	if (!res) {
		throw new Error('获取token失败', res);
	}
	return res;
}

/**
 * @description 获取系统信息
 */
export async function getSystemInfo() {
	const res = await useBase('appInfo');
	if (!res) {
		throw new Error('获取系统信息失败');
	}
	/**
	 {
		paddingTop: 20,
		paddingBottom: 0,
		screenWidth: 375,
		screenHeight: 667,
		navigatorHeight: 44,
		themeColor: "Oxffffffff"
	 }
	 */
	console.log('快应api, 获取app基础信息', res);
	return {
		statusBarHeight: res.paddingTop
	};
}
