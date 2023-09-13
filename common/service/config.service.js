/**
 * @description 不同环境配置
 * 根据运行/发行, 导出不同配置
 * @example ddfls
	import configService from '@/common/service/config.service.js';
	const url = configService['apiUrl'] + configService['apiPrefix'];
 */

import { UNI_API, SELF_API } from '@/uni_modules/hf-middleware';

// 各环境一致的配置
const base = {
	// ...
	// tokenName: 'X-Access-Token',
	tokenName: 'authorization',
	usedApi: UNI_API,
	usedConfig: {
		protocol: 'syzl-app://',	// app自定义协议
		path: 'native',				// path
	},
	coordinateSystem: 'wgs84'	// 中间件返回的经纬度坐标系
}

// 各环境不同的配置


// 开发环境
const development = {
	...base,
	// #ifdef H5
	apiUrl: '',
	// usedApi: SELF_API,
	// #endif
	// #ifdef MP-WEIXIN
	apiUrl: 'http://192.168.0.76:9860',
	usedApi: UNI_API,
	// #endif
	apiPrefix: '/hf-back-scpsmip-dev',
	// tokenName: 'X-Access-Token',
}

// 生产环境
const production = {
	...base,
	// apiUrl: 'http://120.205.92.26:8292/api/'
}

// 根据打包运行环境 取对应配置
let configService = {};

if (process.env.NODE_ENV === 'development') {
	configService = development;
} else {
	configService = production;
}

export default configService;
