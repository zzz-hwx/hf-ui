/* ========================================
		一些和底座交互的工具方法
 ======================================== */

import { config } from '../config.js';

/**
 * @description 封装imitateJsonp, promise化
 * @param {String} type	功能类型
 * @param {Object} data	参数
 * @param {Boolean} sync 是否同步(没有回调函数)
 * @example const res = await useBase('selectImage', { maxCount: 1 });
 */
export function useBase(type, data, sync = false) {
	if (sync) {
		// 同步调用 没有回调(success)
		return new Promise((resolve) => {
			imitateJsonp({
				type,
				data
			});
			resolve();
		});
	}
	return new Promise((resolve, reject) => {
		imitateJsonp({
			type,
			data,
			success: (res) => {
				resolve(res);
			}
		});
	});
}

/**
 * @description 仿照jsonp
 * @param {Object} option 配置参数
 * 	@property {String} type 功能类型
 * 	@property {Object} data 参数
 * 	@property {Function} success 回调函数
 * @example imitateJsonp({
		type: '',
		data: {},
		success: function (params) {}
	})
 */
function imitateJsonp(option) {
	if (!option.type) {
		throw new Error('type is not find');
	}
	const params = {
		type: option.type,
		...(option.data || {}),
	};
	if (typeof(option.success) === 'function') {
		const callback = `cb_${option.type}_${uni.$u.guid(8)}`;
		params.function = callback;
		window[callback] = option.success;
	}
	const url = getUrl(params);
	console.log('--- url --->', url);
	window.location = url;
}

function getUrl(data) {
	const { protocol = '', path = '' } = config.usedConfig;
	return `${protocol}${path}${uni.$u.queryParams(data)}`;
}
