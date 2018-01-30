# edenep-manage-plat-web #
[![vue](https://img.shields.io/badge/vue-2.4.2-brightgreen.svg)](https://github.com/vuejs/vue)
[![element-ui](https://img.shields.io/badge/element--ui-1.4.2-brightgreen.svg)](https://github.com/ElemeFE/element)

**注意：该项目目前使用element-ui@1.4.2版本，所以最低兼容 Vue 2.3.0**

## 前言
> master

目前的技术栈主要的采用vue+element+axios由webpack2打包。数据请求利用mockjs进行模拟。注意：在此项目基础上改造开发时请移除mock文件。


写了一个系列的教程配套文章，如何从零构建后一个完整的后台项目:

 - [wiki](http://wiki.ydzhhw.com:10010/doc/p2r1sKCQ0)
 - [vue2.0.js 中文官方网站](https://cn.vuejs.org/)
 - [ES6 推荐学习站点](http://es6.ruanyifeng.com/)
 - [Element UI 中文官方网站](http://element.eleme.io/#/zh-CN)
 - [vue-router2 官方网站](https://router.vuejs.org/zh-cn/)
 - [mock.js，数据请求模拟插件](http://mockjs.com/)
 - [axios 基于 Promise 的 HTTP 请求客户端](http://blog.csdn.net/binginsist/article/details/65630547)


## 功能
- 登录/注销
- 权限验证
- 侧边栏
- 面包屑
- 富文本编辑器
- Markdown编辑器
- JSON编辑器
- 列表拖拽
- echarts图表
- 401，404错误页面
- 错误日志
- 导出excel
- zip
- 前端可视化excel
- table plugs
- form plugs
- 多环境发布
- dashboard
- 二次登录
- 动态侧边栏（支持多级路由）
- mock数据
- 可编辑式菜单树
- 高德地图

## 开发环境准备
- 下载安装node.js
https://nodejs.org/en/download/
```bash
#操作步骤
    #安装淘宝镜像
    npm install -g cnpm --registry= https://registry.npm.taobao.org

    #安装webpack
    cnpm install webpack -g
    
    #安装vue脚手架
    npm install vue-cli -g
    
    # 切换到项目目录下 克隆项目
    git clone http://git.ydzhhw.com:10000/base/edenep-manage-plat-web.git

    # 安装依赖
    npm install --registry=https://registry.npm.taobao.org

    # 本地开发 开启服务
    npm run dev
```
浏览器访问 http://localhost:9526

## 发布
```bash
    # 发布测试环境 带webpack ananalyzer
    npm run build:sit-preview

    # 构建生产环境
    npm run build:prod
```

## 整体目录结构
```shell
├── build                      // 构建相关  
├── config                     // 配置相关
├── src                        // 源代码
│   ├── api                    // 所有请求
│   ├── assets                 // 主题 字体等静态资源
│   ├── components             // 全局公用组件
│   ├── directive              // 全局指令
│   ├── filtres                // 全局filter
│   ├── mock                   // mock数据
│   ├── router                 // 路由
│   ├── store                  // 全局store管理
│   ├── styles                 // 全局样式
│   ├── utils                  // 全局公用方法
│   ├── view                   // view
│   ├── App.vue                // 入口页面
│   └── main.js                // 入口 加载组件 初始化等
├── static                     // 第三方不打包资源
│   └── Tinymce                // 富文本
├── .babelrc                   // babel-loader 配置
├── eslintrc.js                // eslint 配置项
├── .gitignore                 // git 忽略项
├── favicon.ico                // favicon图标
├── index.html                 // html模板
└── package.json               // package.json

```
## 后台框架目录结构
```shell
├── src                         // 源代码
│   ├── view                    // view
│      ├─dashboard
│      │  │  index.vue          // 首页入口
│      │  │  
│      │  ├─admin
│      │  │      barChart.vue
│      │  │      index.vue
│      │  │      lineChart.vue
│      │  │      pieChart.vue
│      │  │      
│      │  └─editor
│      │          index.vue
│      │          
│      ├─errlog                 // 异常日志
│      │      errcode.vue
│      │      index.vue
│      │      
│      ├─errorPage              // 错误页面
│      │      401.vue
│      │      404.vue
│      │      
│      ├─layout
│      │      AppMain.vue               //页面主视图
│      │      index.js                  //主文件用于引入各分支结构
│      │      Layout.vue                //框架主布局
│      │      Levelbar.vue              //导航栏
│      │      Navbar.vue                //头部结构
│      │      Sidebar.vue               //左菜单入口
│      │      SidebarItem.vue           //左菜单结构
│      │      TabsView.vue              //头部tab标签导航
│      │      
│      ├─login                          //登录模块
│      │      authredirect.vue          //授权跳转
│      │      index.vue                 //登录入口
│      │      socialsignin.vue          //第三方授权登录
│      │      
│      ├─svg-icons                  //svg图标
│      │      generateIconsView.js
│      │      index.vue
│      │      
│      ├─theme                      主题切换
│      │      index.vue
│      │      
│         

```

## 状态管理
后台只有user和app配置相关状态使用vuex存在全局，其它数据都由每个业务页面自己管理。

## License

edenep
