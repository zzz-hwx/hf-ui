// #ifdef MP-WEIXIN
import * as utils from '../utils';
// import * as map from '../location/qqmap';
import * as map from '../location/amap';
import modal from '@/uni_modules/hic-plugin/js_sdk/message/modal.js';
import toast from '@/uni_modules/hic-plugin/js_sdk/message/toast.js';

/**
 * @description 定位 获取经纬度
 * @param {Boolean} loading 是否显示加载中
 * @param {Boolean} noHideLoading 是否不关闭加载中
 * @return {Object} 经纬度
 */
export async function getLocation (loading = false, noHideLoading = false) {
	// 提前判断是否授权
	await getAuthorize();
	if (loading) {
		uni.showLoading({ title: '获取信息中' });
	}
	try {
		// 定位 获取经纬度
		const res = await utils.getLocation();
		return res;
	} catch (err) {
		// 获取位置失败 调起小程序设置界面
		await getLocationFail();
		// 重试一次
		const res = await utils.getLocation();
		return res;
	} finally {
		if (!noHideLoading) {
			uni.hideLoading();
		}
	}
}

/**
 * 地址逆解析
 * @param {*} param 经纬度
 */
export async function reverseGeocoder({ latitude, longitude, loading = true } = {}) {
	try {
		let param = { latitude, longitude };
		if (typeof(latitude) === 'undefined' || typeof(longitude) === 'undefined') {
			param = await getLocation(loading, true);
		}
		const result = await map.reverseGeocoder(param);
		return result;
	} finally {
		uni.hideLoading();
	}
}

/**
 * @description 判断是否授权
 * 返回 resolve 才走后续获取位置操作
 */
async function getAuthorize () {
	const setting = await utils.getSetting();
	if (setting === true) {
		// 用户已授权地理位置
		return true;
	} else if (typeof(setting) === 'undefined') {
		// 未设置
		return await utils.authorize();
	} else {
		await modal({
			title: '提示',
			content: '请授权位置权限，并将GPS定位打开',
			confirmText: '去设置'
		}).catch(() => {
			toast('需打开位置权限以使用该功能');
			return Promise.reject();
		});
		await utils.openSetting();
	}
}

async function getLocationFail () {
	await modal({
		title: '提示',
		content: '请授权位置权限，并将GPS定位打开',
		confirmText: '去设置'
	});
	await utils.openSetting();
}
// #endif
