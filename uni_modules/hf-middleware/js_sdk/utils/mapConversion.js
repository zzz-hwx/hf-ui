/**
 * 百度坐标（BD09）、国测局坐标（火星坐标，GCJ02）、WGS84坐标系 之间的转换
 * 
 * bd09togcj02	// 百度转火星
 * gcj02tobd09	// 火星转百度
 * wgs84togcj02	//wgs转火星
 * gcj02towgs84	//火星转wgs
 * BD_MKT2WGS	//百度墨卡托转百度经纬度
 * BD_WGS2MKT	//百度经纬度转百度墨卡托
 * latLng2WebMercator	//经纬度转墨卡托
 * webMercator2LngLat	//墨卡托转经纬度
 */

// 定义一些常量
const x_PI = 3.14159265358979324 * 3000.0 / 180.0;
const PI = 3.1415926535897932384626;
const a = 6378245.0;
const ee = 0.00669342162296594323;
const MCBAND = [12890594.86, 8362377.87, 5591021, 3481989.83, 1678043.12, 0];
const LLBAND = [75, 60, 45, 30, 15, 0];
const MC2LL = [
	[1.410526172116255e-8, 0.00000898305509648872, -1.9939833816331, 200.9824383106796, -
		187.2403703815547, 91.6087516669843, -23.38765649603339, 2.57121317296198, -0.03801003308653,
		17337981.2
	],
	[-7.435856389565537e-9, 0.000008983055097726239, -0.78625201886289, 96.32687599759846, -
		1.85204757529826, -59.36935905485877, 47.40033549296737, -16.50741931063887, 2.28786674699375,
		10260144.86
	],
	[-3.030883460898826e-8, 0.00000898305509983578, 0.30071316287616, 59.74293618442277, 7.357984074871,
		-25.38371002664745, 13.45380521110908, -3.29883767235584, 0.32710905363475, 6856817.37
	],
	[-1.981981304930552e-8, 0.000008983055099779535, 0.03278182852591, 40.31678527705744,
		0.65659298677277, -4.44255534477492, 0.85341911805263, 0.12923347998204, -0.04625736007561,
		4482777.06
	],
	[3.09191371068437e-9, 0.000008983055096812155, 0.00006995724062, 23.10934304144901, -
		0.00023663490511, -0.6321817810242, -0.00663494467273, 0.03430082397953, -0.00466043876332,
		2555164.4
	],
	[2.890871144776878e-9, 0.000008983055095805407, -3.068298e-8, 7.47137025468032, -0.00000353937994, -
		0.02145144861037, -0.00001234426596, 0.00010322952773, -0.00000323890364, 826088.5
	]
];
var LL2MC = [
	[-0.0015702102444, 111320.7020616939, 1704480524535203, -10338987376042340, 26112667856603880, -
		35149669176653700, 26595700718403920, -10725012454188240, 1800819912950474, 82.5
	],
	[0.0008277824516172526, 111320.7020463578, 647795574.6671607, -4082003173.641316, 10774905663.51142,
		-15171875531.51559, 12053065338.62167, -5124939663.577472, 913311935.9512032, 67.5
	],
	[0.00337398766765, 111320.7020202162, 4481351.045890365, -23393751.19931662, 79682215.47186455, -
		115964993.2797253, 97236711.15602145, -43661946.33752821, 8477230.501135234, 52.5
	],
	[0.00220636496208, 111320.7020209128, 51751.86112841131, 3796837.749470245, 992013.7397791013, -
		1221952.21711287, 1340652.697009075, -620943.6990984312, 144416.9293806241, 37.5
	],
	[-0.0003441963504368392, 111320.7020576856, 278.2353980772752, 2485758.690035394, 6070.750963243378,
		54821.18345352118, 9540.606633304236, -2710.55326746645, 1405.483844121726, 22.5
	],
	[-0.0003218135878613132, 111320.7020701615, 0.00369383431289, 823725.6402795718, 0.46104986909093,
		2351.343141331292, 1.58060784298199, 8.77738589078284, 0.37238884252424, 7.45
	]
];

/**
 * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
 * 即 百度 转 谷歌、高德
 * @param bd_lon
 * @param bd_lat
 * @returns {*[]}
 */
export function bd09togcj02(bd_lon, bd_lat) {
	var bd_lon = +bd_lon;
	var bd_lat = +bd_lat;
	var x = bd_lon - 0.0065;
	var y = bd_lat - 0.006;
	var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_PI);
	var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_PI);
	var gg_lng = z * Math.cos(theta);
	var gg_lat = z * Math.sin(theta);
	return [gg_lng, gg_lat]
};

/**
 * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
 * 即谷歌、高德 转 百度
 * @param lng
 * @param lat
 * @returns {*[]}
 */
export function gcj02tobd09(lng, lat) {
	var lat = +lat;
	var lng = +lng;
	var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
	var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
	var bd_lng = z * Math.cos(theta) + 0.0065;
	var bd_lat = z * Math.sin(theta) + 0.006;
	return [bd_lng, bd_lat]
};

/**
 * WGS84转GCj02
 * @param lng
 * @param lat
 * @returns {*[]}
 */
export function wgs84togcj02(lng, lat) {
	var lat = +lat;
	var lng = +lng;
	if (out_of_china(lng, lat)) {
		return [lng, lat]
	} else {
		var dlat = transformlat(lng - 105.0, lat - 35.0);
		var dlng = transformlng(lng - 105.0, lat - 35.0);
		var radlat = lat / 180.0 * PI;
		var magic = Math.sin(radlat);
		magic = 1 - ee * magic * magic;
		var sqrtmagic = Math.sqrt(magic);
		dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
		dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
		var mglat = lat + dlat;
		var mglng = lng + dlng;
		return [mglng, mglat]
	}
};
/**
 * GCJ02 转换为 WGS84
 * @param lng
 * @param lat
 * @returns {*[]}
 */
export function gcj02towgs84(lng, lat) {
	var lat = +lat;
	var lng = +lng;
	if (out_of_china(lng, lat)) {
		return [lng, lat]
	} else {
		var dlat = transformlat(lng - 105.0, lat - 35.0);
		var dlng = transformlng(lng - 105.0, lat - 35.0);
		var radlat = lat / 180.0 * PI;
		var magic = Math.sin(radlat);
		magic = 1 - ee * magic * magic;
		var sqrtmagic = Math.sqrt(magic);
		dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
		dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
		var mglat = lat + dlat;
		var mglng = lng + dlng;
		return [lng * 2 - mglng, lat * 2 - mglat]
	}
};


function transformlat(lng, lat) {
	var lat = +lat;
	var lng = +lng;
	var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math
		.abs(lng));
	ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
	ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
	ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
	return ret
};

function transformlng(lng, lat) {
	var lat = +lat;
	var lng = +lng;
	var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(
		lng));
	ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
	ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
	ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
	return ret
};

/**
 * 判断是否在国内，不在国内则不做偏移
 * @param lng
 * @param lat
 * @returns {boolean}
 */
function out_of_china(lng, lat) {
	var lat = +lat;
	var lng = +lng;
	// 纬度3.86~53.55,经度73.66~135.05 
	return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55);
};
/**
 * 百度墨卡托转百度经纬度
 * @param lng
 * @param lat
 * @returns {*[]}
 */
export function BD_MKT2WGS(lng, lat) {
	var cF = null;
	lng = Math.abs(lng);
	lat = Math.abs(lat);
	for (var cE = 0; cE < MCBAND.length; cE++) {
		if (lat >= MCBAND[cE]) {
			cF = MC2LL[cE];
			break;
		}
	}
	lng = cF[0] + cF[1] * Math.abs(lng);
	var cC = Math.abs(lat) / cF[9];
	lat = cF[2] + cF[3] * cC + cF[4] * cC * cC + cF[5] * cC * cC * cC + cF[6] * cC * cC * cC * cC + cF[
		7] * cC * cC * cC * cC * cC + cF[8] * cC * cC * cC * cC * cC * cC;
	lng *= (lng < 0 ? -1 : 1);
	lat *= (lat < 0 ? -1 : 1);
	return [lng, lat];
}

function _getLoop(lng, min, max) {
	while (lng > max) {
		lng -= max - min;
	}
	while (lng < min) {
		lng += max - min;
	}
	return lng;
};

function _getRange(lat, min, max) {
	if (min != null) {
		lat = Math.max(lat, min);
	}
	if (max != null) {
		lat = Math.min(lat, max);
	}
	return lat;
};

/**
 * 百度经纬度转百度墨卡托
 * @param lng
 * @param lat
 * @returns {*[]}
 */
export function BD_WGS2MKT(lng, lat) {
	var cF = null;
	lng = _getLoop(lng, -180, 180);
	lat = _getRange(lat, -74, 74);
	for (var i = 0; i < LLBAND.length; i++) {
		if (lat >= LLBAND[i]) {
			cF = LL2MC[i];
			break;
		}
	}
	if (cF != null) {
		for (var i = LLBAND.length - 1; i >= 0; i--) {
			if (lat <= -LLBAND[i]) {
				cF = LL2MC[i];
				break;
			}
		}
	}
	lng = cF[0] + cF[1] * Math.abs(lng);
	var cC = Math.abs(lat) / cF[9];
	lat = cF[2] + cF[3] * cC + cF[4] * cC * cC + cF[5] * cC * cC * cC + cF[6] * cC * cC * cC * cC + cF[
		7] * cC * cC * cC * cC * cC + cF[8] * cC * cC * cC * cC * cC * cC;
	lng *= (lng < 0 ? -1 : 1);
	lat *= (lat < 0 ? -1 : 1);
	return [lng, lat];
}

// 经纬度转墨卡托
export function latLng2WebMercator(lng, lat) {
	var earthRad = 6378137.0;
	var x = lng * Math.PI / 180 * earthRad;
	var a = lat * Math.PI / 180;
	var y = earthRad / 2 * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)));
	return [x, y]; // [12727039.383734727, 3579066.6894065146]  
}

// 墨卡托转经纬度
export function webMercator2LngLat(x, y) { // [12727039.383734727, 3579066.6894065146]  
	var lng = x / 20037508.34 * 180;
	var lat = y / 20037508.34 * 180;
	lat = 180 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);
	return [lng, lat]; // [114.32894001591471, 30.58574800385281]
}

const coordinateSystemMap = new Map([
	[
		'wgs84',	// GPS坐标
		new Map([
			['gcj02', wgs84togcj02]
		])
	], [
		'gcj02',	// 国测局坐标 火星坐标
		new Map([
			['bd09', gcj02tobd09],
			['wgs84', gcj02towgs84]
		]),
	], [
		'bd09',		// 百度坐标
		new Map([
			['gcj02', bd09togcj02],
		])
	]
]);

/**
 * @description 经纬度坐标系转换工具
 * @param {String|Number} lng 待转换经度
 * @param {String|Number} lat 待转换纬度
 * @param {String} from 待转换坐标类型
 * @param {String} to 转换后坐标类型
 * @return {Array} 转换或未转换的经纬度 [lng, lat]
 */
export function mapConversion(lng, lat, from, to) {
	if (!coordinateSystemMap.has(from)) {
		console.warn(`不支持转换${from}坐标系`);
		return [lng, lat];
	}
	const map = coordinateSystemMap.get(from);
	if (!map.has(to)) {
		console.warn(`不支持转换成${to}坐标系`);
		return [lng, lat];
	}
	const func = map.get(to);
	return func(lng, lat);
}
