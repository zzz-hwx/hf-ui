import config from '../config';
import amap from '../sdk/amap-wx';

const amapPlugin = new amap.AMapWX({ // 高德
	key: config.A_MAP_KEY
});

/**
 * a_map 数据格式化
 * @param {*} res 
 */
export function format (res) {
	if (!(Array.isArray(res) && res.length)) {
		throw new Error('地址逆解析失败');
	}
	const data = res[0];
	const result = {
		latitude: data.latitude,
		longitude: data.longitude,
		location: data.desc, // 平潭海岛国家森林公园附近
		address: data.name // 福州市平潭县翠园中路265号
	};
	if (data.regeocodeData.addressComponent) {
		const adInfo = data.regeocodeData.addressComponent;
		result.provName = adInfo.province;
		result.cityName = adInfo.city;
		result.countyName = adInfo.district;
		if (adInfo.adcode) {
			const adcode = adInfo.adcode;	// 350128
			result.adcode = adcode;
			// substring(start, end)
			// padEnd(maxLength, fillString)
			result.prov = adcode.substring(0, 2).padEnd(12, '0');
			result.city = adcode.substring(0, 4).padEnd(12, '0');
			result.county = adcode.substring(0, 6).padEnd(12, '0');
		}
	}
	return result;
}

function _getRegeo ({ latitude, longitude } = {}) {
	return new Promise((resolve, reject) => {
		let location = ''
		if (latitude && longitude) {
			location = `${longitude},${latitude}`;	// lng<经度>,lat<纬度>
		}
		amapPlugin.getRegeo({
			location,
			success: (res) => {
				resolve(res);
			},
			fail: (err) => {
				console.log('地址逆解析失败', err);
				reject(err);
			}
		})
	})
}

/**
 * 地址逆解析
 * @param {*} param
 */
export async function reverseGeocoder (...args) {
	const res = await _getRegeo(...args);
	const result = format(res);
	return result;
}
