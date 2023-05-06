// #ifdef H5
import { compressAccurately } from '../utils/image-conversion/conversion.js';
import { blobToPath } from '../utils/index.js';
// #endif
import location from '@/uni_modules/hic-location/js_sdk/index.js';

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
			fileArr.push({
				path: file.path,	// 本地文件路径
				name: file.name,	// 包含扩展名的文件名称，仅H5支持
				size: file.size,	// 本地文件大小，单位：B(字节)
				type: file.type		// 文件类型，仅H5支持 image/jpeg
			});
			// #endif
		}
	} else {
		fileArr.push(...res.tempFiles);
	}
	console.log('--- uni.chooseImage --->', res.tempFiles, fileArr);
	return fileArr;	// 图片的本地文件路径列表
}

/**
 * @description 拍摄视频或从手机相册中选视频，返回视频的临时文件路径
 */
export async function chooseVideo() {
	const res = await uniChooseVideo();	// 只能选择1个
	const fileArr = [{
		path: res.tempFilePath,
		name: res.name,
		size: res.size,
		type: (res.tempFile || {}).type
	}];
	return fileArr;
}

/**
 * @description 从本地选择文件
 * @param {Object} params 参数
 * 	@param {Number} count = [1] 最多可以选择的文件数量
 */
export async function chooseFile({ count = 1 } = {}) {
	const res = await uniChooseFile({ count });
	const fileArr = res.tempFiles.map(item => {
		return {
			path: item.path,
			name: item.name,
			size: item.size,
			type: item.type
		};
	});
	return fileArr;
}

/**
 * @description 获取当前的地理位置
 */
export async function getLocation() {
	const res = await location.reverseGeocoder();
	return {
		...res,
		latitude: res.latitude,
		longitude: res.longitude,
		address: res.address,
	};
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

/* ====================
		一些工具方法
 ==================== */

/**
 * 封装 uni.chooseImage
 */
function uniChooseImage({ count } = {}) {
	return new Promise((resolve, reject) => {
		uni.chooseImage({
			count,
			sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album', 'camera'], // 从相册选择 使用相机
			success: (res) => {
				console.log('--- uni.chooseImage --->', res);
				resolve(res);
			},
			fail: (err) => {
				reject(err);
			}
		});
	});
}

/**
 * 封装 uni.chooseVideo
 */
function uniChooseVideo() {
	return new Promise((resolve, reject) => {
		uni.chooseVideo({
			sourceType: ['album', 'camera'],	// album 从相册选视频，camera 使用相机拍摄
			success: (res) => {
				console.log('--- uni.chooseVideo --->', res);
				resolve(res);
			},
			fail: (err) => {
				reject(err);
			}
		});
	});
}

/**
 * 封装 uni.chooseFile
 */
function uniChooseFile({ count, type = 'all' } = {}) {
	return new Promise((resolve, reject) => {
		uni.chooseFile({
			count,
			type,	// 所选的文件的类型 all, video, image
			// extension: ['.zip','.doc'],	// 根据文件拓展名过滤，每一项都不能是空字符串。默认不过滤。
			success: (res) => {
				console.log('--- uni.chooseFile --->', res);
				resolve(res);
			},
			fail: (err) => {
				reject(err);
			}
		});
	});
}

/**
 * 封装 uni.makePhoneCall
 */
function uniMakePhoneCall(phoneNumber) {
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
