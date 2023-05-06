# hic-location

## 基本用法

**示例**

- 获取各开放平台 申请 key
- 页面调用方法 获取位置
```js
import location from '@/uni_modules/hic-location/js_sdk/index.js';
export default {
	name: 'Sampling',
	async created() {
		const res = await location.reverseGeocoder();
		console.log(res);
		/**
		 * latitude: 26.150428
		 * longitude: 119.131362
		 * address: "福州市闽侯县环城路145号"
		 * location: "闽侯县人民政府附近"
		 * adcode: "350121"
		 * prov: "350000000000"
		 * city: "350100000000"
		 * county: "350121000000"
		 * provName: "福建省"
		 * cityName: "福州市"
		 * countyName: "闽侯县"
		 */
	}
}
```

- 使用不同平台SDK，手动修改`platform/app.js`、`platform/wx.js`的导入文件，暂时没想到其他方法 QAQ
	- `platform/app.js`：APP
	- `platform/wx.js`：微信小程序
```js
// import * as map from '../location/qqmap';
import * as map from '../location/amap';
```

**注意**
- H5
	- 开放申请H5应用key，填到`manifest.json` -> [h5配置] -> [定位和地图]
	- 使用https协议，定位获取的经纬度，误差相对小一些
- 小程序
	- 只测了微信小程序，其他不确定
- APP
	- 各开放平台申请APP应用的key，填到`manifest.json` -> [APP模块配置] -> [Maps地图]
	- 需要根据平台不同(Android/iOS) 申请两个不同的key -> 获取当前位置 `uni.getLocation` 内部使用
	- 但是....sdk使用的小程序(地址逆解析)，所以...得再申请小程序的key，填在文件`config.js`


详细说明见官方文档：[位置](https://uniapp.dcloud.io/api/location/location.html#getlocation)


## 目录说明
- sdk：各平台下载的sdk文件
	- `qqmap-wx-jssdk.js`：腾讯地图
	- `amap-wx.js`：高德地图
- location：调用不同平台sdk，导出统一的工具方法
	- `qqmap.js`：腾讯地图
	- `amap.js`：高德地图
- platform：不同平台调用的方法，通过条件编译区分导入
	- `h5.js`：H5
	- `wx.js`：微信小程序
	- `app.js`：APP
- vue-jsonp
- utils：一些工具方法
