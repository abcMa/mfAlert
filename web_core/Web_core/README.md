#Web_core
预先安装文件：
1. nodejs windows下安装 MSI版本

2. http server 安装 npm install http-server -g


项目启动方法：

1. 进入项目根目录![输入图片说明](http://git.oschina.net/uploads/images/2016/0328/125301_f6c64c4b_353613.png "根目录")

2. 输入 npm start启动项目

3. 浏览器访问http://localhost:9300/web 进入系统， 开始本地调试开发


注意：
**此项目中所有地址都访问开发环境的后台API， 不允许直接连接生产环境测试开发。**


===============================================================================
生产 开发切换规则：

需要修改所有独立文件包中的IPTOOLS.js中的serviceUrl 和 API_URL

![输入图片说明](http://git.oschina.net/uploads/images/2016/0810/115218_f3f1ad08_353613.png "在这里输入图片标题")