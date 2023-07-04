
const mimeType = new Map([	// 类型 - MIME类型 对应关系
	// 图片 image
	['JPEG', 'image/jpeg'],
	['PNG', 'image/png'],
	['GIF', 'image/gif'],
	// 视频 video
	['MP4', 'video/mp4'],
	// 音频 audit
	['MP3', 'audio/mpeg']
]);

const typeMap = new Map([	// 文件类型 - 类型 对应关系
	// JPEG
	['jpg', 'JPEG'],
	['jpeg', 'JPEG'],
	['jpe', 'JPEG'],
	['jfif', 'JPEG'],
	// png
	['png', 'PNG'],
	// gif
	['gif', 'GIF'],
	// mp4
	['mp4', 'MP4'],
	// mp3
	['mp3', 'MP3']
])

/**
 * @description 根据文件后缀(jpg mp4) 返回MIME类型(image/jpeg video/mp4)
 * @param {String} fileType 文件后缀
 * @return {String} MIME类型
 */
export function getFileType(fileType) {
	if (typeMap.has(fileType)) {
		return mimeType.get(typeMap.get(fileType));
	}
	return '';
}

/**
 * @description 根据文件路径 返回文件信息
 * @param {String} path 文件路径
 * @return {Object} 文件信息
 */
export function getFileInfo(path) {
	const extIndex = path.lastIndexOf('.');
	const ext = path.substring(extIndex + 1);	// 扩展名 jpg mp4
	const nameIndex = path.lastIndexOf('/');
	const name = path.substring(nameIndex + 1);	// 文件名 xxx.jpg
	const type = getFileType(ext);				// 文件MIME类型 image/jpeg
	return {
		path,	// 文件路径
		name,	// 文件名
		type,	// 文件类型
	};
}

/**
 * @description base64 转 Blob对象 (仅H5可用)
 * @param {String} base64 完整 || 不完整的 base64
 * @param {String} fileType 文件类型
 */
function base64ToBlob(base64, fileType) {
	const arr = base64.split(',');
	let type = mimeType.get('JPEG');
	if (arr.length === 1) {
		// 不完整的base64: 通过第二个参数fileType转换得到 MIME类型
		type = getFileType(fileType);
	} else if (arr.length === 2) {
		// 完整的base64: 通过正则匹配得到 MIME类型
		type = arr[0].match(/:(.*?);/)[1];
	}
	const arrayBuffer = uni.base64ToArrayBuffer(base64);
	return new Blob([arrayBuffer], { type: type });
}

/**
 * @description Blob对象 转 URL地址(仅H5可用)
 * @param {Object} blob
 */
export function blobToPath(blob, fileName) {
	// const file = new File(blob, fileName);
	return (window.URL || window.webkitURL).createObjectURL(blob);
}

/**
 * @description base64 转 URL地址(仅H5可用)
 * @param {Object} base64 完整 || 不完整的 base64
 * @param {Object} fileType 文件类型
 */
export function base64ToPath(base64, fileType, fileName) {
	const blob = base64ToBlob(base64, fileType);
	return blobToPath(blob, fileName);
}
