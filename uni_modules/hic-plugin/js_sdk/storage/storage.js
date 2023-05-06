/**
 * uni.setStorage(OBJECT)
 * 将数据存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容
 * @param {String} key 本地缓存中的指定的 key
 * @param {Any} data 需要存储的内容，只支持原生类型、及能够通过 JSON.stringify 序列化的对象
 */
export function setStorage(key, data) {
	return new Promise((resolve, reject) => {
		if (!key) {
			console.warn('key is required');
			return reject('key is required');
		} else if (typeof data === 'undefined') {
			console.warn('data is required');
			return reject('data is required');
		}
		uni.setStorage({
			key,
			data,
			success: (res) => {
				resolve();
			},
			fail: (err) => {
				console.log(err);
				reject();
			}
		});
	});
}

/**
 * uni.getStorage(OBJECT)
 * 从本地缓存中异步获取指定 key 对应的内容
 * @param {String} key 本地缓存中的指定的 key
 * @param {Any} defaultData 缓存中没有对应内容 返回的默认值
 * @return {Any}
 */
export function getStorage(key, defaultData = '') {
	return new Promise((resolve, reject) => {
		if (!key) {
			console.warn('key is required');
			return reject('key is required');
		}
		uni.getStorage({
			key,
			success: (res) => {
				resolve(res.data);
			},
			fail: (err) => {
				resolve(defaultData);
			}
		});
	});
}

/**
 * uni.getStorageSync(KEY)
 * 从本地缓存中同步获取指定 key 对应的内容。
 * @param {String} key 本地缓存中的指定的 key
 * @param {Any} defaultData 缓存中没有对应内容 返回的默认值
 * @return {Any}
 */
export function getStorageSync(key, defaultData = '') {
	try {
		if (!key) {
			console.warn('key is required');
			return defaultData;
		}
		const result = uni.getStorageSync(key);
		return result || defaultData;
	} catch (e) {
		//TODO handle the exception
		console.log(e);
		return defaultData;
	}
}

/**
 * uni.removeStorageSync(KEY)
 * 从本地缓存中同步移除指定 key。
 * @param {String} key 本地缓存中的指定的 key
 */
export function removeStorageSync(key) {
	uni.removeStorageSync(key);
}
