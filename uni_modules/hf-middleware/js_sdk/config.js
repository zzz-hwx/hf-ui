
export const QUICK_API = 'kysk-fzsy-app';	// 快应
export const SELF_API = 'syzl-app';	// 自研
export const UNI_API = 'uniapp';	// uniapp

const apiConfig = {
	[QUICK_API]: {
		protocol: 'kysk-fzsy-app://',	// app自定义协议
		path: 'native',					// path
	},
	[SELF_API]: {
		protocol: 'syzl-app://',	// app自定义协议
		path: 'native',				// path
	},
	[UNI_API]: {
		// 
	}
};

export const config = {
	usedApi: UNI_API,
	usedConfig: apiConfig[UNI_API]
};

/**
 * @description 设置配置
 * @param {Object} options
 * 	@param {String} usedApi 使用的 API
 * 	@param {Object} usedConfig 对应配置
 */
export function setConfig(options) {
	config.usedApi = options.usedApi || UNI_API;
	config.usedConfig = options.usedConfig || {};
}
