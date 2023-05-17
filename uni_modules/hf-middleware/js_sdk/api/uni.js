// #ifdef H5
import { compressAccurately } from '../utils/image-conversion/conversion.js';
// #endif
import { blobToPath, getFileInfo } from '../utils/index.js';
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
 * @description 选择图片或视频
 * @param {Object} params 参数
 * 	@param {Number} count = [9] 最多可选择的数量，默认9，视频只可选择1
 */
export async function chooseMedia({ count = 9 } = {}) {
	// #ifdef MP-WEIXIN
	const res = await uniChooseMedia();
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
			return chooseVideo();
	}
	// #endif
}

/**
 * @description 从本地选择文件
 * @param {Object} params 参数
 * 	@param {Number} count = [1] 最多可以选择的文件数量
 */
export async function chooseFile({ count = 1 } = {}) {
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
