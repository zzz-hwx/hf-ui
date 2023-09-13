# hf-middleware

中间件

app使用不同底座，使用不同底座提供的底层方法，通过中间件，统一参数、返回数据格式、调用方式



API

- 快应

- 自研

- uniapp

|                | 快应 | 自研 | uniapp |                  |
| -------------- | ---- | ---- | ------ | ---------------- |
| chooseImage    | ✔    | ✔    | ✔      | 选择图片 拍照    |
| chooseVideo    | ✔    | ✔    | ✔      | 选择视频         |
| chooseMedia    | ✔    | ✔    | ✔      | 选择图片或视频   |
| chooseFile     |      | ✔    | ✔      | 选择文件         |
| getRecord      |      | ✔    |        | 录音             |
| getLocation    | ✔    | ✔    | ✔      | 定位             |
| chooseLocation |      |      | ✔      | 打开地图选择位置 |
| makePhoneCall  |      | ✔    | ✔      | 拨打电话         |
| anyRtc         |      | ✔    |        | 视频、语音       |
| scanCode       | ✔    | ✔    | ✔      | 扫码             |
| getSystemInfo  | ✔    |      |        | 获取系统信息     |
| getVersion     |      | ✔    |        | 获取版本号       |
| softInputMode  |      | ✔    |        | 布局静默         |
| openDocument   |      | ✔    | ✔      | 打开文档         |
| logout         |      | ✔    |        | 退出登录         |
| getUserInfo    |      | ✔    |        | 获取用户信息     |
| getIdCardOcr   |      | ✔    |        | 证件OCR正/反面   |
| getToken       | ✔    | ✔    |        | 获取token        |
| refreshToken   | ✔    | ✔    |        | 刷新token        |

## 使用

### 配置

`main.js`

```js
import './plugin/middleware.js'
```

`plugin/middleware`

```js
import configService from '@/envCfg.js';

import { setConfig } from '@/uni_modules/hf-middleware';

setConfig({
    usedApi: configService.usedApi,
    usedConfig: configService.usedConfig,
    coordinateSystem: configService.coordinateSystem
});
```

`envCfg.js`

```js
import { QUICK_API } from '@/uni_modules/hf-middleware';
export default {
    // 中间件
    usedApi: QUICK_API,    // 使用的 API
    usedConfig: {
        protocol: 'kysk-fzsy-app://',    // app自定义协议
        path: 'native',
    },
    coordinateSystem: 'wgs84'	// 中间件返回的经纬度坐标系
}
```

### 基本用法

```html
<view>
    <u-gap></u-gap>
    <view class="btns">
        <view class="btn">
            <u-button @click="chooseImage">chooseImage</u-button>
        </view>
        <view class="btn">
            <u-button @click="chooseFile">chooseFile</u-button>
        </view>
        <view class="btn">
            <u-button @click="chooseVideo">chooseVideo</u-button>
        </view>
        <view class="btn">
            <u-button @click="getLocation">getLocation</u-button>
        </view>
    </view>
    <u-gap></u-gap>
    <view class="block">
        <u-text :text="usedApi"></u-text>
    </view>
    <u-gap></u-gap>
    <view class="block">
        <image v-for="(item, index) in path" :key="index" :src="item" mode="aspectFit"></image>
    </view>
    <u-gap></u-gap>
    <view class="block">
        <video v-for="(item, index) in video" :key="index" :src="item"></video>
    </view>
    <u-gap></u-gap>
    <view class="block" @click="handleClick">
        <text class="pre">{{ result }}</text>
    </view>
</view>
```

```js
import { usedApi, chooseImage, chooseFile, chooseVideo, getLocation } from '@/uni_modules/hf-middleware';
export default {
    data() {
        return {
            usedApi,
            result: {},
            path: [],
            video: []
        };
    },
    methods: {
        async chooseImage() {
            const res = await chooseImage();
            this.result = res;
            this.path = res.map(item => (item.path));
        },
        async chooseFile() {
            const res = await chooseFile();
            this.result = res;
            this.video = res.map(item => (item.path));
        },
        async chooseVideo() {
            const res = await chooseVideo();
            this.result = res;
            this.video = res.map(item => (item.path));
        },
        async getLocation() {
            const res = await getLocation();
            this.result = res;
        },
        handleClick() {
            uni.setClipboardData({
                data: JSON.stringify(this.result),
                success: function () {
                    uni.showToast({ title: '已复制' });
                }
            });
        }
    }
}
```

## API

都是`promise`的处理，成功走`.then`，失败走`.catch`

### 媒体

#### chooseImage(OBJECT)

从本地相册选择图片或使用相机拍照

**平台差异说明**

| 快应  | 自研  | uniapp |
| --- | --- | ------ |
| ✔   | ✔   | ✔      |

**OBJECT 参数说明**

| 参数名      | 类型      | 默认值  | 说明          | 平台差异说明 |
| -------- | ------- | ---- | ----------- | ------ |
| count    | Number  | 9    | 最多可以选择的图片张数 |        |
| compress | Boolean | true | 是否压缩        | uni    |
| size     | Number  | 200  | 图片压缩体积，单位Kb | uni    |

**返回参数说明**

Array 选择的图片列表

| 参数   | 类型     | 说明            |
| ---- | ------ | ------------- |
| path | String | 本地文件路径        |
| name | String | 包含扩展名的文件名称    |
| size | Number | 文件大小，单位：B（字节） |
| type | String | 文件类型          |

**示例**

```js
chooseImage({ count: 2 }).then((res) => {
    console.log(res);
    // [{path: 'blob:http://localhost:8080/xxx.jpg', name: 'xxx.jpg', size: '123456', type: 'image/jpeg'}];
});
```

#### chooseVideo(OBJECT)

拍摄视频或从手机相册中选视频，返回视频的临时文件路径。

**平台差异说明**

| 快应 | 自研 | uniapp |
| ---- | ---- | ------ |
| ✔    | ✔    | ✔      |

**OBJECT 参数说明**

| 参数名      | 类型   | 默认值 | 说明                         | 平台差异说明 |
| ----------- | ------ | ------ | ---------------------------- | ------------ |
| maxDuration | Number | 10     | 拍摄视频最长拍摄时间，单位秒 |              |

**返回参数说明**

Array 选择的视频列表

| 参数   | 类型     | 说明            |
| ---- | ------ | ------------- |
| path | String | 本地文件路径        |
| name | String | 包含扩展名的文件名称    |
| size | Number | 文件大小，单位：B（字节） |
| type | String | 文件类型          |

**示例**

```js
chooseVideo().then((res) => {
    console.log(res);
    // [{path: 'blob:http://localhost:8080/xxx.mp4', name: 'xxx.mp4', size: '123456', type: 'video/mp4'}]; 
});
```

#### chooseMedia(OBJECT)

选择图片或视频

**平台差异说明**

| 快应 | 自研 | uniapp |
| ---- | ---- | ------ |
| ✔    | ✔    | ✔      |

**返回参数说明**

Array 选择的视频列表

| 参数        | 类型   | 说明                                   |
| ----------- | ------ | -------------------------------------- |
| count       | Number | 最多可选择的数量，默认9，视频只可选择1 |
| maxDuration | Number | 10                                     |

**示例**

```js
chooseMedia().then((res) => {
    console.log(res);
    // [{path: 'blob:http://localhost:8080/xxx.mp4', name: 'xxx.mp4', size: '123456', type: 'video/mp4'}]; 
});
```

#### chooseFile(OBJECT)

选择文件

**平台差异说明**

| 快应  | 自研  | uniapp |
| --- | --- | ------ |
| ✔   | ✔   | ✔      |

**OBJECT 参数说明**

| 参数名   | 类型     | 默认值 | 说明          | 平台差异说明 |
| ----- | ------ | --- | ----------- | ------ |
| count | Number | 1   | 最多可以选择的文件数量 |        |

**返回参数说明**

Array 选择的文件列表

| 参数   | 类型     | 说明            |
| ---- | ------ | ------------- |
| path | String | 本地文件路径        |
| name | String | 包含扩展名的文件名称    |
| size | Number | 文件大小，单位：B（字节） |
| type | String | 文件类型          |

**示例**

```js
chooseFile({ count: 1 }).then((res) => {
    console.log(res);
    // [{path: 'blob:http://localhost:8080/xxx.mp4', name: 'xxx.mp4', size: '123456', type: 'video/mp4'}]; 
});
```

#### getRecord()

录音

**平台差异说明**

| 快应 | 自研 | uniapp |
| ---- | ---- | ------ |
|      | ✔    |        |

**返回参数说明**

Array 录音列表（其实只有一项 和其他统一一致...）

| 参数   | 类型     | 说明            |
| ---- | ------ | ------------- |
| path | String | 本地文件路径        |
| name | String | 包含扩展名的文件名称    |
| size | Number | 文件大小，单位：B（字节） |
| type | String | 文件类型          |

**示例**

``` html
<u-button @click="getRecord">录音</u-button>
<audio
       :src="audit.src"
       :name="audit.name"
       author="xxx"
       controls
></audio>
```

```js
import { getRecord } from '@/uni_modules/hf-middleware';
export default {
    data() {
    	return {
    		audit: {
                src: '',
                name: ''
            }
    	}
    },
    methods: {
    	async getRecord() {
            const res = await getRecord();
            console.log('--- 录音 --->', res);
            // [{path: 'blob:http://localhost:8080/xxx.mp3', name: '6月30日 17点40分.mp3', size: '79848', type: 'audit/mpeg'}]; 
            this.audit.src = res[0].path;
            this.audit.name = res[0].name;
        },
    }
}
```

### 位置

> 注意：`H5 端` 使用地图和定位相关，需要在 [manifest.json](https://uniapp.dcloud.net.cn/collocation/manifest#h5sdkconfig) 内配置腾讯或谷歌等三方地图服务商申请的秘钥（key）

#### getLocation(OBJECT)

获取当前的地理位置

**平台差异说明**

| 快应  | 自研  | uniapp |
| --- | --- | ------ |
| ✔   | ✔   | ✔      |

**OBJECT 参数说明**

| 参数名           | 类型   | 默认值 | 说明                                             | 平台差异说明 |
| ---------------- | ------ | ------ | ------------------------------------------------ | ------------ |
| coordinateSystem | String |        | 返回的经纬度坐标系，默认值为空，不进行坐标系转换 |              |

**返回参数说明**

| 参数        | 类型     | 说明   |
| --------- | ------ | ---- |
| latitude  | Number | 纬度   |
| longitude | Number | 经度   |
| address   | String | 地址信息 |

**示例**

```js
getLocation().then((res) => {
    console.log(res);
    // {latitude: 57.123456, longitude:123.123456, address: 'xxx'}
});
```

#### chooseLocation(OBJECT)

打开地图选择位置

**平台差异说明**

| 快应 | 自研 | uniapp |
| ---- | ---- | ------ |
|      |      | ✔      |

**OBJECT 参数说明**

| 参数名           | 类型   | 默认值 | 说明   | 平台差异说明 |
| ---------------- | ------ | ------ | ------ | ------------ |
| latitude         | String |        | 纬度   |              |
| longitude        | String |        | 经度   |              |
| coordinateSystem | String |        | 坐标系 |              |

**返回参数说明**

| 参数      | 类型   | 说明     |
| --------- | ------ | -------- |
| latitude  | Number | 纬度     |
| longitude | Number | 经度     |
| address   | String | 地址信息 |

**示例**

```js
chooseLocation({ latitude: 57.123456, longitude:123.123456 }).then((res) => {
    console.log(res);
    // {latitude: 57.123456, longitude:123.123456, address: 'xxx'}
});
```

### 设备

#### makePhoneCall(phoneNumber)

拨打电话

**平台差异说明**

| 快应  | 自研  | uniapp |
| --- | --- | ------ |
|     | ✔   | ✔      |

**参数说明**

| 参数          | 类型     | 说明        |
| ----------- | ------ | --------- |
| phoneNumber | String | 需要拨打的电话号码 |

**示例**

```js
makePhoneCall('13912341234');
```

#### anyRtc(OBJECT)

视频、语音

**平台差异说明**

| 快应  | 自研  | uniapp |
| --- | --- | ------ |
|     | ✔   |        |

**OBJECT 参数说明**

| 参数     | 类型     | 默认值 | 说明          |
| ------ | ------ | --- | ----------- |
| userId | String |     | 用户id(必传)    |
| type   | Number | 0   | 类型 0视频, 1语音 |

**示例**

```js
anyRtc({userId: 'xxx', type: 1});
```

#### scanCode

调起客户端扫码界面，扫码成功后返回对应的结果

**平台差异说明**

| 快应 | 自研 | uniapp |
| ---- | ---- | ------ |
| ✔    | ✔    | ✔      |

**OBJECT 参数说明**

说明：仅uni有参数，参数同`uni.scanCode`

| 参数名 | 类型  | 默认值 | 说明  | 平台差异说明 |
| --- | --- | --- | --- | ------ |
| ... |     |     |     |        |

**返回参数说明**

说明：返回参数同`uni.scanCode`（除uni的其他API，返回参数仅有result）

| 参数     | 类型     | 说明     |
| ------ | ------ | ------ |
| result | String | 所扫码的内容 |
| ...    |        |        |

**示例**

```js
scanCode().then((res) => {
    console.log(res);    // { result: 'xxx' }
})
```

#### getSystemInfo()

获取系统信息

**平台差异说明**

| 快应 | 自研 | uniapp |
| ---- | ---- | ------ |
| ✔    |      |        |

**示例**

```js
getSystemInfo().then(res => {
    console.log(res);    // { statusBarHeight: 25 }
});
```

#### getVersion()

获取版本号

**平台差异**

| 快应 | 自研 | uniapp |
| ---- | ---- | ------ |
|      | ✔    |        |

**示例**

``` js
getVersion().then(res => {
    console.log(res);    // { versionCode: xx, versionName: xx }
});
```

#### softInputMode(OBJECT)

布局静默

**平台差异说明**

| 快应 | 自研 | uniapp |
| ---- | ---- | ------ |
|      | ✔    |        |

**OBJECT 参数说明**

| 参数 | 类型   | 默认值 | 说明                                      |
| ---- | ------ | ------ | ----------------------------------------- |
| type | Number | 1      | 类型 1-布局静默, 2-布局上拉直至输入框可见 |

**示例**

```js
softInputMode({ type: 1 });
```

#### openDocument

打开文档

**平台差异说明**

| 快应 | 自研 | uniapp |
| ---- | ---- | ------ |
|      | ✔    | ✔      |

**OBJECT 参数说明**

| 参数 | 类型   | 默认值 | 说明     |
| ---- | ------ | ------ | -------- |
| path | String |        | 文件地址 |

**示例**

``` js
openDocument({ path: 'http://xxx/xxx.pdf' }).then(() => {
    console.log('--- 文件预览成功 --->');
});
```

### 第三方服务

#### logout()

退出登录

**平台差异说明**

| 快应  | 自研  | uniapp |
| --- | --- | ------ |
|     | ✔   |        |

**示例**

```js
logout();    // 底座回到登录页
```

#### getUserInfo()

获取用户信息

**平台差异说明**

| 快应  | 自研  | uniapp |
| --- | --- | ------ |
|     | ✔   |        |

**示例**

```js
getUserInfo().then((res) => {
    console.log(res);
    // {...}
});
```

#### getIdCardOcr(OBJECT)

证件OCR正/反面

**平台差异说明**

| 快应  | 自研  | uniapp |
| --- | --- | ------ |
|     | ✔   |        |

**OBJECT 参数说明**

| 参数名     | 类型     | 默认值 | 说明              | 平台差异说明 |
| ------- | ------ | --- | --------------- | ------ |
| ocrType | Number | 1   | 身份证正反面 1正面, 2反面 |        |

**返回参数说明**

`ocrType`为`1`

| 参数       | 类型     | 说明   |
| -------- | ------ | ---- |
| name     | String | 姓名   |
| sex      | String | 性别   |
| nation   | String | 民族   |
| birthday | String | 出生日期 |
| address  | String | 住址   |
| idcard   | String | 证件号  |

`ocrType`为`2`

| 参数             | 类型     | 说明   |
| -------------- | ------ | ---- |
| expirationDate | String | 到期时间 |

**示例**

```js
getIdCardOcr({ ocrType: 1 }).then((res) => {
    console.log(res);
    // { name: '姓名', sex: '男', nation: '汉族', birthday: '1997-10-19', address: 'xx省xx市xx镇xx村xx号', idcard: '123456123412121234' }
});
getIdCardOcr({ ocrType: 2 }).then((res) => {
    console.log(res);
    // { expirationDate: '2025-05-07' }
});
```

#### getToken

获取token

**平台差异说明**

| 快应  | 自研  | uniapp |
| --- | --- | ------ |
| ✔   | ✔   |        |

**示例**

```js
getToken().then((token) => {
    console.log(token);    // 'xxxx'
})
```

#### refreshToken

刷新token

**平台差异说明**

| 快应  | 自研  | uniapp |
| --- | --- | ------ |
| ✔   |     |        |

**示例**

```js
refreshToken().then((token) => {
    console.log(token);    // 'xxxx'
})
```

## 目录说明

- api：各平台api，导出统一参数、返回格式、调用方式的方法
  - `quick.js`：快应
  - `self.js`：自研
  - `uni.js`：uniapp
- utils：一些工具方法
  - image-conversion：图片转换的第三方库文件
  - `index.js`：工具方法
- `config.js`：配置文件
- `index.js`：入口文件



