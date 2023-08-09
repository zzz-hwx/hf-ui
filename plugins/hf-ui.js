import Vue from 'vue';
import hfui from '@/uni_modules/hf-ui';

// import { loadDictOptions } from './loadData.js';

import { delay } from '@/uni_modules/hic-plugin';

Vue.use(hfui);

// 设置处理函数
hfui.setUtils({
	async uploadFile({ path, name }) {
		// throw new Error('上传文件失败');
		await delay(3000);
		return {
			url: path,	// 图片可访问绝对路径
			path: path	// 相对路径(保存)
		};
	}
});
