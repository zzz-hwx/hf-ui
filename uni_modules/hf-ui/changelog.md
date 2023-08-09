## 2.0.10（2023-08-09）
- hf-form-area 添加props
	- fullPath：是否全路径
## 2.0.9（2023-08-09）
- hf-form-input 添加props
	- type：输入框类型
	- password：是否密码类型
## 2.0.8（2023-08-09）
- 修改表单组件label字体大小不一样的bug
- hf-form-input 添加props
	- type：输入框类型
	- password：是否密码类型
## 2.0.7（2023-08-08）
- 表单组件：文字溢出隐藏 改为 禁用的input框 可拖动查看完整信息
- hf-upload 文件上传结束才能再选择文件上传
- 重构hf-form-checkbox
## 2.0.6（2023-07-27）
- hf-form-textarea 添加插槽label
## 2.0.5（2023-07-20）
- hf-cascader-picker 添加清空选择逻辑
- hf-upload 添加选择图片数量限制
## 2.0.4（2023-07-18）
- hf-form-upload
	- 修改 maxSize 默认值为10M
## 2.0.3（2023-07-17）
- 修改cascader-picker第1级反选数组为空的bug
- hf-form-upload：删除判断：禁用状态 && 没有文件 => 不显示表单项
	- 详情页面，没有文件，也显示表单项前面的label
## 2.0.2（2023-07-04）
- 修改文件上传回填预览的bug
- 修改文件预览逻辑
- 添加icon
## 2.0.1（2023-06-27）
- 细节样式修改
## 2.0.0（2023-06-27）
- 整体样式修改：靠左
## 1.0.19（2023-06-26）
- hf-form-datetime
	- 修改mode=time时 显示的bug
- hf-form-checkbox
	- 修改样式
	- 添加文档
## 1.0.18（2023-06-14）
- hf-upload 
	- 添加pdf文件预览
	- 优化文件显示样式
## 1.0.17（2023-06-09）
- 修改hf-video样式
## 1.0.16（2023-06-08）
- 添加组件
	- hf-tree：树形组件
	- hf-form-tree：树形组件 + 右侧弹框 + 搜索
- hf-cascader-picker 添加props
	- selectParent：是否可以选父级
- hf-form-cascader 添加props
	- selectParent：是否可以选父级
- hf-form-select 添加props
	- pinyin：是否拼音搜索
## 1.0.15（2023-05-24）
- hf-form-upload：修改详情状态下label样式
- hf-form-select：修改详情状态下label样式
## 1.0.14（2023-05-23）
- hf-upload
	- 添加props：useBeforeRead
	- 添加props：beforeRead
	- 添加props：useBeforePreview
	- 添加props：beforePreview
- hf-form-avatar
	- 支持重新选择头像
## 1.0.13（2023-05-22）
- 修改文本域背景颜色
## 1.0.12（2023-05-22）
- 添加组件
	- hf-icon
- hf-radio
	- options添加参数disabled
- 兼容微信小程序
## 1.0.11（2023-05-17）
- hf-upload
	- 修改 accept 接收的文件类型：media-图片或视频 file-文件
	- 优化视频预览逻辑
- hf-preview
	- 优化视频预览逻辑
## 1.0.10（2023-05-15）
- hf-form-datetime 手动触发组件u-datetime-picker列更新
## 1.0.9（2023-05-10）
- hf-form-textarea
	- 修改textAlign默认值：left，文字靠左
	- 修改样式
- hf-list-only
	- 修改bug：渲染多个组件，防抖会复用fetch-list
	- 修改limit默认值：10，分页每页10条
- hf-list
	- 修改limit默认值：10，分页每页10条
## 1.0.8（2023-05-05）
- hf-form-location
	- 添加 change 事件
- hf-form-are
	- 数据源拆分
## 1.0.7（2023-04-27）
- 删除测试代码
## 1.0.6（2023-04-25）
- hf-upload
	- 添加props：disableNoShowBtn
## 1.0.5（2023-04-25）
- hf-form-select
	- 新增作用域插槽：display-section
	- 添加props：showAll
- hf-form-datetime
	- 添加props：minDate
- hf-form-upload
	- 添加props：bizPath，maxSize
## 1.0.4（2023-04-19）
- 删除测试代码
## 1.0.3（2023-04-19）
- hf-form-cascader 添加props
	- show-all-levels：是否显示选中值的完整路径
	- separator：分隔符
## 1.0.2（2023-04-14）
修改返回参数
## 1.0.1（2023-04-14）
- 组件 hf-preview
## 1.0.0（2023-04-12）
init
