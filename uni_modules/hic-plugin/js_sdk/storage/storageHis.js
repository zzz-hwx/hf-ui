/**
 * 搜索历史的缓存方法
 */

import { getStorage, setStorage } from './storage';
import { trim } from '../tools/uviewTools';

// 最多存几条数据
const limit = 5;
// 分隔符
const separator = ',';

/**
 * 获取搜索历史
 * @param {String} key
 * @return {Array} 
 */
export async function getSearchHistory(key) {
	const str = await getStorage(key);
	if (str) {
		return str.split(separator).filter(Boolean);
	}
	return [];
}

/**
 * 存储搜索历史
 * @param {String} key
 * @param {String} keyword 新加搜索词
 * @return {Array}
 */
export async function setSearchHistory(key, keyword) {
	keyword = trim(keyword);
	if(!keyword || !key) throw 'required params: "keyword || key"';
	const list = await getSearchHistory(key);
	const index = list.indexOf(keyword);
	if (index == -1) {
		if (list.length >= limit) list.pop();
	} else {
		list.splice(index, 1);
	}
	list.unshift(keyword);
	await setStorage(key, list.join(separator));
	return list;
}

/**
 * 清空搜索历史
 * @param {String} key
 * @return {Array} [] 返回空数组
 */
export async function removeSearchHistory(key) {
	let list = [];
	await setStorage(key, '');
	return list;
}
