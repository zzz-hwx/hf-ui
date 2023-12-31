组件库`hf-ui`示例项目

# 第三方库

> 组件库: [uview](https://www.uviewui.com/)

# 规范

## 联调

## 登录需要使用的数据

- regionId: 当前用户所在网格，行政区划

# 记录

## 下拉刷新

> [uniapp 下拉刷新](https://uniapp.dcloud.net.cn/api/ui/pulldown.html)

- 文件`pages.json`，找到的当前页面的`pages`节点，添加`"enablePullDownRefresh": true` 开启下拉刷新
  
  ```json
	{
		"path": "pages/xx/xx",
		"style": {
			"navigationBarTitleText": "",
			"enablePullDownRefresh": true
		}
	}
  ```

- 页面文件
  
  ```js
	async onPullDownRefresh() {
		await this.getList(true);    // 请求刷新列表数据
		uni.stopPullDownRefresh();    // 停止当前页面下拉刷新
	},
  ```

## 列表刷新

- 页面生命周期`onShow`，刷新列表数据
- 页面初始化可能发起两次请求，通过防抖`debounce`避免

```js
onShow() {
	this.refreshList();
}
```

## 请求加载中

默认所有接口都显示加载中提示

配置了loading的接口 跟着配置走

``` js
export const xxx = (params = {}) => {
	// 请求地址, 请求参数, 请求配置(放在custom里)
	http.get('/xxx/xxx', params, { custom: { loading: false } });
}
```

## 表单提交

表单提交，提交按钮添加节流`:throttleTime="throttleTime"`

`throttleTime`为Vue原型上变量，默认300，单位ms

## 地图定位坐标系

`wgs84`：PC端地图展示、后端接口保存、中间件获取定位方法`getLocation`（代码手动转换）

`gcj04`：高德地图、底座返回（底座使用高德地图定位）

- 用途一：获取定位（都是`wgs84`，不用做坐标系转换）
	- 调用中间件方法`getLocation`返回定位
	- 请求后端接口保存数据

- 用途二：展示地图
  - 使用的功能模块：地图打点、网格巡查、地图轨迹...
  - 使用的第三方地图SDK：高德地图
    - 调用中间件方法`getLocation`返回定位（`wgs84`）
    - 坐标系转换`wgs84togcj02`
    - 设置地图中心点center经纬度（因为PC端坐标系为wgs84，所以getLocation返回的经纬度坐标系为wgs84，但是高德地图坐标系为gcj04）
    - 地图操作....从地图返回的经纬度
    - 坐标系转换`gcj02towgs84`
    - 请求后端接口保存数据（`wgs84`）

栗子

``` js
import { getLocation } from '@/uni_modules/hf-middleware';
import { wgs84togcj02, gcj02towgs84 } from '@/uni_modules/hf-middleware/js_sdk/utils/mapConversion.js';

const res = await getLocation();	// { longitude: 119.24934182769975, latitude: 26.051565918068977 }
const [lng, lat] = wgs84togcj02(res.longitude, res.latitude);	// 坐标系转换
this.map = new Amap.Map('map', {
    center: [lng, lat],	// 地图中心
    zoom: this.zoom,
});
// ... 地图操作 ...
let lnglat = [119.123, 26.123];	// 从地图返回的经纬度
lnglat = gcj02towgs84(lnglat[0], lnglat[1])	// 坐标系转换
// 请求后端接口保存数据
```

### 坐标系转换

- H5调用底座方法获取定位，添加返回`coordinateSystem`坐标系
- 中间件方法`getLocation`、`chooseLocation`添加参数`coordinateSystem`，可设置方法返回的经纬度坐标系
- 中间件可统一配置默认返回的经纬度坐标系
- 组件`hf-form-location`可配置props参数`coordinateSystem`，设置组件返回的经纬度坐标系
  - 组件参数`coordinateSystem`，默认值取中间件配置的参数`coordinateSystem`

- 经纬度坐标系优先级
  - `props.coordinateSystem` > 中间默认配置`coordinateSystem` > `getLocation`、`chooseLocation`方法形参`coordinateSystem`


# 踩坑

## uni-simple-router

- 关闭页面, 组件未销毁(keep-alive), 重新打开页面, 不会调用`created`, `onLoad`等生命周期函数
  - 导致问题: 列表查看详情, 不会刷新数据
  - 解决方案1: 使用uview[route 路由跳转](https://www.uviewui.com/js/route.html), 使用uniapp提供的路由跳转方法
  - 解决方案2: 直接使用uniapp提供的[路由跳转](https://uniapp.dcloud.net.cn/api/router.html)

## 作用域插槽
（针对小程序）
- 模板里如果需要使用`$scopedSlots`对父组件是否有传入作用域插槽的判断，通过条件编译使用：`$slots`

``` html
<!-- 父组件 -->
<current-user>
	<template v-slot:item="{ user }">
		{{ user.firstName }}
	</template>
</current-user>
```
``` html
<!-- 子组件 <current-user>-->
<template>
	<view>
		<view v-for="(item, index) in user" :key="index">
			<!-- <slot name="item" :user="item">{{item.lastName}}</slot> -->
			<template v-if="$slots.item">
				<slot name="item" :user="item"></slot>
			</template>
			<template v-else>
				{{item.lastName}}
			</template>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				user: [{
					"lastName": "bar",
					"firstName": "foo-item"
				}, {
					"lastName": "bar",
					"firstName": "foo-222"
				}]
			}
		}
	}
</script>
```

## /deep/不生效
（针对小程序）

- 页面修改组件样式，直接使用`/deep/`
- 组件修改子组件样式，需要配置组件/实例的选项
	``` js
	options: {
		styleIsolation: 'shared'
	},
	```

栗子
``` js
export default {
	// #ifdef MP-WEIXIN
	options: {
		styleIsolation: 'shared'
	},
	// #endif
	data() {
		return {...};
	},
}
```
``` scss
/deep/ .u-button + .u-button {
	margin-left: $df;
}
```

## u-form 包含异步校验函数`asyncValidator`的表单校验问题

u-form validateField 逻辑错误
没有等异步校验函数asyncValidator执行完再返回, 只是套了一层this.$nextTick, 之后的回调是同步的

错误原因

- for循环里调用validator.validate, 传入回调函数callback (async-validator的callback为异步调用)
- for循环结束 执行用户传入的回调函数 (却是同步..)
- 可能...为了解决表单校验的 message 文字..



∴ 组件内重写mixin的validate方法

- 直接使用 async-validator 校验
- 如果校验失败, 再调一遍u-form的validate, 显示错误信息

问题: 避免不了...如果验证不通过, 会请求两遍接口...



文件：`@/mixins/form.js`

```js
export default {
	computed: {
		hasAsyncRule() {
			// 是否有异步校验函数 asyncValidator
			if (!this.rules) return false;
			for (let key in this.rules) {
				const rules = [].concat(this.rules[key]);
				const flag = rules.some(item => (Boolean(item.asyncValidator)));
				if (flag) return true;
			}
			return false;
		}
	},
	methods: {
		myValidate() {
			// 自己写的validate
			const uFormItems = this.$refs.uForm.children;
			const rules = {};
			uFormItems.forEach((child) => {
				// 历遍 u-form 所有 u-form-item
				// 过滤掉没有对应表单项的校验规则
				const prop = child.prop; // 获取对应的属性
				if (this.rules[prop]) {
					rules[prop] = this.rules[prop];
				}
			});
			const validator = new Schema(rules);
			return validator.validate(this.model);
		},
		validate() {
			// 表单校验
			if (this.hasAsyncRule) {
				return this.myValidate().then(() => {
					return this.model;
				}).catch((err) => {
					this.$refs.uForm.validate();
					return Promise.reject(err);
				});
			} else {
				return this.$refs.uForm.validate().then(() => {
					return this.model;
				});
			}
		}
	}
}
```

> validateField 人口到车辆的校验也有问题....QAQ
