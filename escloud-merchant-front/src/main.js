import Vue from 'vue'
import ElementUI from 'element-ui'
import App from './App'
// import 'element-ui/lib/theme-default/index.css'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import store from './store'
import * as filters from './filters' // 全局filter
import util from './utils/util'
import './icons' // icon
import './errorLog'// error log
import './permission' // 权限
// import './mock'  // 该项目所有请求使用mockjs模拟
import './assets/icon-alibaba/iconfont.js'
import './assets/icon-alibaba/icon-common.css'

// 引入百度 UEditor 富文本编辑
import '../static/UE/ueditor.config.js'
import '../static/UE/ueditor.all.min.js'
import '../static/UE/lang/zh-cn/zh-cn.js'
import '../static/UE/ueditor.parse.min.js'

Vue.use(ElementUI)
Vue.prototype.$utilHelper = util
// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
