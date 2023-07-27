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

> ***说明***
>
> 1. 重写了label样式的组件
>    - hf-form-select
>    - hf-form-checkbox
>    - hf-form-upload
> 2. 表单校验的错误提示位置：
>    - 默认：内容区域底部（margin-left: labelWidth）
>    - 左侧：多选checkbox、图片上传upload、头像avatar、文本域textarea（margin-left: 0;）

### hf-form-input 输入框

**示例**

```html
<hf-form-input
	v-model="model.name"
    label="姓名"
    prop="name"
    :required="!disabled"
    :disabled="disabled"
    placeholder="请输入"
></hf-form-input>
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
<hf-form-textarea
    v-model="model.introduction"
    label="简介"
    prop="introduction"
    :required="!disabled"
    :disabled="disabled"
    placeholder="请输入"
    :maxlength="500"
    count
></hf-form-textarea>
```

```js
export default {
    data() {
        return {
            model: {
                introduction: ''
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

**slots**

| 名称  | 说明         |
| ----- | ------------ |
| label | 左侧提示文字 |

### hf-form-datetime 时间日期选择器

**示例1**

```html
<hf-form-datetime
    v-model="model.birthday"
    label="生日"
    prop="birthday"
    :required="!disabled"
    :disabled="disabled"
    placeholder="请选择"
    mode="date"
></hf-form-datetime>
```

```js
export default {
    data() {
        return {
            model: {
                birthday: ''
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
    <template v-slot:display-section="{ valueName }">{{ valueName || '开始时间' }}</template>
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
<hf-form-radio
	v-model="model.gender"
	label="性别"
	prop="gender"
	:required="!disabled"
	:disabled="disabled"
	dict-code="GENDER"
></hf-form-radio>
<hf-form-radio
    v-model="model.sex"
    label="性别"
    prop="sex"
    :required="!disabled"
    :disabled="disabled"
    :options="options"
></hf-form-radio>
```

```js
export default {
    data() {
        return {
            model: {
                gender: '',
                sex: '1'
            },
            disabled: false,
            options: [
            	{ value: '1', label: '男' },
            	{ value: '2', label: '女' },
            ]
        };
    }
}
```

**props**

| 参数     | 说明     | 类型   | 默认值 | 可选值 |
| -------- | -------- | ------ | ------ | ------ |
| dictCode | 字典code | String |        |        |
| options  | 选项     | Array  | []     |        |

### hf-form-checkbox 复选框

**示例**

``` html
<u-form :model="model">
    <hf-form-checkbox
        v-model="model.str"
        label="多选"
        placeholder="请选择"
        :options="options"
	></hf-form-checkbox>
</u-form>
```

``` js
export default {
	data() {
		return {
			model: {
				str: '3,5,8,b,e,n'
			},
			options: [
				{ value: '1', label: '吕布吕奉先' },
				{ value: '2', label: '赵云赵子龙' },
				{ value: '3', label: '典韦' },
				{ value: '4', label: '关羽关云长' },
				{ value: '5', label: '马超马孟起' },
				{ value: '6', label: '张飞张翼德', disabled: true },
				{ value: '7', label: '黄忠' },
				{ value: '8', label: '许褚' },
				{ value: '9', label: '孙策' },
				{ value: 'a', label: '太史慈' },
				{ value: 'b', label: '夏侯惇' },
				{ value: 'c', label: '夏侯渊' },
				{ value: 'd', label: '张辽' },
				{ value: 'e', label: '曹操曹孟德' },
				{ value: 'f', label: '曹丕' },
				{ value: 'g', label: '曹植' },
				{ value: 'h', label: '曹冲' },
				{ value: 'i', label: '曹昂' },
				{ value: 'j', label: '曹安民' },
				{ value: 'k', label: '郭嘉' },
				{ value: 'l', label: '孙权孙仲谋' },
				{ value: 'm', label: '孙坚' },
				{ value: 'n', label: '周瑜周公瑾' },
				{ value: 'o', label: '刘备刘玄德' },
			]
		};
	}
}
```

**props**

| 参数          | 说明        | 类型   | 默认值             | 可选值    |
| ------------- | ----------- | ------ | ------------------ | --------- |
| dictCode      | 字典code    | String |                    |           |
| options       | 选项        | Array  | []                 |           |
| separator     | 选项分隔符  | String | ,                  |           |
| labelPosition | label的位置 | String | top                | left\|top |
| confirmColor  | 多选框颜色  | String | color['u-primary'] |           |

**slots**

| 名称  | 说明         |
| ----- | ------------ |
| label | 左侧提示文字 |

### hf-form-select 列表选择器

**示例**1

- 通过`dict-code`传入字典code
- 通过`options`传入选项

``` html
<hf-form-select
	v-model="model.gender"
	label="性别"
	prop="gender"
	:required="!disabled"
	:disabled="disabled"
	placeholder="请选择"
	dict-code="GENDER"
></hf-form-select>
<hf-form-select
	v-model="model.sex"
	label="性别"
	prop="sex"
	:required="!disabled"
	:disabled="disabled"
	placeholder="请选择"
	:options="options"
></hf-form-select>

<script>
export default {
    data() {
        return {
            model: {
                gender: '',
                sex: '1'
            },
            disabled: false,
            options: [
            	{ value: '1', label: '男' },
            	{ value: '2', label: '女' },
            ]
        };
    }
}
</script>
```

**示例2**

- 右侧弹出框：`mode="right"`
- 前端搜索：`search`
- 多选：`multiple`

```html
<hf-form-select
    v-model="model.interest"
    label="兴趣爱好"
    prop="interest"
    :disabled="disabled"
    placeholder="请选择"
    :options="options"
    mode="right"
    search
    multiple
></hf-form-select>
<script>
export default {
    data() {
        return {
            model: {
                interest: ''
            },
            disabled: false,
            options: [
            	{ value: '1', label: '羽毛球' },
                { value: '2', label: '跑步' },
                { value: '3', label: '爬山' },
                { value: '4', label: '游泳' },
                { value: '5', label: '瑜伽' },
                { value: '6', label: '舞蹈' },
                { value: '7', label: '足球' },
                { value: '8', label: '攀岩' },
                { value: '9', label: '钓鱼' },
            ]
        };
    }
}
</script>
```

**props**

| 参数      | 说明                             | 类型    | 默认值 | 可选值        |
| --------- | -------------------------------- | ------- | ------ | ------------- |
| dictCode  | 字典code                         | String  |        |               |
| options   | 选项                             | Array   | []     |               |
| showAll   | 是否添加选项：“全部”             | Boolean | false  | true\|false   |
| mode      | 弹出方向                         | String  | bottom | bottom\|right |
| search    | 是否显示搜索(仅mode='right'有效) | Boolean | false  | true\|false   |
| pinyin    | 是否拼音搜索(仅mode='right'有效) | Boolean | false  | true\|false   |
| multiple  | 是否多选(仅mode='right'有效)     | Boolean | false  | true\|false   |
| keyName   | 控制显示的字段                   | String  | label  |               |
| keyValue  | 控制取值的字段                   | String  | value  |               |
| separator | 选项分隔符(仅mode='right'有效)   | String  | ,      |               |

说明：

- 优先级：`dictCode` > `options`

**slots**

| 名称  | 说明         |
| ----- | ------------ |
| label | 左侧提示文字 |

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

**示例1**

```html
<hf-form-autocomplete
    v-model="model.buildingId"
    label="建筑物地址"
    prop="buildingId"
    :required="!disabled"
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

**示例2**

``` html
<hf-form-autocomplete
    v-model="model.articleId"
    label="分页文章列表"
    prop="articleId"
    :disabled="disabled"
    placeholder="请选择"
    :fetch-list="fetchArticleList"
    key-name="title"
    key-value="id"
    search
>
    <template v-slot:item="{ item }">
        <u-text :text="item.title" bold></u-text>
        <u-text :text="item.content" type="info"></u-text>
    </template>
</hf-form-autocomplete>
```

```js
export default {
    data() {
        return {
            model: {
                articleId: ''
            }
        }
    },
    methods: {
        async fetchArticleList(param, pagination) {
            // param = { keyword: '搜索关键字' }, pagination = { pageNo: 1, pageSize: 20 }
            const records = [];
            for (let i = 0; i < pagination.pageSize; i++) {
                const id = (pagination.pageNo - 1) * pagination.pageSize + i + 1;
                records.push({ id, title: `文章${id}`, content: '文章内容文章内容文章内容...' });
            }
            return {
                total: 160,
                records
            };
        },
    }
}
```

**props**

| 参数            | 说明                                        | 类型       | 默认值   | 可选值         |
| ------------- | ----------------------------------------- | -------- | ----- | ----------- |
| fetchList     | 获取数据的函数，返回promise {total: 0, records: []} | Function |       |             |
| limit         | 分页每页条数 0-不分页                              | Number   | 20    |             |
| search        | 是否显示搜索                                    | Boolean  | false | true\|false |
| triggerOnShow | 是否在展开弹框 显示列表                              | Boolean  | true  | true\|false |
| keyName       | 控制显示的字段                                   | String   | label |             |
| keyValue      | 控制取值的字段                                   | String   | value |             |
| defaultItem   | 默认选中回填的对象                                 | Object   | {}    |             |

**scoped-slot**

| 名称 | 说明             | 参数         |
| ---- | ---------------- | ------------ |
| item | 自定义选项的内容 | {item: 选项} |

### hf-form-area 省市县选择器

**示例**

```html
<hf-form-area
    v-model="model.area"
    label="省市县"
    prop="area"
    :required="!disabled"
    :disabled="disabled"
    placeholder="请选择"
></hf-form-area>
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

### hf-form-cascader 级联选择

级联选择

**示例**

```html
<hf-form-cascader
    v-model="model.cascader"
    label="区域"
    prop="cascader"
    :required="!disabled"
    :disabled="disabled"
    placeholder="请选择"
    :options="options"
></hf-form-cascader>
<hf-form-cascader
    v-model="model.cascader2"
    label="任意一级可选择"
    :options="options"
    select-parent
></hf-form-cascader>
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
					value: '1',
					text: '一级 1',
					children: [{
						value: '1-1',
						text: '二级 1-1',
						children: [{
							value: '1-1-1',
							text: '三级 1-1-1',
							children: [{
								value: '1-1-1-1',
								text: '四级 1-1-1-1'
							}]
						}]
					}, {
						value: '1-2',
						text: '二级 1-2',
					}]
				}, {
					value: '2',
					text: '一级 2',
					children: [{
						value: '2-1',
						text: '二级 2-1'
					}]
				}
			]
        };
    }
}
```

**props**

| 参数          | 说明                                        | 类型    | 默认值 | 可选值      |
| ------------- | ------------------------------------------- | ------- | ------ | ----------- |
| options       | 选项                                        | Array   | []     |             |
| showAllLevels | 是否显示选中值的完整路径                    | Boolean | false  | true\|false |
| selectParent  | 是否可以选父级                              | Boolean | false  | true\|false |
| separator     | 分隔符                                      | String  | /      |             |
| defaultProps  | 配置选项，同hf-cascader-picker.defaultProps | Object  | {}     |             |

### hf-form-tree 树形组件

树形组件 + 右侧弹框 + 搜索

**示例1**

``` html
<hf-form-tree
	v-model="model.key1"
	label="多选"
	placeholder="请选择"
	:options="options"
	:default-props="defaultProps"
	multiple
></hf-form-tree>
<hf-form-tree
	v-model="model.key2"
	label="多选 可选父节点"
	placeholder="请选择"
	:options="options"
	:default-props="defaultProps"
	multiple
	select-parent
></hf-form-tree>
<hf-form-tree
	v-model="model.key3"
	label="多选 可选父节点 父子不互相关联"
	placeholder="请选择"
	:options="options"
	:default-props="defaultProps"
	multiple
	select-parent
	select-strictly
	labelPosition="top"
></hf-form-tree>
<hf-form-tree
	v-model="model.key4"
	label="单选"
	placeholder="请选择"
	:options="options"
	:default-props="defaultProps"
	search
	pinyin
></hf-form-tree>
```

``` js
export default {
	data() {
		return {
			model: {
				key1: '1-1-1-1,1-1-1-3',
				key2: '1-1-1-2',
				key3: '1,1-1-1-2',
				key4: '1-1-1-2',
			},
			defaultProps: {
				text: 'text',
				value: 'value',
				children: 'children'
			},
			options: [{
					value: '1',
					text: '一级 1',
					children: [{
							value: '1-1',
							text: '二级 1-1',
							children: [{
									value: '1-1-1',
									text: '三级 1-1-1',
									children: [
										{ value: '1-1-1-1', text: '四级 1-1-1-1' },
										{ value: '1-1-1-2', text: '四级 1-1-1-2' },
										{ value: '1-1-1-3', text: '四级 1-1-1-3' },
									]
								}
							]
						}, {
							value: '1-2',
							text: '二级 1-2',
							children: [
								{ value: '1-2-1', text: '三级 1-2-1' },
								{ value: '1-2-2', text: '三级 1-2-2' },
							]
						}
					]
				}, {
					value: '2',
					text: '一级 2',
					children: [{
							value: '2-1',
							text: '二级 2-1'
						}, {
							value: '2-2',
							text: '二级 2-2',
							children: [
								{ value: '2-2-1', text: '三级 2-2-1' },
								{ value: '2-2-2', text: '三级 2-2-2' },
							]
						},
					]
				}
			]
		};
	},
	methods: {
		confirm() {
			console.log('--- 打印 --->', uni.$u.deepClone(this.model));
			// 
		},
	}
}
```

**示例2**

```html
<hf-form-tree
	v-model="model.key1"
	label="任务下派"
	placeholder="请选择"
	:options="options"
	:default-props="defaultProps"
	multiple
	select-parent
	select-strictly
	last-icon="people"
	last-icon-color="#CCCCCC"
></hf-form-tree>
```

``` js
export default {
	data() {
		return {
			model: {
				key1: '1,1-1-1-1,1-1-3,1-2-2-1',
			},
			defaultProps: {
				text: 'text',
				value: 'value',
				children: 'children'
			},
			options: [{
					value: '1',
					text: '鼓楼区',
					children: [{
							value: '1-1',
							text: '社区名称',
							children: [{
									value: '1-1-1',
									text: '第一网格',
									children: [
										{ value: '1-1-1-1', text: '刘一' },
										{ value: '1-1-1-2', text: '陈二' },
										
									]
								}, {
									value: '1-1-2',
									text: '第二网格',
									children: [
										{ value: '1-1-2-1', text: '张三' },
										{ value: '1-1-2-2', text: '李四' },
										{ value: '1-1-2-3', text: '王五' },
									]
								}, {
									value: '1-1-3',
									text: '第三网格',
									children: [
										{ value: '1-1-3-1', text: '赵六' },
										{ value: '1-1-3-2', text: '孙七' },
										{ value: '1-1-3-3', text: '周八' },
									]
								}
							]
						}, {
							value: '1-2',
							text: '社区名称',
							children: [{
									value: '1-2-1',
									text: '第四网格',
									children: [
										{ value: '1-2-1-1', text: '吴九' },
										{ value: '1-2-1-2', text: '郑十' },
									]
								}, {
									value: '1-2-2',
									text: '第五网格',
									children: [
										{ value: '1-2-2-1', text: '张三丰' },
										{ value: '1-2-2-2', text: '张三丰' },
									]
								},
							]
						}
					]
				}, {
					value: '2',
					text: '台江区',
					children: [{
							value: '2-1',
							text: '社区名称',
							children: [{
									value: '2-1-1',
									text: '第一网格',
									children: [
										{ value: '2-1-1-1', text: '张三丰' },
										{ value: '2-1-1-2', text: '张三丰' },
										
									]
								}, {
									value: '2-1-2',
									text: '第二网格',
									children: [
										{ value: '2-1-2-1', text: '张三丰' },
										{ value: '2-1-2-2', text: '张三丰' },
										{ value: '2-1-2-3', text: '张三丰' },
									]
								}, {
									value: '2-1-3',
									text: '第三网格',
									children: [
										{ value: '2-1-3-1', text: '张三丰' },
										{ value: '2-1-3-2', text: '张三丰' },
										{ value: '2-1-3-3', text: '张三丰' },
									]
								}
							]
						},
					]
				}
			]
		};
	},
}
```

**props**

| 参数           | 说明                                            | 类型    | 默认值 | 可选值      |
| -------------- | ----------------------------------------------- | ------- | ------ | ----------- |
| options        | 数据                                            | Array   |        |             |
| multiple       | 是否多选                                        | Boolean | false  | true\|false |
| defaultProps   | 选项默认配置，同hf-tree.defaultProps            | Object  |        |             |
| search         | 是否显示搜索                                    | Boolean | false  | true\|false |
| pinyin         | 是否拼音搜索                                    | Boolean | false  | true\|false |
| showAllLevels  | 是否显示选中值的完整路径                        | Boolean | false  | true\|false |
| selectParent   | 是否可以选父级                                  | Boolean | false  | true\|false |
| selectStrictly | 在多选的情况下 是否严格遵循父子不互相关联的做法 | Boolean | false  | true\|false |
| separator      | 多选选项值的分隔符                              | String  | ,      |             |
| textSeparator  | 选项名的分隔符                                  | String  | /      |             |
| lastIcon       | 没有子集的icon                                  | String  |        |             |
| lastIconColor  | 没有子集的icon颜色                              | String  |        |             |

>注意：
>
>- defaultProps：同`hf-tree.defaultProps`

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
<u-form ref="uForm" :model="model" :rules="rules">
	<hf-form-upload
		v-model="model.image"
		label="图片"
		prop="image"
		:required="!disabled"
		:disabled="disabled"
		accept="image"
		:max-count="3"
		biz-path="image"
		:max-size="maxSize"
	></hf-form-upload>
	
	<hf-form-upload
		v-model="model.video"
		label="视频"
		prop="video"
		:required="!disabled"
		:disabled="disabled"
		accept="video"
		:max-count="1"
		biz-path="video"
		:max-size="maxSize"
	></hf-form-upload>
	
	<hf-form-upload
		v-model="model.media"
		label="图片和视频"
		prop="media"
		:required="!disabled"
		:disabled="disabled"
		accept="media"
		:max-count="3"
		biz-path="media"
		:max-size="maxSize"
	></hf-form-upload>
	
	<hf-form-upload
		v-model="model.file"
		label="文件"
		prop="file"
		:required="!disabled"
		:disabled="disabled"
		accept="file"
		:max-count="9"
		biz-path="file"
		:max-size="maxSize"
	></hf-form-upload>
</u-form>
```

```js
export default {
    data() {
        return {
            model: {
                image: '',
                video: '',
                media: '',
                file: ''
            },
            rules: {
                // 
            },
            disabled: false,
            maxSize: 5 * 1024 * 1024, // 5M
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

**slots**

| 名称 | 说明                          |
| ---- | ----------------------------- |
| tip  | 左侧提示文字左侧的提示文字... |

### hf-form-avatar 头像

头像选择、头像上传组件，点击头像，可重新选择头像

**示例**

```html
<hf-form-avatar
    v-model="model.picPath"
    label="头像"
    prop="picPath"
    :required="!disabled"
    :disabled="disabled"
></hf-form-avatar>
```

```js
export default {
    data() {
        return {
            disabled: false,
            model: {
                picPath: ''
            }
        };
    }
}
```

## 显示组件

### hf-icon 图标

**示例**

``` html
<hf-icon name="location-fill" color="primary" size="24"></hf-icon>
```

**props**

| 参数         | 说明                                        | 类型           | 默认值                   | 可选值      |
| ------------ | ------------------------------------------- | -------------- | ------------------------ | ----------- |
| name         | 图标名称，对应iconfont（Font Class）        | String         |                          |             |
| color        | 图标颜色，可配置主题颜色（primary/info...） | String         | color['u-content-color'] |             |
| size         | 图标字体大小，单位默认px                    | String\|Number | 16px                     |             |
| bold         | 是否显示粗体                                | Boolean        | false                    | true\|false |
| customFamily | Font Family                                 | String         | hf                       |             |
| customPrefix | 自定义字体图标库 前缀                       | String         | hf                       |             |
| stop         | 是否阻止事件传播                            | Boolean        | false                    | true\|false |

**events**

| 事件名 | 说明           | 回调参数 |
| ------ | -------------- | -------- |
| click  | 点击图标时触发 | -        |

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

### hf-cascader-picker 级联选择

嵌入页面的多列级联选择，多层级数据的选择。

何时使用：需要从一组相关联的数据集合进行选择，例如省市区，公司层级，事物分类等。

重复点击已选择的选项，为反选。

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

**props**

| 参数             | 说明               | 类型    | 默认值 | 可选值      |
| ---------------- | ------------------ | ------- | ------ | ----------- |
| value            | 绑定值             | String  |        |             |
| options          | 选项               | Array   | []     |             |
| visibleItemCount | 每列中可见选项数量 | Number  | 5      |             |
| itemHeight       | 单个选项高度       | Number  | 44     |             |
| defaultProps     | 配置选项           | Object  | {}     |             |
| selectParent     | 是否可以选父级     | Boolean | false  | true\|false |

**defaultProps Options**
默认值：`{ text: 'text', value: 'value', children: 'children' }`

| 参数     | 说明             | 类型   | 默认值   |
| -------- | ---------------- | ------ | -------- |
| text     | 选项的标签       | String | text     |
| value    | 选项值           | String | value    |
| children | 子集             | String | children |
| disabled | 是否禁用指定节点 | String | disabled |

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

| 参数             | 说明                                            | 类型           | 默认值           | 可选值                    |
| ---------------- | ----------------------------------------------- | -------------- | ---------------- | ------------------------- |
| value            | 绑定值                                          | String         |                  |                           |
| accept           | 接受的文件类型                                  | String         | image            | image\|video\|media\|file |
| maxCount         | 最大选择图片的数量                              | Number         | 9                |                           |
| separator        | 分隔符                                          | String         | ,                |                           |
| bizPath          | 控制文件上传的业务路径                          | String         | 'temp'           |                           |
| maxSize          | 选择单个文件的最大大小，单位B(byte)，默认不限制 | String\|Number | Number.MAX_VALUE |                           |
| disableNoShowBtn | 禁用状态，是否不显示选择文件按钮                | Boolean        | false            | true\|false               |
| useBeforeRead    | 是否开启读取前的处理函数                        | Boolean        | false            | true\|false               |
| beforeRead       | 读取前的处理函数                                | Function       |                  |                           |
| useBeforePreview | 是否开启预览前的处理函数                        | Boolean        | false            | true\|false               |
| beforePreview    | 预览前的处理函数                                | Function       |                  |                           |

**accept 合法值**

| 值    | 说明               |
| ----- | ------------------ |
| image | 图片               |
| video | 视频               |
| media | 图片或视频         |
| file  | 文件（未实现预览） |

> 说明：
>
> - 如果需要pdf文件预览，需要配置页面：`uni_modules/hf-ui/pages/preview/preview` ！！！

### hf-preview 附件预览

附件预览，样式同hf-upload

**示例**

```html
<hf-preview :value="info.attachmentList"></hf-preview>
```

``` js
export default {
    data() {
        return {
            info: {
                // 文件上传保存的值, 后端保存的文件id, 逗号',' 分隔
                attachmentList: '1658666945588277249,1658667005730402306'
            }
        };
    }
}
```

**props**

| 参数      | 说明                                              | 类型           | 默认值     | 可选值 |
| --------- | ------------------------------------------------- | -------------- | ---------- | ------ |
| value     | 绑定值                                            | String         |            |        |
| width     | 预览文件区域宽度，单位rpx，不能是百分比，或者auto | String\|Number | 80         |        |
| height    | 预览文件区域高度，单位rpx，不能是百分比，或者auto | String\|Number | 80         |        |
| separator | 分隔符                                            | String         | ,          |        |
| imageMode | 预览图片的裁剪模式，和image组件的mode属性一致     | String         | aspectFill |        |

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

| 参数            | 说明                  | 类型     | 默认值 | 可选值      |
| --------------- | --------------------- | -------- | ------ | ----------- |
| fetchList       | 获取数据的函数        | Function |        |             |
| limit           | 分页每页条数 0-不分页 | Number   | 10     |             |
| listStyle       | u-list 样式           | Object   |        |             |
| emptyText       | 空提示文字            | String   |        |             |
| rowKey          | 唯一标识字段，作为key | String   | id     |             |
| initNoFetchList | 初始化是否不获取数据  | Boolean  | false  | true\|false |

> 注意：
> 
> - fetchList：返回promise {total: 0, records: []}

### hf-list-only

列表滚动组件，包含缺省提示

**示例1：H5**

弹性布局的纵向布局，上下可自定义内容，`hf-list-only`剩余高度撑开

``` html
<template>
	<view class="page">
		<hf-search v-model="searchForm.keyword" placeholder="请输入关键字" @search="refreshList"></hf-search>
		<hf-list-only
			ref="hfList"
			:fetch-list="fetchList"
		>
			<template v-slot:item="{ item }">
				<u-cell :title="item.title" :label="item.content"></u-cell>
			</template>
		</hf-list-only>
	</view>
</template>

<script>
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
			fetchList(pagination) {
				const params = {
					keyword: this.searchForm.keyword,
					...pagination
				}
				const records = [];
				for (let i = 0; i < pagination.pageSize; i++) {
					const id = (pagination.pageNo - 1) * pagination.pageSize + i + 1;
					records.push({ id, title: `文章${id}`, content: '文章内容文章内容文章内容...' });
				}
				return {
					total: 160,
					records
				};
			}
		}
	}
</script>

<style lang="scss" scoped>
.page {
	height: 100vh;
	display: flex;
	flex-direction: column;
}
</style>
```

**示例2：小程序**

相比 **示例1：H5** 添加代码

- 添加样式：`<hf-list-only style="flex: 1; height: 0;" ...>`
  ∵ 微信小程序 多一层 ∴ 手动设置高度撑开
- 生命周期`mounted`手动设置`fetch-list`：`this.$refs.hfList.setFetchList(this.fetchList);`
  ∵ props传入函数, 组件内调用，微信小程序 this指向当前组件实例`hf-list-only`
  ∴ 父组件调用`setFetchList`手动传入函数，组件内调用，`this`指向父级

``` html
<template>
	<view class="page">
		<hf-search v-model="searchForm.keyword" placeholder="请输入关键字" @search="refreshList"></hf-search>
		<hf-list-only
			ref="hfList"
			:fetch-list="fetchList"
			style="flex: 1; height: 0;"
		>
			<template v-slot:item="{ item }">
				<u-cell :title="item.title" :label="item.content"></u-cell>
			</template>
		</hf-list-only>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchForm: {
					keyword: ''
				}
			};
		},
		mounted() {
			this.$refs.hfList.setFetchList(this.fetchList);
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
			fetchList(pagination) {
				const params = {
					keyword: this.searchForm.keyword,
					...pagination
				}
				const records = [];
				for (let i = 0; i < pagination.pageSize; i++) {
					const id = (pagination.pageNo - 1) * pagination.pageSize + i + 1;
					records.push({ id, title: `文章${id}`, content: '文章内容文章内容文章内容...' });
				}
				return {
					total: 160,
					records
				};
			}
		}
	}
</script>

<style lang="scss" scoped>
.page {
	height: 100vh;
	display: flex;
	flex-direction: column;
}
</style>
```

说明：

通过ref调用组件`setFetchList`方法，只能放mount生命周期之后
组件内部`created`生命周期钩子函数，调用防抖返回的`getList`方法，因为防抖500ms时延，所以...阴差阳错...外部手动调用`setFetchList`设置`fetchList`之后，组件内部再初次调用`getList`调用父组件传入的`fetchList`方法。

### hf-tree 树形组件

树型选择器 + 仿elementUI 点击父节点多选

> 参考：树形选择器 https://ext.dcloud.net.cn/plugin?id=702

**示例**

```html
<view style="padding: 20rpx 20rpx 0; color: #999;">多选</view>
<hf-tree ref="hfTree1" :value="model.key1" :options="options" :defaultProps="defaultProps" multiple></hf-tree>

<view style="padding: 20rpx 20rpx 0; color: #999;">多选 可选父节点</view>
<hf-tree ref="hfTree2" :value="model.key2" :options="options" :defaultProps="defaultProps" multiple select-parent></hf-tree>

<view style="padding: 20rpx 20rpx 0; color: #999;">多选 可选父节点 父子不互相关联</view>
<hf-tree ref="hfTree3" :value="model.key3" :options="options" :defaultProps="defaultProps" multiple select-parent select-strictly></hf-tree>

<view style="padding: 20rpx 20rpx 0; color: #999;">单选</view>
<hf-tree ref="hfTree4" :value="model.key4" :options="options" :defaultProps="defaultProps"></hf-tree>

<view class="btns">
	<u-button @click="confirm">打印</u-button>
</view>
```

```js
export default {
	data() {
		return {
			model: {
				key1: ['1-1-1-1', '1-1-1-3'],
				key2: ['1-1-1-2'],
				key3: ['1', '1-1-1-2'],
				key4: '1-1-1-2',
			},
			defaultProps: {
				text: 'text',
				value: 'value',
				children: 'children'
			},
			options: [{
					value: '1',
					text: '一级 1',
					children: [{
							value: '1-1',
							text: '二级 1-1',
							children: [{
									value: '1-1-1',
									text: '三级 1-1-1',
									children: [
										{ value: '1-1-1-1', text: '四级 1-1-1-1' },
										{ value: '1-1-1-2', text: '四级 1-1-1-2' },
										{ value: '1-1-1-3', text: '四级 1-1-1-3' },
									]
								}
							]
						}, {
							value: '1-2',
							text: '二级 1-2',
							children: [
								{ value: '1-2-1', text: '三级 1-2-1' },
								{ value: '1-2-2', text: '三级 1-2-2' },
							]
						}
					]
				}, {
					value: '2',
					text: '一级 2',
					children: [{
							value: '2-1',
							text: '二级 2-1'
						}, {
							value: '2-2',
							text: '二级 2-2',
							children: [
								{ value: '2-2-1', text: '三级 2-2-1' },
								{ value: '2-2-2', text: '三级 2-2-2' },
							]
						},
					]
				}
			]
		};
	},
	methods: {
		confirm() {
			// [{value: '1-1-1-1', text: '四级 1-1-1-1'}, {value: '1-1-1-3', text: '二级 1-1-1-3'}]
			console.log('--- hfTree1 --->', this.$refs.hfTree1.confirm());
			// [{value: '1-1-1-2', text: '四级 1-1-1-2'}]
			console.log('--- hfTree2 --->', this.$refs.hfTree2.confirm());
			// [{value: '1', text: '一级 1', children: Array(2)}, {value: '1-1-1-2', text: '四级 1-1-1-2'}]
			console.log('--- hfTree3 --->', this.$refs.hfTree3.confirm());
			// [{value: '1-1-1-2', text: '四级 1-1-1-2'}]
			console.log('--- hfTree4 --->', this.$refs.hfTree4.confirm());
		},
	}
}
```

**props**

| 参数           | 说明                                            | 类型                  | 默认值             | 可选值      |
| -------------- | ----------------------------------------------- | --------------------- | ------------------ | ----------- |
| value          | 绑定值                                          | Array\|String\|Number |                    |             |
| options        | 数据                                            | Array                 |                    |             |
| defaultProps   | 选项默认配置，具体看下表                        | Object                | 看下表             |             |
| multiple       | 是否多选                                        | Boolean               | false              | true\|false |
| selectParent   | 是否可以选父级                                  | Boolean               | false              | true\|false |
| selectStrictly | 在多选的情况下 是否严格遵循父子不互相关联的做法 | Boolean               | false              | true\|false |
| foldAll        | 折叠所有子集                                    | Boolean               | false              | true\|false |
| border         | 是否有分割线（未实现）                          | Boolean               | false              | true\|false |
| expandLevel1   | 是否展开第一级                                  | Boolean               | false              | true\|false |
| noShowCheckbox | 不显示右侧单选多选框，不影响点击选择            | Boolean               | false              | true\|false |
| disabled       | 是否禁用                                        | Boolean               | false              | true\|false |
| filterable     | 是否可搜索                                      | Boolean               | false              | true\|false |
| filterText     | 搜索词                                          | String                |                    |             |
| filterKeys     | 可搜索字段                                      | Array                 |                    |             |
| pinyin         | 是否拼音搜索                                    | Boolean               | false              | true\|false |
| confirmColor   | 单选多选框颜色                                  | String                | color['u-primary'] |             |
| lastIcon       | 没有子集的icon                                  | String                |                    |             |
| lastIconColor  | 没有子集的icon颜色                              | String                |                    |             |

**defaultProps Options**
默认值：`{ text: 'text', value: 'value', children: 'children' }`

| 参数     | 说明             | 类型   | 默认值   |
| -------- | ---------------- | ------ | -------- |
| text     | 选项的标签       | String | text     |
| value    | 选项值           | String | value    |
| children | 子集             | String | children |
| disabled | 是否禁用指定节点 | String | disabled |

**slot**

| 名称  | 说明                           |
| --- | ---------------------------- |
| —   | 自定义树节点的内容，参数为 { node, data } |

## 说明



