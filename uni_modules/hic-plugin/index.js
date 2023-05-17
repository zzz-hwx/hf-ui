// 消息提示
import modal from './js_sdk/message/modal';
import toast from './js_sdk/message/toast';
export {
	modal,
	toast
};

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

const $z = {
	modal,
	toast,
	...storage,
	...storageHis,
	...tools,
	...uniTools,
	...uviewTools
};

// 挂载到uni对象上
uni.$z = $z;

const install = (Vue) => {
	Vue.prototype.$z = $z;
}

export default {
	install
}
