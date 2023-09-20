## 1.1.12（2023-09-19）
- quick添加方法：openDocument：文档预览
## 1.1.11（2023-09-15）
- 自研底座二维码扫描添加.replace(/^\uFEFF/, '')
## 1.1.10（2023-09-13）
- getLocation添加参数：
	- coordinateSystem：设置返回的经纬度坐标系
- chooseVideo添加参数：
	- maxDuration：拍摄视频最长拍摄时间，单位秒
- chooseMedia添加参数：
	- maxDuration：拍摄视频最长拍摄时间，单位秒
- 添加方法：
	- chooseLocation：打开地图选择位置
- 添加配置coordinateSystem：设置中间件默认返回的经纬度坐标系
- 坐标系转换添加方法：mapConversion
## 1.1.9（2023-08-10）
- quick删除方法chooseFile，APP不支持uni.chooseFile
## 1.1.8（2023-08-02）
- 添加方法：
	- scanCode：扫码
## 1.1.7（2023-07-04）
- 添加方法：
	- getRecord：录音
	- openDocument：文档预览
## 1.1.6（2023-06-14）
- 微信小程序选择文件改用：wx.chooseMessageFile
- 自研chooseMedia 选择切换添加等待样式过渡时间 .3s
## 1.1.5（2023-06-07）
- 添加方法：
	- getVersion：获取版本号
## 1.1.4（2023-06-01）
- 自研底座定位getLocation 返回定位为wgs84坐标系
## 1.1.3（2023-05-17）
- 添加方法：
	- chooseMedia：选择图片或视频
## 1.1.2（2023-05-16）
- 添加方法：
	- softInputMode：布局静默
## 1.1.1（2023-05-15）
- 修改bug：getIdCardOcr 字段错误
## 1.1.0（2023-05-06）
- 外部设置配置
## 1.0.6（2023-05-05）
- 添加地址逆解析
- 添加方法：
	- anyRtc：视频、语音
	- scanCode：扫码
## 1.0.5（2023-04-26）
- 添加方法：
	- getSystemInfo
## 1.0.4（2023-04-15）
- 自研统一身份认证联调
## 1.0.3（2023-04-15）
- 快应统一身份认证联调
## 1.0.2（2023-04-10）
- 修改添加文件名
## 1.0.1（2023-04-04）
- 添加方法: 
	- makePhoneCall: 拨打电话
	- logout: 退出登录
	- getUserInfo: 获取用户信息
	- getIdCardOcr: 证件OCR正/反面
## 1.0.0（2023-03-16）
init
