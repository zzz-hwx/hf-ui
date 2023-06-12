# hic-plugin

有一些看似没意义的封装，嗯，在`API Promise化`后...确实没意义（只是之前项目代码是这样用的，懒得改了,.,）

可以手动修改`@/uni_modules/hic-plugin/index.js`，不导入没有用到的模块

**使用方法**

`main.js` 全局引入

将`$z`对象挂在到了Vue原型和uni对象上，可以在外部`js`文件中，通过`uni.$z.xxx`调用工具方法

```js
import z from './uni_modules/hic-plugin';
Vue.use(z);
```

使用

``` js
this.$z.modal({ title: '提示', content: '这是一个modal提示' });
// uni.$z.modal({ title: '提示', content: '这是一个modal提示' });
```

## 对uni API的封装

### message 消息提示

#### modal(Object)

显示模态弹窗，对`uni.showModal`的封装，参数同uni.showModal

因为，不同平台的确认、取消按钮位置不同，(微信、H5、iOSApp确认按钮默认右边，Android默认在左边)，通过控制按钮的文字，使确认按钮默认在右边。

函数返回`Promise`，用户点击确定按钮，进入 `then 方法` 回调，用户点击取消按钮，进入 `catch 方法` 回调

``` js
this.$z.modal({
    title: '提示',
    content: '这是一个modal提示'
}).then(() => {
    console.log('用户点击确定');
});
```

#### toast(title, duration)

显示消息提示框，对`uni.showToast`的封装，不显示icon图标

- title：提示的内容
- duration：提示的延迟时间，单位ms，默认1500

``` js
this.$z.toast('消息提示框');
```

### storage

对数据存储Storage的封装

#### setStorage(key, data)

对`uni.setStorage`的封装

将数据存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容

- key：本地缓存中的指定的 key
- data：需要存储的内容，只支持原生类型、及能够通过 JSON.stringify 序列化的对象
- 返回promise

#### getStorage(key, defaultData)

对`uni.getStorage`的封装

从本地缓存中异步获取指定 key 对应的内容

- key：本地缓存中的指定的 key
- defaultData：缓存中没有对应内容 返回的默认值

#### getStorageSync(key, defaultData)

对`uni.getStorageSync`的封装

从本地缓存中同步获取指定 key 对应的内容

- key：本地缓存中的指定的 key
- defaultData：缓存中没有对应内容 返回的默认值

#### removeStorageSync(key)

对`uni.removeStorageSync`的封装

从本地缓存中同步移除指定 key

``` js
const key = 'storageKey';
this.$z.setStorage(key, {a: 1, b: 2});
this.$z.getStorage(key, {});
this.$z.removeStorageSync(key);
```

### storageHis

#### getSearchHistory(key)

获取搜索历史

- key
- 返回搜索历史数组

#### setSearchHistory(key, keyword)

存储搜索历史

- key
- keyword：新加搜索词
- 返回存储后的搜索历史数组

#### removeSearchHistory(key)

清空搜索历史

- key
- 返回空数组

``` js
const key = 'storageKey';
const list = uni.$z.getSearchHistory(key);
const newList = uni.$z.setSearchHistory(key, '一个搜索词');
uni.$z.removeSearchHistory(key);
```

### uniTools

#### navigateBack(delta)

对`uni.navigateBack`的封装

关闭当前页面，返回上一页面或多级页面

#### navigateTo(path, params, encode)

- path：需要跳转的应用内非 tabBar 的页面的路径 
- params：带的参数，对象Object
- encode：是否进行`encodeURIComponent`转码，默认false

``` js
this.$z.navigateTo('/pages/xxx/xxx', {a: 1, b: 2}, true);

// /pages/xxx/xxx页面 的 onLoad(event)
if (event.data) {
    const data = JSON.parse(decodeURIComponent(event.data));
    console.log(data);	// {a: 1, b: 2}
}
```

#### redirectTo(path, params, encode)

- path：需要跳转的应用内非 tabBar 的页面的路径 
- params：带的参数，对象Object
- encode：是否进行`encodeURIComponent`转码，默认false

``` js
this.$z.redirectTo('/pages/xxx/xxx', {a: 1, b: 2}, true);

// /pages/xxx/xxx页面 的 onLoad(event)
if (event.data) {
    const data = JSON.parse(decodeURIComponent(event.data));
    console.log(data);	// {a: 1, b: 2}
}
```

#### reLaunch(path, params, encode)

- path：需要跳转的应用内非 tabBar 的页面的路径 
- params：带的参数，对象Object
- encode：是否进行`encodeURIComponent`转码，默认false

``` js
this.$z.reLaunch('/pages/xxx/xxx', {a: 1, b: 2}, true);

// /pages/xxx/xxx页面 的 onLoad(event)
if (event.data) {
    const data = JSON.parse(decodeURIComponent(event.data));
    console.log(data);	// {a: 1, b: 2}
}
```

#### scanCode

对 `uni.scanCode` 的封装

- scanType：扫码类型，默认二维码
- onlyFromCamera：是否只能从相机扫码，不允许从相册选择图片

#### chooseImage

对 `uni.chooseImage` 的封装 从本地相册选择图片或使用相机拍照（参数同`uni.chooseImage`）

- count：最多可以选择的图片张数，默认9
- sizeType：original 原图，compressed 压缩图，默认二者都有
- extension：根据文件拓展名过滤，每一项都不能是空字符串。默认不过滤。
- sourceType：album 从相册选图，camera 使用相机，默认二者都有。如需直接开相机或直接选相册，请只使用一个选项
- crop：图像裁剪参数，设置后 sizeType 失效

#### chooseVideo

对`uni.chooseVideo` 的封装 拍摄视频或从手机相册中选视频，返回视频的临时文件路径（参数同`uni.chooseVideo`）

#### chooseMedia

对`uni.chooseMedia` 的封装 拍摄或从手机相册中选择图片或视频（仅小程序支持）（参数同`uni.chooseMedia`）

#### chooseFile

对`uni.chooseFile` 的封装 从本地选择文件（参数同`uni.chooseFile`）

#### copyData

对 `uni.setClipboardData` 的封装，设置系统剪贴板内容

- data：需要设置的内容
- tip：复制完成是否提示

#### showActionSheet

对`uni.showActionSheet`的封装，从底部向上弹出操作菜单（参数同`uni.showActionSheet`）

- title：菜单标题
- alertText：警示文案（同菜单标题）
- itemList：按钮的文字数组
- itemColor：按钮的文字颜色，字符串格式，默认为"#000000"
- popover：大屏设备弹出原生选择按钮框的指示区域，默认居中显示

#### makePhoneCall

对`uni.makePhoneCall` 的封装 拨打电话

- phoneNumber：需要拨打的电话号码

## 一些方法 tools

### uviewTools

来自`uview`的方法

> uview：https://www.uviewui.com/

#### addUnit

添加单位，如果有rpx，upx，%，px等单位结尾或者值为auto，直接返回，否则加上px单位结尾

- value：值
- unit：加上的单位，默认rpx

#### $parent

获取父组件的参数，因为支付宝小程序不支持provide/inject的写法

- name：父组件的name，不传或者传`undefined`，查找最顶层的`$parent`

``` js
// 获取父组件u-dropdown
const parent = this.$z.$parent.call(this, 'u-dropdown');
```

#### deepClone

深度克隆

- obj：深度克隆对象

#### deepMerge

JS对象深度合并

- target：<Object> 目标对象
- source：<Object> 源对象

#### trim

去除空格

通过正则去掉: iOS中文输入法输入字母，还没有确认点击发送，字母间可能出现六分之一空格，查询返回问号?

- str：<String> 字符串
- pos：<String> 去除那些位置的空格，可选为：
  - both：默认值，去除两端空格
  - left：去除左边空格
  - right：去除右边空格
  - all：去除包括中间和两端的所有空格


``` js
console.log(this.$z.trim('abc    b ', 'all')); // 去除所有空格
console.log(this.$z.trim(' abc '));	// 去除两端空格
```

#### guid

全局唯一标识符

该函数可以生产一个全局唯一、随机的guid，默认首字母为`u`，可以用于当做元素的id或者class名等需要唯一，随机字符串的地方，因为id或者class不能以数字开头。

- length：<Number | null> guid的长度，默认为`32`，如果取值`null`，则按`rfc4122标准`生成对应格式的随机数
- firstU：<Boolean> 首字母是否为"u"，如果首字母为数字情况下，不能用作元素的`id`或者`class`，默认为`true`
- radix：<Number> 生成的基数，默认为`62`，用于生成随机数字符串为"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"， 如果取2，那么返回的结果就是前两位0和1(可以理解为二进制)的随机结果，如果为7，返回的字符串就是0-7(理解为八进制)之间， 10为十进制，以此类推。

``` js
const id = this.$z.guid();
const id2 = this.$z.guid(20);
```

### tools

#### groupBy

对数据进行分组，按给的key聚合数组，返回一个对象

- list：<Array>
- key

``` js
const arr = [
    {label: 'aa', value: '123' },
    {label: 'aa', value: '456' },
    {label: 'bb', value: '123' },
    {label: 'bb', value: '456' }
];
groupBy(arr, 'label');	// {aa: [{label: 'aa', value: '123'}, {label: 'aa', value: '456'}], bb: [{label: 'bb', value: '123'}, {label: 'bb', value: '456'}]}
```

#### dataIsEqual

比较两个对象是否相等

- obj1
- obj2

#### keepDecimals

保留小数位

- val：要转换的数值
- accuracy：精度，默认保留2位小数

#### delay

封装 setTimeout，返回promise

- duration：等待的毫秒数，默认1000ms

#### debounce

防抖

栗子：实时搜索，拖拽

- fn：处理函数
- delay：等待的毫秒数

#### promiseDebounce

防抖 debounce + promise

- fn：处理函数
- delay：等待的毫秒数
- immediate：是否立即执行

```js
const debounceChange = promiseDebounce(async (...args) => {
	console.log('--- async fn start --->', ...args);
	await delay(5000);
	console.log('--- async fn end --->', ...args);
	return 'async resolved';
}, 1000);

// const debounceChange = promiseDebounce((...args) => {
// 	console.log('--- fn end --->', ...args);
// 	return 'resolved';
// }, 3000);

debounceChange('给fn的参数').then((res) => {
	console.log('--- then 1 --->', res);
});

debounceChange('给fn的参数').then((res) => {
	console.log('--- then 2 --->', res);
});
```

#### compareVersion(v1, v2)

版本号比较，v2大于v1，返回`true`，否则返回`false`

``` js
compareVersion('1.2.3', '1.2.31');	// true
compareVersion('1.2.3', '1.2.3');	// false
```

#### Time

- setTimeout：等待指定时间后调用函数
	- fn：处理函数
	- duration：等待的毫秒数
- delay：等待指定时间
	- 等待时间 单位ms
- setInterval：间隔指定时间调用函数
	- fn：处理函数
	- duration：等待的毫秒数
- clear：清空计时器

```js
const time = new Time();
time.setInterval(() => {
	console.log(this);
});
time.clear();	// 销毁组件 销毁计时器
```

#### treeDataFormat(data, handle)

格式化树级数据

- data：数据
- handle：处理函数

``` js
const data = treeDataFormat([{key: '', title: '', children: [{key: '', title: ''}]}], (item) => {
	return {
		value: item.key,
		text: item.title
	};
});
// [{value: '', text: '', children: [{value: '', text: ''}]}]
```

#### treeFindPath(key, treeData, defaultProps)

树 获取路径

- key：要找的选项值
- treeData：数据
- defaultProps：字段映射关系，默认值：`{ text: 'text', value: 'value' }`

``` js
const data = treeFindPath('xxx', [{key: '', title: '', children: [{key: '', title: ''}]}], { text: 'title', value: 'key' });
// [{key: '', title: ''}, {key: '', title: ''}]
```

## test 规则校验

### idCard(num)

是否身份证号

- num：身份证号

``` js
const flag = idCard('123456198605141234');	// false
```

