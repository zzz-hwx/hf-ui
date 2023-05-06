# hf-ui

基于 uview-ui 2.0 封装的组件，供项目使用

## 基本用法

`./plugin/hf-ui.js`

```js
import Vue from 'vue';
import hfui from '@/uni_modules/hf-ui';

import { loadDictOptions } from './loadData.js';
import { queryPathByIds } from '@/api/index.js';
import configService from '@/common/service/config.service.js';
import store from '@/store/index.js';

Vue.use(hfui);

// 设置处理函数
hfui.setUtils({
    /**
     * 获取字典
     */
    loadDictOptions,
    /**
     * 获取资源绝对路径
     * @param {String} val 相对路径 以','分隔
     */
    async getAbsPath(val) {
        if (!val) return [];
        const res = await queryPathByIds({
            ids: val
        });
        if (!Array.isArray(res.result)) {
            return [];
        }
        return res.result.map(item => {
            const idx = item.fullPath.indexOf('/scpsmip/');
            if(idx != -1) {
                item.fullPath = 'https://www.i-hengfeng.com:48080/io' + item.fullPath.slice(idx);
            }
            return {
                url: item.fullPath, 
                name: item.attachmentName
            };
        });
    },
    /**
     * 图片上传
     * @param {String} path 文件临时路径
     * @param {String} name 文件名
     * @return {Promise}
     */
    uploadFile({ path, name }) {
        return new Promise((resolve, reject) => {
            const token = store.state.user.token;
            let a = uni.uploadFile({
                url: configService.apiUrl + configService.apiPrefix + '/base/baseAttachment/upload',
                filePath: path,
                name: 'file',
                header: {
                    [configService.tokenName]: token,
                },
                formData: {
                    attachmentName: name
                },
                success: (res) => {
                    if (res.statusCode !== 200) {
                        return reject();
                    }
                    const data = JSON.parse(res.data);
                    if (!data.success) {
                        return reject();
                    }
                    resolve({
                        url: data.message,        // 图片绝对路径
                        path: data.result.id    // 相对路径
                    });
                },
                fail: (err) => {
                    reject();
                }
            });
        })
    },
});
```

`main.js`

```js
import './plugin/hf-ui.js'
```

## 表单组件

表单组件基于公共mixin，公共参数/插槽：

**props**

| 参数            | 说明               | 类型             | 默认值   | 可选值         |
| ------------- | ---------------- | -------------- | ----- | ----------- |
| label         | 左侧提示文字           | String         |       |             |
| prop          | 表单域model对象的属性名   | String         |       |             |
| value         | 绑定的值             | String\|Number |       |             |
| disabled      | 是否禁用             | Boolean        | false | true\|false |
| placeholder   | 占位符              | String         |       |             |
| required      | 是否显示左边的"*"号(仅展示) | Boolean        | false | true\|false |
| labelPosition | label的位置         | String         | left  | left\|top   |
| borderBottom  | 是否显示下边框          | Boolean        | true  | true\|false |

**slot**

| 名称  | 说明  |
| --- | --- |
|     |     |

### hf-form-input 输入框

**示例**

```html
<hf-form-input label="姓名" prop="name" :required="!disabled" v-model="model.name" :disabled="disabled" placeholder="请输入"></hf-form-input>
```

```js
export default {
    data() {
        return {
            model: {
                name: ''
            },
            disabled: false
        };
    }
}
```

### hf-form-textarea 文本域

**示例**

```html
<hf-form-textarea label="备注" prop="remark" v-model="model.remark" :disabled="disabled" :maxlength="500" placeholder="请输入"></hf-form-textarea>
```

```js
export default {
    data() {
        return {
            model: {
                remark: ''
            },
            disabled: false
        };
    }
}
```

**props**

| 参数            | 说明                                      | 类型             | 默认值   | 可选值                    |
| ------------- | --------------------------------------- | -------------- | ----- | ---------------------- |
| labelPosition | label的位置                                | String         | top   | left\|top              |
| maxlength     | 最大输入长度                                  | String\|Number | 140   |                        |
| textAlign     | 文字对齐方式                                  | String         | right | left\|center\|right    |
| border        | 边框类型，surround-四周边框，none-无边框，bottom-底部边框 | String         | none  | surround\|none\|bottom |
| count         | 是否显示统计字数                                | Boolean        | false | true\|false            |
| height        | 输入框高度                                   | String\|Number | 70    |                        |

### hf-form-datetime 时间日期选择器

**示例1**

```html
<hf-form-datetime label="日期" prop="date" :required="!disabled" v-model="model.date" :disabled="disabled" mode="date" placeholder="请选择"></hf-form-datetime>
```

```js
export default {
    data() {
        return {
            model: {
                date: ''
            },
            disabled: false
        };
    }
}
```

**示例2**

自定义展示部分

```html
<hf-form-datetime v-model="startTime" mode="date">
    <template v-slot:display-section="{ valueName }">{{ valueName || '巡查开始时间' }}</template>
</hf-form-datetime>
```

**props**

| 参数      | 说明             | 类型     | 默认值      | 可选值                              |
| ------- | -------------- | ------ | -------- | -------------------------------- |
| mode    | 展示格式           | String | datetime | datetime\|date\|time\|year-month |
| minDate | 可选的最小时间(时间戳毫秒) | Number | 默认为前50年  |                                  |
| maxDate | 可选的最大时间(时间戳毫秒) | Number | 默认为后十年   |                                  |

**slot**

| 名称              | 说明   |
| --------------- | ---- |
| display-section | 展示部分 |

### hf-form-radio 单选框

**示例**

```html
<hf-form-radio label="性别" prop="gender" :required="!disabled" v-model="model.gender" :disabled="disabled" dict-code="GENDER"></hf-form-radio>
```

```js
export default {
    data() {
        return {
            model: {
                gender: ''
            },
            disabled: false
        };
    }
}
```

| 参数       | 说明     | 类型     | 默认值 | 可选值 |
| -------- | ------ | ------ | --- | --- |
| dictCode | 字典code | String |     |     |
| options  | 选项     | Array  | []  |     |

### hf-form-checkbox 多选

???

### hf-form-select 列表选择器

**示例**

```html
<hf-form-select label="性别" prop="sex" :required="!disabled" v-model="model.sex" :disabled="disabled" dict-code="SEX" placeholder="请选择"></hf-form-select>
```

```js
export default {
    data() {
        return {
            model: {
                sex: ''
            },
            disabled: false
        };
    }
}
```

**props**

| 参数        | 说明                      | 类型      | 默认值    | 可选值           |
| --------- | ----------------------- | ------- | ------ | ------------- |
| dictCode  | 字典code                  | String  |        |               |
| options   | 选项                      | Array   | []     |               |
| showAll   | 是否添加选项：“全部”             | Boolean | false  | true\|false   |
| mode      | 弹出方向                    | String  | bottom | bottom\|right |
| search    | 是否显示搜索(仅mode='right'有效) | Boolean | false  | true\|false   |
| multiple  | 是否多选(仅mode='right'有效)   | Boolean | false  | true\|false   |
| keyName   | 控制显示的字段                 | String  | label  |               |
| keyValue  | 控制取值的字段                 | String  | value  |               |
| separator | 选项分隔符(仅mode='right'有效)  | String  | ,      |               |

说明：

- 优先级：`dictCode` > `options`

**scoped-slot**

| 名称              | 说明   | 参数                                       |
| --------------- | ---- | ---------------------------------------- |
| display-section | 展示部分 | {valueName: '选中的选项名', visible: '是否显示弹窗'} |

### hf-form-tselect 多列..

???

### hf-form-autocomplete 列表选择器

同`hf-form-select`，数据通过`fetchList`从外部获取

1. 初始为空，输入关键字搜索后，显示列表
2. 直接显示搜索列表，可输入关键字搜索 (通过 trigger-on-show 控制)
3. 不可搜索 直接显示列表

**示例**

```html
<hf-form-autocomplete
    label="建筑物地址"
    prop="buildingId"
    :required="!disabled"
    v-model="model.buildingId"
    :disabled="disabled"
    placeholder="网格名称+道路+门楼牌+小区+幢号"
    :fetchList="getBuildingList"
    search
    defaultItem="defaultBuilding"></hf-form-autocomplete>
```

```js
export default {
    data() {
        return {
            model: {
                buildingId: '',
                detailAddress: ''
            },
            disabled: false
        };
    },
    computed: {
        defaultBuilding() {
            return {
                label: this.model.detailAddress,
                value: this.model.buildingId
            };
        }
    },
    methods: {
        async getBuildingList(param, pagination) {
            const res = await baBuildingList({ // 建筑物地址 列表
                ...param,
                ...pagination
            });
            if (res.result && Array.isArray(res.result.records)) {
                return {
                    total: res.result.total,
                    records: res.result.records.map(item => ({
                        value: item.id,
                        label: item.detailAddress
                    }))
                };
            }
        },
    }
}
```

| 参数            | 说明                                        | 类型       | 默认值   | 可选值         |
| ------------- | ----------------------------------------- | -------- | ----- | ----------- |
| fetchList     | 获取数据的函数，返回promise {total: 0, records: []} | Function |       |             |
| limit         | 分页每页条数 0-不分页                              | Number   | 20    |             |
| search        | 是否显示搜索                                    | Boolean  | false | true\|false |
| triggerOnShow | 是否在展开弹框 显示列表                              | Boolean  | true  | true\|false |
| keyName       | 控制显示的字段                                   | String   | label |             |
| keyValue      | 控制取值的字段                                   | String   | value |             |
| defaultItem   | 默认选中回填的对象                                 | Object   | {}    |             |

### hf-form-area 省市县选择器

**示例**

```html
<hf-form-area label="省市县" prop="area" :required="!disabled" v-model="model.area" :disabled="disabled" placeholder="请选择"></hf-form-area>
```

```js
export default {
    data() {
        return {
            model: {
                area: ''
            },
            disabled: false
        };
    }
}
```

**props**

| 参数        | 说明                 | 类型     | 默认值 | 可选值     |
| --------- | ------------------ | ------ | --- | ------- |
| level     | 级数，默认显示 省市县 三级行政区划 | Number | 3   | 1\|2\|3 |
| separator | 分隔符，显示文字的中文符       | String | /   |         |

### hf-form-cascader 多列级联选择

支持n列级联选择

**示例**

```html
<hf-form-cascader label="区域" prop="cascader" :required="!disabled" v-model="model.cascader" :options="options" :disabled="disabled" placeholder="请选择"></hf-form-cascader>
```

```js
export default {
    data() {
        return {
            model: {
                cascader: ''
            },
            disabled: false,
            options: [{
                "value": "1-0",
                "text": "大连监所",
                "children": [{
                    "value": "1-1",
                    "text": "第一看守所",
                    "children": [{
                        "value": "1-1-1",
                        "text": "一层",
                        "children": [{
                            "value": "1-1-1-1",
                            "text": "一层101",
                            "children": []
                        }]
                    }]
                }, {
                    "value": "1-2",
                    "text": "第三看守所",
                    "children": []
                }]
            }]
        };
    }
}
```

**props**

| 参数            | 说明           | 类型      | 默认值   | 可选值         |
| ------------- | ------------ | ------- | ----- | ----------- |
| options       | 选项           | Array   | []    |             |
| showAllLevels | 是否显示选中值的完整路径 | Boolean | false | true\|false |
| separator     | 分隔符          | String  | /     |             |

### hf-form-location 定位

**示例**

```html
<hf-form-location label="地点" prop="location" disabled initialize-location v-model="model.location" :latitude.sync="model.latitude" :longitude.sync="model.longitude" placeholder="请选择"></hf-form-location>
```

```js
export default {
    data() {
        return {
            model: {
                location: '',
                latitude: '',
                longitude: ''
            },
            disabled: false
        };
    }
}
```

**props**

| 参数                 | 说明                      | 类型             | 默认值   | 可选值         |
| ------------------ | ----------------------- | -------------- | ----- | ----------- |
| latitude           | 纬度                      | String\|Number |       |             |
| longitude          | 经度                      | String\|Number |       |             |
| initializeLocation | 是否初始化位置信息 详情、修改 不主动获取定位 | Boolean        | false | true\|false |

### hf-form-upload 文件上传

文件选择 + 文件上传

**示例**

```html
<hf-form-upload label="图片" prop="picPath" v-model="model.picPath"></hf-form-upload>
```

```js
export default {
    data() {
        return {
            model: {
                picPath: ''
            }
        };
    }
}
```

**props**

| 参数            | 说明                          | 类型             | 默认值              | 可选值                 |
| ------------- | --------------------------- | -------------- | ---------------- | ------------------- |
| labelPosition | label的位置                    | String         | top              | left\|top           |
| accept        | 接受的文件类型                     | String         | image            | image\|video\|media |
| maxCount      | 最大选择图片的数量                   | Number         | 9                |                     |
| bizPath       | 控制文件上传的业务路径                 | String         | 'temp'           |                     |
| maxSize       | 选择单个文件的最大大小，单位B(byte)，默认50M | String\|Number | 50 * 1024 * 1024 |                     |

### hf-form-avatar 头像

**示例**

```html
<hf-form-avatar label="头像" prop="picPath" v-model="model.picPath"></hf-form-avatar>
```

```js
export default {
    data() {
        return {
            model: {
                picPath: ''
            }
        };
    }
}
```

## 显示组件

### hf-search 搜索

**示例**

```html
<hf-search v-model="keyword" placeholder="请输入关键词"></hf-search>
```

```js
export default {
    data() {
        return {
            keyword: ''
        };
    }
}
```

**props**

| 参数          | 说明      | 类型     | 默认值    | 可选值           |
| ----------- | ------- | ------ | ------ | ------------- |
| value       | 输入值     | String |        |               |
| placeholder | 占位符     | String |        |               |
| bgColor     | 搜索框背景颜色 | String | #fff   |               |
| shape       | 搜索框形状   | String | square | round\|square |

### hf-radio 单选

**示例**

```html
<hf-radio v-model="value" :options="options"></hf-radio>
```

```js
export default {
    data() {
        return {
            value: '',
            options: [{label: '选项1', value: '1'}, {label: '选项2', value: '2'}]
        };
    }
}
```

**props**

| 参数      | 说明   | 类型     | 默认值   | 可选值              |
| ------- | ---- | ------ | ----- | ---------------- |
| value   | 绑定值  | String |       |                  |
| mode    | 展示方式 | String | radio | radio\|text\|btn |
| options | 选项   | Array  | []    |                  |

### hf-cascader-picker 嵌入页面的多列级联选择

**示例**

```html
<hf-cascader-picker v-model="value" :options="options"></hf-cascader-picker>
```

```js
export default {
    data() {
        return {
            value: '',
            options: [{
                "value": "1-0",
                "text": "大连监所",
                "children": [{
                    "value": "1-1",
                    "text": "第一看守所",
                    "children": [{
                        "value": "1-1-1",
                        "text": "一层",
                        "children": [{
                            "value": "1-1-1-1",
                            "text": "一层101",
                            "children": []
                        }]
                    }]
                }, {
                    "value": "1-2",
                    "text": "第三看守所",
                    "children": []
                }]
            }]
        };
    }
}
```

| 参数               | 说明        | 类型     | 默认值                           | 可选值 |
| ---------------- | --------- | ------ | ----------------------------- | --- |
| value            | 绑定值       | String |                               |     |
| options          | 选项        | Array  | []                            |     |
| visibleItemCount | 每列中可见选项数量 | Number | 5                             |     |
| itemHeight       | 单个选项高度    | Number | 44                            |     |
| defaultProps     | 配置选项      | Object | {text: 'text',value: 'value'} |     |

### hf-datetime-picker 嵌入页面的日期选择器

逻辑从`<u-picker>`和`<u-datetime-picker>`拷贝粘贴(版本: 2.0.34)
参数和`<u-datetime-picker>`一致(可能部分没有复制 没有实现)

**示例**

```html
<hf-datetime-picker mode="date" v-model="date"></hf-datetime-picker>
```

### hf-datetime-range 嵌入页面的日期范围选择器

基于`<hf-datetime-picker>`

```html
<hf-datetime-range v-model="date" mode="date" placeholder></hf-datetime-range>
```

**props**

| 参数          | 说明                         | 类型      | 默认值   | 可选值                              |
| ----------- | -------------------------- | ------- | ----- | -------------------------------- |
| value       | 绑定值                        | Array   | []    |                                  |
| mode        | 展示格式                       | String  | date  | datetime\|date\|time\|year-month |
| placeholder | 未选择开始结束时间前 是否显示一个占位高度 进行展位 | Boolean | false | true\|false                      |

### hf-upload 文件上传

逻辑从`<u-upload>`拷贝粘贴

参数和`<u-upload>`一致(可能部分没有复制 没有实现)

**示例**

> 参考`<hf-form-upload>`、`<hf-form-avatar>`

**props**

| 参数               | 说明                          | 类型             | 默认值              | 可选值                                     |
| ---------------- | --------------------------- | -------------- | ---------------- | --------------------------------------- |
| value            | 绑定值                         | String         |                  |                                         |
| accept           | 接受的文件类型                     | String         | image            | image\|video\|media                     |
| maxCount         | 最大选择图片的数量                   | Number         | 9                |                                         |
| separator        | 分隔符                         | String         | ,                |                                         |
| bizPath          | 控制文件上传的业务路径                 | String         | 'temp'           |                                         |
| maxSize          | 选择单个文件的最大大小，单位B(byte)，默认不限制 | String\|Number | Number.MAX_VALUE |                                         |
| disableNoShowBtn | 禁用状态，是否不显示选择文件按钮            | Boolean        | false            | true\|false |

### hf-preview 附件预览..

???

### hf-list

列表页面公共组件

可自定义上下固定区域

**示例**

```html
<hf-list ref="hfList" :fetch-list="getList">
    <template #top>
        <hf-search v-model="searchForm.keyword" placeholder="请输入关键字" @search="refreshList"></hf-search>
    </template>
    <template v-slot:item="{ item }">
        <u-cell :title="item.name" :label="item.orgName" is-link></u-cell>
    </template>
</hf-list>
```

```js
export default {
    data() {
        return {
            searchForm: {
                keyword: ''
            }
        };
    },
    onShow() {
        this.refreshList();
    },
    onPullDownRefresh() {
        this.refreshList();
    },
    methods: {
        refreshList() {
            this.$refs.hfList && this.$refs.hfList.getList(true);
        },
        async getList(pagination) {
            const res = await list({
                name: this.searchForm.keyword,
                ...pagination
            });
            if (!(res.result && Array.isArray(res.result.records))) return;
            const data = res.result;
            return {
                total: data.total,
                records: data.records.map(item => {
                    return {
                        id: item.id,
                        name: item.name,
                        orgName: item.adminCodeName
                    };
                })
            };
        }
    }
}
```

**props**

| 参数              | 说明           | 类型       | 默认值   | 可选值         |
| --------------- | ------------ | -------- | ----- | ----------- |
| fetchList       | 获取数据的函数      | Function |       |             |
| limit           | 分页每页条数 0-不分页 | Number   | 20    |             |
| listStyle       | u-list 样式    | Object   |       |             |
| emptyText       | 空提示文字        | String   |       |             |
| rowKey          | 唯一标识字段，作为key | String   | id    |             |
| initNoFetchList | 初始化是否不获取数据   | Boolean  | false | true\|false |

> 注意：
> 
> - fetchList：返回promise {total: 0, records: []}

### hf-list-only

列表滚动组件

**示例**

> 参考`<hf-list>`

### hf-tree

树型选择器 + 仿elementUI 点击父节点多选

> 参考：树形选择器 https://ext.dcloud.net.cn/plugin?id=702

**示例**

```html

```

```js

```

**props**

| 参数             | 说明                 | 类型                    | 默认值     | 可选值         |
| -------------- | ------------------ | --------------------- | ------- | ----------- |
| value          | 绑定值                | Array\|String\|Number |         |             |
| options        | 数据                 | Array                 |         |             |
| defaultProps   | 选项默认配置，具体看下表       | Object                | 看下表     |             |
| multiple       | 是否多选               | Boolean               | false   | true\|false |
| selectParent   | 是否可以选父级            | Boolean               | false   | true\|false |
| foldAll        | 折叠所有子集             | Boolean               | false   | true\|false |
| border         |                    |                       |         |             |
| expandLevel1   | 是否展开第一级            | Boolean               | false   | true\|false |
| noShowCheckbox | 不显示右侧单选多选框，不影响点击选择 | Boolean               | false   | true\|false |
| disabled       | 是否禁用               | Boolean               | false   | true\|false |
| filterable     | 是否可搜索              | Boolean               | false   | true\|false |
| filterText     | 搜索词                | String                |         |             |
| filterKeys     | 可搜索字段              | Array                 |         |             |
| confirmColor   | 单选多选框颜色            | String                | #0081ff |             |
| lastIcon       | 没有子集的icon          | String                |         |             |

**defaultProps Options**
默认值：`{ label: 'label', value: 'value', children: 'children' }`

| 参数       | 说明       | 类型     | 默认值      |
| -------- | -------- | ------ | -------- |
| label    | 选项的标签    | String | label    |
| value    | 选项值      | String | value    |
| children | 子集       | String | children |
| disabled | 是否禁用指定节点 | String | disabled |

**slot**

| 名称  | 说明                           |
| --- | ---------------------------- |
| —   | 自定义树节点的内容，参数为 { node, data } |
