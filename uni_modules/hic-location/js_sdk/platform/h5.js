// #ifdef H5
import config from '../config';
import * as utils from '../utils';
import { format } from '../location/qqmap';
import { jsonp } from '../vue-jsonp/index';

/**
 * @description 定位 获取经纬度
 * @param {Boolean} loading 是否显示加载中
 * @param {Boolean} noHideLoading 是否不关闭加载中
 * @return {Object} 经纬度
 */
export async function getLocation (loading = false, noHideLoading = false) {
	if (loading) {
		uni.showLoading({ title: '获取信息中' });
	}
	try {
		console.time('location');
		const res = await utils.getLocation();
		return res;
	} finally {
		console.timeEnd('location');
		if (!noHideLoading) {
			uni.hideLoading();
		}
	}
}

/**
 * 地址逆解析
 * @param {*} param 经纬度
 */
export async function reverseGeocoder ({ latitude, longitude, loading = true } = {}) {
	try {
		let param = { latitude, longitude };
		if (typeof(latitude) === 'undefined' || typeof(longitude) === 'undefined') {
			param = await getLocation(loading, true);
		}
		const result = await _reverseGeocoder(param);
		return result;
	} finally {
		uni.hideLoading();
	}
}

/**
 * 逆地址解析 (jsonp 绕跨域)
 * @param {String} location 
 */
async function _reverseGeocoder({ latitude, longitude } = {}) {
	let location = '';
	if (latitude && longitude) {
		location = `${latitude},${longitude}`; // lat<纬度>,lng<经度>
	}
	if (!location) {
		throw new Error('address、location、smart_address必须且只能存在一个');
	}
	const url = 'https://apis.map.qq.com/ws/geocoder/v1/';
	const params = {
		coord_type: 5,
		get_poi: 0,
		output: 'jsonp',
		key: config.QQ_MAP_KEY,
		location
	};
	return await jsonp(url, params).then((res) => {
		return format(res);
	}).catch((err) => {
		console.log(err);
		return new Error('地址逆解析失败');
	});
}
// #endif
