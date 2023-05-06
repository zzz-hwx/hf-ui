import test from '../test.js';
import toast from '../message/toast';

// 添加单位，如果有rpx，upx，%，px等单位结尾或者值为auto，直接返回，否则加上px单位结尾
export function addUnit(value = 'auto', unit = 'rpx') {
	value = String(value);
	// 用验证规则中的number判断是否为数值
	return test.number(value) ? `${value}${unit}` : value;
}

// 获取父组件的参数，因为支付宝小程序不支持provide/inject的写法
// this.$parent在非H5中，可以准确获取到父组件，但是在H5中，需要多次this.$parent.$parent.xxx
// 这里默认值等于undefined有它的含义，因为最顶层元素(组件)的$parent就是undefined，意味着不传name
// 值(默认为undefined)，就是查找最顶层的$parent
export function $parent(name = undefined) {
	let parent = this.$parent
	// 通过while历遍，这里主要是为了H5需要多层解析的问题
	while (parent) {
		// 父组件
		if (parent.$options && parent.$options.name !== name) {
			// 如果组件的name不相等，继续上一级寻找
			parent = parent.$parent
		} else {
			return parent
		}
	}
	return false
}

// 深度克隆
export function deepClone(obj) {
	// 对常见的“非”值，直接返回原来值
	if ([null, undefined, NaN, false].includes(obj)) return obj;
	if (typeof obj !== 'object' && typeof obj !== 'function') {
		// 原始类型直接返回
		return obj;
	}
	const o = test.array(obj) ? [] : {};
	for (const i in obj) {
		if (obj.hasOwnProperty(i)) {
			o[i] = typeof obj[i] === 'object' ? deepClone(obj[i]) : obj[i];
		}
	}
	return o;
}

// JS对象深度合并
export function deepMerge(target = {}, source = {}) {
	target = deepClone(target);
	if (typeof target !== 'object' || typeof source !== 'object') return false;
	for (const prop in source) {
		if (!source.hasOwnProperty(prop)) continue;
		if (prop in target) {
			if (typeof target[prop] !== 'object') {
				target[prop] = source[prop];
			} else if (typeof source[prop] !== 'object') {
				target[prop] = source[prop];
			} else if (target[prop].concat && source[prop].concat) {
				target[prop] = target[prop].concat(source[prop]);
			} else {
				target[prop] = deepMerge(target[prop], source[prop]);
			}
		} else {
			target[prop] = source[prop];
		}
	}
	return target;
}

// 去除空格
export function trim(str, pos = 'both') {
	// 通过正则去掉: iOS中文输入法输入字母，还没有确认点击发送，字母间可能出现六分之一空格，查询返回问号?
	str = str.replace(/\u2006/g, '');
	if (pos == 'both') {
		return str.replace(/^\s+|\s+$/g, "");
	} else if (pos == "left") {
		return str.replace(/^\s*/, '');
	} else if (pos == 'right') {
		return str.replace(/(\s*$)/g, "");
	} else if (pos == 'all') {
		return str.replace(/\s+/g, "");
	} else {
		return str;
	}
}

/**
 * 本算法来源于简书开源代码，详见：https://www.jianshu.com/p/fdbf293d0a85
 * 全局唯一标识符（uuid，Globally Unique Identifier）,也称作 uuid(Universally Unique IDentifier) 
 * 一般用于多个组件之间,给它一个唯一的标识符,或者v-for循环的时候,如果使用数组的index可能会导致更新列表出现问题
 * 最可能的情况是左滑删除item或者对某条信息流"不喜欢"并去掉它的时候,会导致组件内的数据可能出现错乱
 * v-for的时候,推荐使用后端返回的id而不是循环的index
 * @param {Number} len uuid的长度
 * @param {Boolean} firstU 将返回的首字母置为"u"
 * @param {Nubmer} radix 生成uuid的基数(意味着返回的字符串都是这个基数),2-二进制,8-八进制,10-十进制,16-十六进制
 */
export function guid(len = 32, firstU = true, radix = null) {
	let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
	let uuid = [];
	radix = radix || chars.length;
	if (len) {
		// 如果指定uuid长度,只是取随机的字符,0|x为位运算,能去掉x的小数位,返回整数位
		for (let i = 0; i < len; i++) {
			uuid[i] = chars[0 | Math.random() * radix];
		}
	} else {
		let r;
		// rfc4122标准要求返回的uuid中,某些位为固定的字符
		uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
		uuid[14] = '4';

		for (let i = 0; i < 36; i++) {
			if (!uuid[i]) {
				r = 0 | Math.random() * 16;
				uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
			}
		}
	}
	// 移除第一个字符,并用u替代,因为第一个字符为数值时,该guuid不能用作id或者class
	if (firstU) {
		uuid.shift();
		return 'u' + uuid.join('');
	} else {
		return uuid.join('');
	}
}
