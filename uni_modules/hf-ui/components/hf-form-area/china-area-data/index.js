import pcaa from './data.json';

export const rootPid = '86';
export const all = (function (pid) {
	const all = [];
	format(pid, 1);
	return all;
	
	function format (pid, level) {
		Object.entries(pcaa[pid]).forEach(([value, label], index) => {
			all.push({
				value,	// 属性值
				label,	// 属性名
				pid,	// 父级
				level,	// 层级
				index	// 索引
			});
			if (pcaa[value]) {
				format(value, level + 1);
			}
		});
	}
})(rootPid);
