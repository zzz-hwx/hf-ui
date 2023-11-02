import Vue from 'vue';
import hfui from '@/uni_modules/hf-ui';

// import { loadDictOptions } from './loadData.js';

import { delay } from '@/uni_modules/hic-plugin';

Vue.use(hfui);

// 设置处理函数
hfui.setUtils({
	async loadDictOptions(code) {
		switch (code) {
			case 'TEST':
				return [
					{ value: '1', label: '选项1' },
					{ value: '2', label: '选项2' },
				];
			case 'GENDER':
				return [
					{ value: '1', label: '男' },
					{ value: '2', label: '女' },
				];
			case 'GENERALS_RANKING':
				return [
					{ value: '1', label: '吕布吕奉先' },
					{ value: '2', label: '赵云赵子龙' },
					{ value: '3', label: '典韦' },
					{ value: '4', label: '关羽关云长' },
					{ value: '5', label: '马超马孟起' },
					{ value: '6', label: '张飞张翼德', disabled: true },
					{ value: '7', label: '黄忠' },
					{ value: '8', label: '许褚' },
					{ value: '9', label: '孙策' },
					{ value: 'a', label: '太史慈' },
					{ value: 'b', label: '夏侯惇' },
					{ value: 'c', label: '夏侯渊' },
					{ value: 'd', label: '张辽' },
					
					{ value: 'e', label: '曹操曹孟德' },
					{ value: 'f', label: '曹丕' },
					{ value: 'g', label: '曹植' },
					{ value: 'h', label: '曹冲' },
					{ value: 'i', label: '曹昂' },
					{ value: 'j', label: '曹安民' },
					{ value: 'k', label: '郭嘉' },
					{ value: 'l', label: '孙权孙仲谋' },
					{ value: 'm', label: '孙坚' },
					{ value: 'n', label: '周瑜周公瑾' },
					{ value: 'o', label: '刘备刘玄德' },
					{ value: 'p', label: '诸葛亮' },
					{ value: 'q', label: '刘巴' },
					{ value: 'r', label: '刘禅' },
					{ value: 's', label: '刘表' },
					{ value: 't', label: '刘琮' },
				];
			default:
				return [];
		}
	},
	async uploadFile({ path, name }) {
		// throw new Error('上传文件失败');
		await delay(3000);
		return {
			url: path,	// 图片可访问绝对路径
			path: path	// 相对路径(保存)
		};
	},
	async getAbsPath(val) {
		return val.split(',').map((url) => {
			const nameIndex = url.lastIndexOf('/');
			const name = url.substring(nameIndex + 1);
			const extIndex = name.lastIndexOf('.');
			const ext = name.substring(extIndex + 1);	// 扩展名 jpg mp4
			return {
				url,
				name,
			}
		});
	},
});
