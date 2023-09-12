// 消息提示
import modal from './js_sdk/message/modal';
import toast from './js_sdk/message/toast';

// 对数据存储Storage的封装
import * as storage from './js_sdk/storage/storage';
export * from './js_sdk/storage/storage';
// 搜索历史
import * as storageHis from './js_sdk/storage/storageHis';
export * from './js_sdk/storage/storageHis';

// 一些工具方法
import * as tools from './js_sdk/tools/tools';
export * from './js_sdk/tools/tools';

// 一些对 uni API 封装的方法
import * as uniTools from './js_sdk/tools/uniTools';
export * from './js_sdk/tools/uniTools';

// uview 的方法
import * as uviewTools from './js_sdk/tools/uviewTools';
export * from './js_sdk/tools/uviewTools';

// 校验方法
import * as test from './js_sdk/test.js';
export * from './js_sdk/test.js';

// dayjs
import dayjs from './utils/dayjs.js';

export {
	modal,
	toast,
	dayjs
};

const $z = {
	modal,
	toast,
	...storage,
	...storageHis,
	...tools,
	...uniTools,
	...uviewTools,
	...test
};


const install = (Vue) => {
	// 挂载到uni对象上
	uni.$z = $z;
	Vue.prototype.$z = $z;
}

export default {
	install
}
