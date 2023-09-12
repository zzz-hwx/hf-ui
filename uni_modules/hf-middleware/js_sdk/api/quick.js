import { useBase } from '../utils/base.js';
import { base64ToPath, getFileType } from '../utils/index.js';
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
 * @description 选择视频 (只允许MP4格式)
 * 使用选择文件接口, 快应没有提供选择视频的api
 */
export async function chooseVideo() {
	const count = 1;	// 只允许选择1个
	const res = await useBase('selectVideo', {
		maxCount: count
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
 */
export async function chooseMedia({ count = 9 } = {}) {
	const tapIndex = await uniShowActionSheet({ itemList: ['图片', '视频']});
	switch (tapIndex) {
		case 0:
			return chooseImage({ count });
		case 1:
			return chooseVideo();
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
 */
export async function getLocation() {
	const res = await useBase('location');
	return {
		latitude: res.lat,	// 纬度
		longitude: res.lon,	// 经度
		address: res.address	// 地址信息
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
