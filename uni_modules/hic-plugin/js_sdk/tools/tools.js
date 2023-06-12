export function groupBy(list, key) {
	const obj = {};
	list.forEach(item => {
		const rowKey = item[key];
		if (!obj[rowKey]) {
			obj[rowKey] = [];
		}
		obj[rowKey].push(item);
	});
	return obj;
}

// 比较两个数组内容是否相等
export function arrayEqual(arr1, arr2) {
	if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
	if (arr1.length != arr2.length) return false;
	for (let i = 0, len = arr1.length; i < len; i++) {
		if ((arr1[i] instanceof Array) && (arr2[i] instanceof Array)) {
			if (!arrayEqual(arr1[i], arr2[i])) return false;
		} else if (arr1[i] !== arr2[i]) {
			return false;
		}
	}
	return true;
}

/**
 * @tutorial https://www.cnblogs.com/-867259206/p/6795354.html
 * @param {Object} obj1
 * @param {Object} obj2
 */
export function dataIsEqual(obj1, obj2) {
	for (const propName in obj1) {
		if (obj1.hasOwnProperty(propName) != obj2.hasOwnProperty(propName)) {
			return false;
		} else if (typeof obj1[propName] != typeof obj2[propName]) {
			return false;
		}
	}
	for (const propName in obj2) {
		if (obj1.hasOwnProperty(propName) != obj2.hasOwnProperty(propName)) {
			return false;
		} else if (typeof obj1[propName] != typeof obj2[propName]) {
			return false;
		}
		if (!obj1.hasOwnProperty(propName)) continue;
		if (obj1[propName] instanceof Array && obj2[propName] instanceof Array) {
			if (!dataIsEqual(obj1[propName], obj2[propName])) return false;
		} else if (obj1[propName] instanceof Object && obj2[propName] instanceof Object) {
			if (!dataIsEqual(obj1[propName], obj2[propName])) return false;
		} else if(obj1[propName] != obj2[propName]) {
			return false;
		}
	}
	return true;
}

/**
 * 保留小数位
 * @param {Number} val 要转换的数值
 * @param {String, Number} accuracy 精度
 */
export function keepDecimals(val, accuracy = 2) {
	if ((val !== 0 && !val) || typeof(val) === 'undefined') return '';
	if (!accuracy && accuracy !== 0) {
		// 默认保留两位小数
		// 0 就... 0, 不保留小数位
		accuracy = 2;
	}
	const number = parseFloat(val);
	if (!isNaN(number)) {
		return number.toFixed(accuracy);
	}
	return val;
}

/**
 * 封装 setTimeout
 * @param {Number} duration 
 */
export function delay(duration = 1000) {
	return new Promise((resolve) => {
		setTimeout(resolve, duration);
	});
}

/**
 * 节流 throttle
 * 栗子：对疯狂点击行为的节流
 * @param {*} fn 
 * @param {*} delay 
 */
export function throttle (fn, delay = 500) {
	let last = 0;
	return function (...args) {
		const now = Date.now();
		if (now - last > delay) {
			fn.apply(this, args); // 和上一次点击时间差大于0.5s, 才执行函数
			last = now;
		}
	}
}

/**
 * 防抖 debounce
 * 栗子：实时搜索，拖拽
 */
export function debounce (fn, delay = 500) {
	let timer;
	return function (...args) {
		clearTimeout(timer);
		timer = setTimeout(() => {
			fn.apply(this, args);
		}, delay);
	}
}

/**
 * @description 防抖 debounce + promise
 * 栗子：实时搜索，拖拽
 * @param {Function} fn 函数
 * @param {Number} delay = [500] 时延
 * @param {Boolean} immediate = [false] 是否立即执行
 */
export function promiseDebounce(fn, delay = 500, immediate = false) {
	// 1.定义一个定时器, 保存上一次的定时器
	let timer = null;
	let isInvoke = false;

	// 2.真正执行的函数
	const _debounce = function(...args) {
		return new Promise((resolve, reject) => {
			// 取消上一次的定时器
			if (timer) clearTimeout(timer);

			// 判断是否需要立即执行
			if (immediate && !isInvoke) {
				const result = fn.apply(this, args);
				if (isPromise(result)) {
					result.then(resolve).catch(reject);
				} else {
					resolve(result);
				}
				isInvoke = true;
			} else {
				// 延迟执行
				timer = setTimeout(() => {
					const result = fn.apply(this, args);
					if (isPromise(result)) {
						result.then(resolve).catch(reject);
					} else {
						resolve(result);
					}
					isInvoke = false;
					timer = null;
				}, delay)
			}
		});
	};

	// 封装取消功能
	_debounce.cancel = function() {
		if (timer) clearTimeout(timer);
		timer = null;
		isInvoke = false;
	}
	
	return _debounce;
}

function isPromise(value) {
	if (Object.prototype.toString.call(value) !== '[object Promise]') return false;
	if (typeof(value.then) !== 'function') return false;
	if (typeof(value.catch) !== 'function') return false;
	return true;
}

/**
 * @description 版本号比较
 * @param {String} v1
 * @param {String} v2
 * @return {Boolean} v2 大于 v1 返回true, 否则返回false
 */
export function compareVersion(v1, v2) {
	v1 = v1.split('.');
	v2 = v2.split('.');
	const len = Math.max(v1.length, v2.length);

	while (v1.length < len) {
		v1.push('0');
	}
	while (v2.length < len) {
		v2.push('0');
	}

	for (let i = 0; i < len; i++) {
		const num1 = parseInt(v1[i]);
		const num2 = parseInt(v2[i]);

		if (num1 < num2) {
			return true;
		} else if (num1 > num2) {
			return false;
		}
	}

	return false;
}

export class Time {
	constructor() {
		// 对象字面量 改用class 数据隔离 转为私有变量 两个计时器之间不相互影响
		this.timer = null;
	}
	/**
	 * 等待指定时间后调用函数
	 * @param {Function} fn 处理函数
	 * @param {Number} duration 等待时间 单位ms
	 */
	setTimeout(fn, duration = 1000) {
		this.clear()
		this.timer = setTimeout(fn, duration)
		return this.timer
	}
	/**
	 * 等待指定时间
	 * @param {Number} duration 等待时间 单位ms
	 * @return {Promise}
	 */
	delay(duration = 1000) {
		return new Promise((resolve) => {
			this.setTimeout(() => {
				resolve(this.timer)
			}, duration)
		})
	}
	/**
	 * 间隔指定时间调用函数
	 * @param {Function} fn 处理函数
	 * @param {Number} duration 间隔时间 单位ms
	 */
	setInterval(fn, duration) {
		// this指向time
		this.setTimeout(() => {
			// this指向time
			fn()
			this.setInterval(fn, duration)
		}, duration)
		return this.timer
	}
	clear() {
		clearTimeout(this.timer)
		this.timer = null
	}
}

/**
 * 树 格式化数据
 * @param {Array} data 数据
 * @param {Function} handle 处理函数
 */
export function treeDataFormat(data, handle) {
	if (!Array.isArray(data)) {
		console.warn('data is not array');
		return data;
	}
	if (typeof(handle) !== 'function') {
		console.warn('handle is not function');
		return data;
	}
	return data.map(item => {
		const children = treeDataFormat(item.children, handle);
		const newItem = handle(item);
		return {
			...newItem,
			children
		};
	});
}

/**
 * 树 获取路径
 * @param {String} key 要找的选项值
 * @param {Array} treeData 数据
 * @param {Object} defaultProps 字段映射关系 默认值: { text: 'text', value: 'value' }
 * @param {Array} path 路径
 */
export function treeFindPath(key, treeData, defaultProps, path = []) {
	if (!Array.isArray(treeData)) {
		console.warn('treeData is not array');
		return [];
	}
	const { text: textField = 'text', value: valueField = 'value', children: childrenField = 'children' } = defaultProps || {};
	// let textField = defaultProps.text || 'text';
	// let valueField = defaultProps.value || 'value';
	// const childrenField = defaultProps.children || 'children';
	for (let i = 0; i < treeData.length; i++) {
		const node = treeData[i];
		const children = node[childrenField];
		const text = node[textField];
		const value = node[valueField];

		path.push({
			[textField]: text,
			[valueField]: value
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
