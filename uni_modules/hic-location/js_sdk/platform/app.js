// #ifdef APP
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
	if (loading) {
		uni.showLoading({ title: '获取信息中' });
	}
	try {
		// 定位 获取经纬度
		const res = await utils.getLocation();
		return res;
	} catch (err) {
		// 获取位置失败
		await getLocationFail();
		// APP 无法判断是否已开启 重试只能页面添加按钮, 用户手动重试 ???
		// const res = await utils.getLocation();
		// return res;
		return Promise.reject('定位失败');
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
export async function reverseGeocoder ({ latitude, longitude, loading = true } = {}) {
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
 * 判断是否开启GPS功能，若已开启，提示用户“获取位置信息失败，请开启位置权限”
 * 若未开启GPS定位，提示弹框，点击“去设置”，跳转系统页面，开启GPS定位
 */
function getLocationFail () {
	// 获取系统信息
	const system = utils.getSystemInfoSync();
	if (system.platform === 'android') {
		// Android
		getLocationFail_Android();
	} else if (system.platform == 'ios') { 
		// iOS
		getLocationFail_iOS();
	}
}

function getLocationFail_Android () {
	const context = plus.android.importClass('android.content.Context');
	const locationManager = plus.android.importClass('android.location.LocationManager');
	const main = plus.android.runtimeMainActivity();
	const mainSvr = main.getSystemService(context.LOCATION_SERVICE);
	if (mainSvr.isProviderEnabled(locationManager.GPS_PROVIDER)) {
		console.log('GPS功能已开启');
		// toast('获取位置信息失败，请开启位置权限');
	} else {
		modal({
			title: '提示',
			content: '请授权位置权限，并将GPS定位打开',
			confirmText: '去设置',
			// showCancel: false	// 不显示取消按钮
		}).then(() => {
			const Intent = plus.android.importClass("android.content.Intent");
			const Settings = plus.android.importClass('android.provider.Settings');
			const intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
			main.startActivity(intent); // 打开系统设置GPS服务页面
		}).catch((err) => {
			console.log('用户拒绝授权位置信息, 无法获取位置信息', err);
		})
	}
}

function getLocationFail_iOS () {
	const cllocationManger = plus.ios.import("CLLocationManager");
	const enable = cllocationManger.locationServicesEnabled();
	const status = cllocationManger.authorizationStatus();
	plus.ios.deleteObject(cllocationManger);
	if (enable && status != 2) {
		console.log('GPS功能已开启');
	} else {
		modal({
			title: '提示',
			content: '无法获取你的位置信息。\n请到手机系统的[设置]->[隐私]->[定位服务]中打开定位服务，并允许使用定位服务',
			confirmText: '确定',
			// showCancel: false
		}).then(() => {
			const UIApplication = plus.ios.import("UIApplication");
			const application2 = UIApplication.sharedApplication();
			const NSURL2 = plus.ios.import("NSURL");
			const setting2 = NSURL2.URLWithString("App-Prefs:root=Privacy&path=LOCATION");
			application2.openURL(setting2);
			plus.ios.deleteObject(setting2);
			plus.ios.deleteObject(NSURL2);
			plus.ios.deleteObject(application2);
		}).catch((err) => {
			console.log('用户拒绝授权位置信息, 无法获取位置信息', err);
		});
	}
}
// #endif
