
/**
 * 树 获取路径
 * @@param {String} key 要找的选项值
 * @param {Array} treeData 数据
 * @param {Object} defaultProps 字段映射关系 默认值: { text: 'text', value: 'value' }
 * @@param {Array} path 路径
 */
export function treeFindPath(key, treeData, defaultProps, path = []) {
	// key, nodes, path = []
	if (!Array.isArray(treeData)) {
		console.warn('treeData is not array');
		return [];
	}
	const { text: textField, value: valueField } = defaultProps || { text: 'text', value: 'value' };
	// let textField = defaultProps.text;
	// let valueField = defaultProps.value;
	for (let i = 0; i < treeData.length; i++) {
		let node = treeData[i];
		let children = node.children;
		let text = node[textField];
		let value = node[valueField];

		path.push({
			value,
			text
		});

		if (value === key) {
			return path;
		}

		if (children) {
			const p = treeFindPath(key, children, defaultProps, path);
			if (p.length) {
				return p;
			}
		}

		path.pop();
	}
	return [];
}
