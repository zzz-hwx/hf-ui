import { config } from '../config.js';
// #ifdef H5
import { compressAccurately } from '../utils/image-conversion/conversion.js';
// #endif
import { blobToPath, getFileInfo } from '../utils/index.js';
import { mapConversion } from '../utils/mapConversion.js';
import location from '@/uni_modules/hic-location/js_sdk/index.js';
import {
	chooseImage as uniChooseImage,
	chooseVideo as uniChooseVideo,
	chooseMedia as uniChooseMedia,
	chooseFile as uniChooseFile,
	makePhoneCall as uniMakePhoneCall,
	showActionSheet as uniShowActionSheet,
} from '@/uni_modules/hic-plugin';

/**
 * @description 从本地相册选择图片或使用相机拍照
 * @param {Object} params 参数
 * 	@param {Number} count = [9] 最多可以选择的图片张数，默认9
 * 	@param {Boolean} compress = [true] 是否压缩
 * 	@param {Number} size = [200] 图片压缩体积，单位Kb
 */
export async function chooseImage({ count = 9, compress = true, size = 200 } = {}) {
	const res = await uniChooseImage({ count });
	const fileArr = [];
	if (compress) {
		for (let i = 0; i < res.tempFiles.length; i++) {
			const file = res.tempFiles[i];
			// #ifdef H5
			const blob = await compressAccurately(file, size);	// 压缩 返回blob
			fileArr.push({
				path: blobToPath(blob, file.name),	// 本地文件路径
				name: file.name,	// 包含扩展名的文件名称，仅H5支持
				size: blob.size,	// 本地文件大小，单位：B(字节)
				type: file.type		// 文件类型，仅H5支持 image/jpeg
			});
			// #endif
			// #ifndef H5
			const info = getFileInfo(file.path);	// 微信小程序没有返回 name、type
			fileArr.push({
				path: file.path,	// 本地文件路径
				name: file.name || info.name,	// 包含扩展名的文件名称，仅H5支持
				size: file.size,	// 本地文件大小，单位：B(字节)
				type: file.type || info.type		// 文件类型，仅H5支持 image/jpeg
			});
			// #endif
		}
	} else {
		fileArr.push(...res.tempFiles);
	}
	return fileArr;	// 图片的本地文件路径列表
}

/**
 * @description 拍摄视频或从手机相册中选视频，返回视频的临时文件路径
 * @param {Object} params 参数
 * 	@param {Number} maxDuration 拍摄视频最长拍摄时间，单位秒
 */
export async function chooseVideo({ maxDuration = 10 } = {}) {
	const res = await uniChooseVideo({
		maxDuration
	});	// 只能选择1个
	const info = getFileInfo(res.tempFilePath);	// 微信小程序没有返回 name、type
	const fileArr = [{
		path: res.tempFilePath,
		name: res.name || info.name,
		size: res.size,
		type: (res.tempFile || {}).type || info.type
	}];
	return fileArr;
}

/**
 * @description 选择图片或视频
 * @param {Object} params 参数
 * 	@param {Number} count = [9] 最多可选择的数量，默认9，视频只可选择1
 * 	@param {Number} maxDuration 拍摄视频最长拍摄时间，单位秒
 */
export async function chooseMedia({ count = 9, maxDuration = 10 } = {}) {
	// #ifdef MP-WEIXIN
	const res = await uniChooseMedia({
		count,
		maxDuration
	});
	return res.tempFiles.map((item) => {
		const info = getFileInfo(item.tempFilePath);
		return {
			path: item.tempFilePath,
			name: info.name,
			size: item.size,
			type: info.type
		};
	});
	// #endif
	// #ifndef MP-WEIXIN
	const tapIndex = await uniShowActionSheet({ itemList: ['图片', '视频']});
	switch (tapIndex) {
		case 0:
			return chooseImage({ count });
		case 1:
			return chooseVideo({ maxDuration });
	}
	// #endif
}

/**
 * @description 从本地选择文件
 * @param {Object} params 参数
 * 	@param {Number} count = [1] 最多可以选择的文件数量
 */
export async function chooseFile({ count = 1 } = {}) {
	// #ifdef MP-WEIXIN
	// 微信小程序 没有 uni.chooseFile
	const res = await chooseMessageFile({ count });
	const fileArr = res.tempFiles.map(item => {
		const info = getFileInfo(item.path);
		return {
			path: item.path,
			name: item.name,
			size: item.size,
			type: info.type,	// api返回的type为video, image, file
		};
	});
	return fileArr;
	// #endif
	// #ifndef MP-WEIXIN
	const res = await uniChooseFile({
		count,
		// extension: ['.zip','.doc'],	// 根据文件拓展名过滤，每一项都不能是空字符串。默认不过滤
	});
	const fileArr = res.tempFiles.map(item => {
		return {
			path: item.path,
			name: item.name,
			size: item.size,
			type: item.type
		};
	});
	return fileArr;
	// #endif
}

/**
 * @description 获取当前的地理位置
 * @param {Object} params 参数
 * 	@param {String} coordinateSystem 返回的经纬度坐标系 默认值为空 不进行坐标系转换
 * uni.getLocation 默认为 wgs84 (小程序 腾讯/高德地图 坐标系gcj02 返回的经纬度是什么坐标系 ???)
 */
export async function getLocation({ coordinateSystem = config.coordinateSystem } = {}) {
	// return {
	// 	latitude: '26.001892',
	// 	longitude: '119.192047',
	// 	address: '临时...'
	// }
	const res = await location.reverseGeocoder();
	res.coordinateSystem = 'wgs84';	// 设置默认值 (uni.getLocation默认返回wgs84坐标)
	const [longitude, latitude] = mapConversion(res.longitude, res.latitude, res.coordinateSystem, coordinateSystem);
	return {
		...res,
		latitude,
		longitude,
		address: res.address,
	};
}

/**
 * @description 打开地图选择位置
 * @param {Object} params 参数
 * 	@param {String | Number} latitude 纬度
 * 	@param {String | Number} longitude 经度
 * 	@param {String} coordinateSystem 坐标系
 */
export function chooseLocation({ latitude = '', longitude = '', coordinateSystem = config.coordinateSystem } = {}) {
	return new Promise((resolve, reject) => {
		const coord = 'gcj02';
		// 微信小程序 默认打开腾讯地图 坐标系: gcj02
		// APP 默认打开高德地图 坐标系: gcj02
		// uni.chooseLocation 返回经纬度 使用 gcj02 国测局坐标系
		[longitude, latitude] = mapConversion(longitude, latitude, coordinateSystem, coord);	// 坐标系转换
		// console.log('--- uni.chooseLocation 前 --->', longitude, latitude, coord)
		uni.chooseLocation({
			latitude,
			longitude,
			success: (res) => {
				// console.log('--- uni.chooseLocation --->', res, coord)
				const [lng, lat] = mapConversion(res.longitude, res.latitude, coord, coordinateSystem);
				resolve({
					latitude: lat,
					longitude: lng,
					address: res.address
				});
			},
			fail: (err) => {
				reject(err);
			}
		});
	})
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
	await uniMakePhoneCall(phoneNumber);
}

/**
 * @description 调起客户端扫码界面，扫码成功后返回对应的结果
 * @param {Object} params 参数
 * @return {Object} 扫码对应结果
 * 	@param {String} result 所扫码的内容
 */
export function scanCode(params) {
	return new Promise((resolve, reject) => {
		uni.scanCode({
			...params,
			success: (res) => {
				resolve(res);
			},
			fail: (err) => {
				reject(err);
			}
		});
	});
}

/**
 * @description 新开页面打开文档，支持格式：doc, xls, ppt, pdf, docx, xlsx, pptx。
 * @param {Object} params 参数
 * 	@param {String} path 文件路径
 * 	@param {Boolean} showMenu 右上角是否有可以转发分享的功能(仅微信小程序)
 * 
 */
// #ifndef H5
export async function openDocument({ path = '', showMenu = false } = {}) {
	if (!path) {
		throw new Error('缺少参数 path');
	}
	const filePath = await uniDownloadFile({ url: path });
	await uniOpenDocument({ filePath });
	// const arr = ['doc', 'xls', 'ppt', 'pdf', 'docx', 'xlsx', 'pptx'];	// uni.openDocument 支持格式
	// uni.$u.toast('该文件不支持预览');
}
// #endif

/* ====================
		一些工具方法
 ==================== */

// #ifdef MP-WEIXIN
function chooseMessageFile({ count }) {
	return new Promise((resolve, reject) => {
		wx.chooseMessageFile({
			count,
			type: 'all',
			// extension: [''],	// 根据文件拓展名过滤，仅 type==file 时有效。每一项都不能是空字符串。默认不过滤。
			success: (res) => {
				resolve(res);
			},
			fail: (err) => {
				console.log(err);
				reject();
			}
		});
	});
}
// #endif

// #ifndef H5
function uniDownloadFile({ url } = {}) {
	return new Promise((resolve, reject) => {
		// 下载文件
		uni.downloadFile({
			url,
			success: (res) => {
				console.log(res);
				if (res.statusCode === 200) {
					resolve(res.tempFilePath);
				} else {
					reject(res);
				}
			},
			fail: (err) => {
				console.log(err);
				reject(err);
			}
		});
	});
}

function uniOpenDocument({ filePath, showMenu = false } = {}) {
	return new Promise((resolve, reject) => {
		// 新开页面打开文档，支持格式：doc, xls, ppt, pdf, docx, xlsx, pptx
		uni.openDocument({
			filePath,
			showMenu,
			success: (res) => {
				console.log('--- 打开文档成功 --->', res);
				resolve(res);
			},
			fail: (err) => {
				console.log(err);
				uni.$u.toast('该文件不支持预览');
				reject(err);
			}
		});
	});
}
// #endif
