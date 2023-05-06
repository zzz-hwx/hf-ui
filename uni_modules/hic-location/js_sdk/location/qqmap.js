import config from '../config';
import QQMapWX from '../sdk/qqmap-wx-jssdk';

const qqmapsdk = new QQMapWX({ // 腾讯
	key: config.QQ_MAP_KEY
});

/**
 * qq_map 数据格式化
 * @param {*} res 
 */
export function format (res) {
	if (!res.result) {
		throw new Error('地址逆解析失败');
	}
	const result = {
		latitude: res.result.location.lat,
		longitude: res.result.location.lng,
		location: res.result.formatted_addresses.recommend, // 平潭海岛国家森林公园(翠园中路东)
		address: res.result.address			// 福建省福州市平潭县翠园中路
	};
	if (res.result.ad_info) {
		const adInfo = res.result.ad_info;
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

function _reverseGeocoder ({ latitude, longitude } = {}) {
	return new Promise((resolve, reject) => {
		let location = '';
		if (latitude && longitude) {
			location = `${latitude},${longitude}`;	// lat<纬度>,lng<经度>
		}
		qqmapsdk.reverseGeocoder({
			location,
			success: (res) => {
				resolve(res);
			},
			fail: (err) => {
				console.log('地址逆解析失败', err);
				reject();
			}
		})
	})
}


/**
 * 地址逆解析
 * @param {*} param 
 */
export async function reverseGeocoder (...args) {
	const res = await _reverseGeocoder(...args);
	const result = format(res);
	return result;
}
