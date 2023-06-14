const loadData = {
	/**
	 * 获取下拉列表选项列表
	 * @param {String} dictCode 字典code
	 * @return {Promise(Array[{value, label}])}
	 */
	async loadDictOptions(code) {
		return [
			{ value: '1', label: '选项1' },
			{ value: '2', label: '选项2' },
		];
	},
	/**
	 * 获取资源绝对路径
	 * @param {String} val 相对路径 以','分隔
	 * @return {Array} [{ url: '绝对路径', name: '文件名' }]
	 */
	async getAbsPath(val) {
		return [{ url: val, name: 'api.pdf' }];
	},
	/**
	 * 图片上传
	 * @param {String} path 文件临时路径
	 * @param {String} name 文件名
	 * @return {Promise} 
	 */
	async uploadFile({ path, name }) {
		return {
			url: path,	// 图片可访问绝对路径
			path: path	// 相对路径(保存)
		}
	}
};
export default loadData;

/**
 * 设置获取数据的函数
 * @param {Object} obj 函数组
 */
export function setUtils (obj) {
	Object.keys(obj).map(key => {
		loadData[key] = obj[key];
	});
}
