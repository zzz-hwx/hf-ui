# hic-tips

分页加载，底部提示信息组件

五种状态
1. loading 加载中
2. error 加载失败
3. empty 没有数据
4. finished 已加载完最后一页，没有更多数据
5. loadmore 展示的数据未到页面底部 点击加载更多

## 基本用法
- 修改组件主题颜色：`uni.scss`文件引入默认的scss自定义变量
``` scss
@import '~@/uni_modules/hic-tips/theme.scss';
```
​	或者不引入，直接在`uni.scss`文件添加scss自定义变量
``` scss
// 文字颜色
$font-light: #c0c4cc;
// icon颜色
$hic-tips-main: #2595eb;
// icon大小
$hic-tips-font: 240rpx;
// 圆弧的...颜色
$hic-tips-border: lighten($hic-tips-main, 30%);
// 按钮背景渐变色
$hic-tips-btn-bg-color: linear-gradient(45deg, #0081ff, #1cbbb4);
```

- 配置文件
	可修改`config.js`参数，统一全局样式

### 示例1

基本用法

``` html
<view v-for="item in list" :key="item">
    <text>{{ item }}</text>
</view>
<hic-tips
    :page="pagination.page"
    :limit="pagination.limit"
    :total="pagination.total"
    :loading="pagination.loading"
    :error="pagination.error"
    @load="getList"
    @loadmore="loadmore"></hic-tips>
```

``` js
export default {
    data() {
        return {
            list: [],
            pagination: {
                page: 1,
                limit: 10,
                total: 0,
                loading: false,
                error: false
            }
        }
    },
    mounted() {
        this.getList();
    },
    methods: {
        getList() {
            this.pagination.loading = true;
            this.pagination.error = false;
            this.mockGetList({
                page: this.pagination.page,
                limit: this.pagination.limit
            }).then((res) => {
                this.list.push(...res.list);
                this.pagination.total = res.total;
            }).catch(() => {
                this.pagination.error = true;
            }).finally(() => {
                this.pagination.loading = false;
            });
        },
        loadmore() {
            this.pagination.page++;
            this.getList();
        },
        async mockGetList() {
            return {
                list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                total: 20
            };
        }
    }
}
```

### 示例2

页面滚动到底部，通过isLoadMore判断是否加载下一页

``` html
<view v-for="item in list" :key="item">
    <text>{{ item }}</text>
</view>
<hic-tips
    ref="hicTips"
    :page="pagination.page"
    :limit="pagination.limit"
    :total="pagination.total"
    :loading="pagination.loading"
    :error="pagination.error"
    @load="getList"
    @loadmore="loadmore"></hic-tips>
```

``` js
export default {
    data() {
        return {
            list: [],
            pagination: {
                page: 1,
                limit: 10,
                total: 0,
                loading: false,
                error: false
            }
        }
    },
    onLoad() {
        this.getList();
    },
    onReachBottom() {
        // 页面上拉触底事件的处理函数
        if (!this.$refs['hicTips'].isLoadMore()) return;
        this.loadmore();
    },
    methods: {
        getList() {
            this.pagination.loading = true;
            this.pagination.error = false;
            this.mockGetList({
                page: this.pagination.page,
                limit: this.pagination.limit
            }).then((res) => {
                this.list.push(...res.list);
                this.pagination.total = res.total;
            }).catch(() => {
                this.pagination.error = true;
            }).finally(() => {
                this.pagination.loading = false;
            });
        },
        loadmore() {
            this.pagination.page++;
            this.getList();
        },
        async mockGetList() {
            return {
                list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                total: 20
            };
        }
    }
}
```

## API

### Props

| 参数             | 说明                       | 类型    | 可选值     | 默认值                    |
| ---------------- | -------------------------- | ------- | ---------- | ------------------------- |
| page             | 第几页                     | Number  |            | 1                         |
| limit            | 每页几条数据               | Number  |            | 10                        |
| total            | 数据总数                   | Number  |            | 0                         |
| loading          | 是否加载中                 | Boolean | true/false | false                     |
| error            | 是否加载失败               | Boolean | true/false | false                     |
| showEmpty        | 是否显示空数据             | Boolean | true/false | true                      |
| loadingOnlyText  | 加载中是否只显示文字       | Boolean | true/false | false                     |
| emptyOnlyText    | 没有数据是否只显示文字     | Boolean | true/false | false                     |
| finishedOnlyText | 没有更多数据是否只显示文字 | Boolean | true/false | true                      |
| errorOnlyText    | 加载失败是否只显示文字     | Boolean | true/false | false                     |
| loadMoreOnlyText | 加载更多是否只显示文字     | Boolean | true/false | true                      |
| loadingText      | 加载中的提示文字           | String  |            | 正在加载中...             |
| emptyText        | 没有数据的提示文字         | String  |            | 未找到结果，换个姿势再来~ |
| finishedText     | 没有更多数据的提示文字     | String  |            | 没有更多数据啦            |
| errorText        | 加载失败的提示文字         | String  |            | 网络君被堵在二环高架上了~ |
| loadMoreText     | 加载更多的提示文字         | String  |            | 点击或上拉加载更多        |
| loadingIcon      | 加载中默认icon             | String  |            | tips-icon-loading         |
| emptyIcon        | 没有数据默认icon           | String  |            | tips-icon-empty           |
| finishedIcon     | 没有更多数据默认icon       | String  |            | tips-icon-finished        |
| errorIcon        | 加载失败默认icon           | String  |            | tips-icon-error           |

### Methods

| 方法名     | 说明                                                         | 参数 |
| ---------- | ------------------------------------------------------------ | ---- |
| isLoadMore | 是否可加载下一页，返回Boolean<br />true：可加载下一页<br />false：已全部加载完成，不可加载下一页 |      |

### Events

| 事件名   | 说明           | 参数 |
| -------- | -------------- | ---- |
| load     | 错误，重新加载 |      |
| loadmore | 加载下一页     |      |

