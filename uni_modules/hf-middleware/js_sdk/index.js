export * from './config';

import { QUICK_API, SELF_API, UNI_API, config } from './config';

import * as quickApi from './api/quick';
import * as selfApi from './api/self';
import * as uniApi from './api/uni';

const apiMap = {
	[QUICK_API]: quickApi,
	[SELF_API]: selfApi,
	[UNI_API]: uniApi
};

/**
 * @description 从本地相册选择图片或使用相机拍照
 * @param {Object} params 参数
 * 	@param {Number} count = [9] 最多可以选择的图片张数，默认9
 * @return {Array} 选择的图片列表
 * 	@param {String} path 本地文件路径
 * 	@param {String} name 包含扩展名的文件名称
 * 	@param {Number} size 文件大小，单位：B(字节)
 * 	@param {String} type 文件类型
 */
export function chooseImage(...args) {
	if (!apiMap[config.usedApi].chooseImage) {
		throw new Error(`${config.usedApi} is not has chooseImage`);
	}
	return apiMap[config.usedApi].chooseImage(...args);
}

/**
 * @description 选择视频
 */
export function chooseVideo(...args) {
	if (!apiMap[config.usedApi].chooseVideo) {
		throw new Error(`${config.usedApi} is not has chooseVideo`);
	}
	return apiMap[config.usedApi].chooseVideo(...args);
}

/**
 * @description 选择图片或视频
 * @param {Object} params 参数
 * 	@param {Number} count = [9] 最多可选择的数量，默认9，视频只可选择1
 */
export function chooseMedia(...args) {
	if (!apiMap[config.usedApi].chooseMedia) {
		throw new Error(`${config.usedApi} is not has chooseMedia`);
	}
	return apiMap[config.usedApi].chooseMedia(...args);
}

/**
 * @description 选择文件
 * @param {Object} params 参数
 * 	@param {Number} count = [1] 最多可以选择的文件数量，默认1
 * @return {Array} 选择的文件列表
 * 	@param {String} path 本地文件路径
 * 	@param {String} name 包含扩展名的文件名称
 * 	@param {Number} size 文件大小，单位：B(字节)
 * 	@param {String} type 文件类型
 */
export function chooseFile(...args) {
	if (!apiMap[config.usedApi].chooseFile) {
		throw new Error(`${config.usedApi} is not has chooseFile`);
	}
	return apiMap[config.usedApi].chooseFile(...args);
}

/**
 * 录音
 */
export function getRecord(...args) {
	if (!apiMap[config.usedApi].getRecord) {
		throw new Error(`${config.usedApi} is not has getRecord`);
	}
	return apiMap[config.usedApi].getRecord(...args);
}

/**
 * @description 定位
 */
export function getLocation(...args) {
	if (!apiMap[config.usedApi].getLocation) {
		throw new Error(`${config.usedApi} is not has getLocation`);
	}
	return apiMap[config.usedApi].getLocation(...args);
}

/**
 * @description 打开地图选择位置
 */
export function chooseLocation(...args) {
	if (!apiMap[config.usedApi].chooseLocation) {
		throw new Error(`${config.usedApi} is not has chooseLocation`);
	}
	return apiMap[config.usedApi].chooseLocation(...args);
}

/**
 * @description 拨打电话
 * @param {String} phoneNumber 需要拨打的电话号码
 */
export function makePhoneCall(...args) {
	if (!apiMap[config.usedApi].makePhoneCall) {
		throw new Error(`${config.usedApi} is not has makePhoneCall`);
	}
	return apiMap[config.usedApi].makePhoneCall(...args);
}

/**
 * @description AnyRtc 视频/语音通话
 * @param {Object} params 参数
 * 	@param {String} userId 用户id(必传)
 * 	@param {Number} type 类型 0-视频, 1-语音
 */
export function anyRtc(...args) {
	if (!apiMap[config.usedApi].anyRtc) {
		throw new Error(`${config.usedApi} is not has anyRtc`);
	}
	return apiMap[config.usedApi].anyRtc(...args);
}

/**
 * @description 调起客户端扫码界面，扫码成功后返回对应的结果
 * @param {Object} params 参数
 * @return {Object} 扫码对应结果
 * 	@param {String} result 所扫码的内容
 */
export function scanCode(...args) {
	if (!apiMap[config.usedApi].scanCode) {
		throw new Error(`${config.usedApi} is not has scanCode`);
	}
	return apiMap[config.usedApi].scanCode(...args);
}

/**
 * @description 证件OCR正/反面
 */
export function getIdCardOcr(...args) {
	if (!apiMap[config.usedApi].getIdCardOcr) {
		throw new Error(`${config.usedApi} is not has getIdCardOcr`);
	}
	return apiMap[config.usedApi].getIdCardOcr(...args);
}

/**
 * @description 退出登录
 */
export function logout(...args) {
	if (!apiMap[config.usedApi].logout) {
		throw new Error(`${config.usedApi} is not has logout`);
	}
	return apiMap[config.usedApi].logout(...args);
}

/**
 * @description 获取用户信息
 */
export function getUserInfo(...args) {
	if (!apiMap[config.usedApi].getUserInfo) {
		throw new Error(`${config.usedApi} is not has getUserInfo`);
	}
	return apiMap[config.usedApi].getUserInfo(...args);
}

/**
 * @description 获取版本号
 */
export function getVersion(...args) {
	if (!apiMap[config.usedApi].getVersion) {
		throw new Error(`${config.usedApi} is not has getVersion`);
	}
	return apiMap[config.usedApi].getVersion(...args);
}

/**
 * @description 获取token
 */
export function getToken(...args) {
	if (!apiMap[config.usedApi].getToken) {
		throw new Error(`${config.usedApi} is not has getToken`);
	}
	return apiMap[config.usedApi].getToken(...args);
}

/**
 * @description 刷新token
 */
export function refreshToken(...args) {
	if (!apiMap[config.usedApi].refreshToken) {
		throw new Error(`${config.usedApi} is not has refreshToken`);
	}
	return apiMap[config.usedApi].refreshToken(...args);
}

/**
 * @description 获取系统信息
 */
export function getSystemInfo(...args) {
	if (!apiMap[config.usedApi].getSystemInfo) {
		throw new Error(`${config.usedApi} is not has getSystemInfo`);
	}
	return apiMap[config.usedApi].getSystemInfo(...args);
}

/**
 * @description 布局静默
 * @param {Object} params 参数
 * 	@param {Number} type 类型 1-布局静默, 2-布局上拉直至输入框可见
 */
export function softInputMode(...args) {
	if (!apiMap[config.usedApi].softInputMode) {
		throw new Error(`${config.usedApi} is not has softInputMode`);
	}
	return apiMap[config.usedApi].softInputMode(...args);
}

/**
 * @description 文档预览
 * @param {Object} params 参数
 * 	@param {String} path 文件地址
 */
export function openDocument(...args) {
	if (!apiMap[config.usedApi].openDocument) {
		throw new Error(`${config.usedApi} is not has openDocument`);
	}
	return apiMap[config.usedApi].openDocument(...args);
}
