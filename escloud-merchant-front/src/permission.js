import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
import {
  hasLogined,
  hasPermission
} from '@/utils/auth' // 验权
const _import = require('@/router/_import_' + process.env.NODE_ENV)
import Layout from '@/views/plat/layout/Layout'
import { registerNewComponent } from '@/api/resignComponent'

function setRoutes(to, from, next, toPath) {
  // 拉取模块信息
  store.dispatch('GetAppsMenuList').then(res => {
    // 生成可访问的路由表
    store.dispatch('GenerateRoutes', res.data).then(() => {
      if (res.data.error_no !== 0) {
        throw new Error(res.data.error_info)
      }
      const urlArray = []
      const filePathArray = []
      for (let i = 0; i < store.getters.appsMenuList.length; i++) {
        urlArray.push(store.getters.appsMenuList[i].applicationUrl.replace(/\//g, ''))
        filePathArray.push(store.getters.appsMenuList[i].applicationFilePath)
        // 在环卫工作台中 动态创建默认项目首页
        if (store.getters.appsMenuList[i].applicationFilePath === 'merchant/work/index') {
          router.addRoutes(
            [
              registerNewComponent('/work/project/index', 'merchant/work/projectIndex', true)
            ]
          )
        }
      }
      for (let i = 0; i < urlArray.length; i++) {
        const Urlpath = urlArray[i]
        const filePath = filePathArray[i]
        try {
          router.addRoutes([
            {
              path: '/' + Urlpath,
              component: Layout,
              redirect: '/' + Urlpath + '/index',
              meta: store.getters.addRouters[i].meta,
              children: [
                { path: '/' + Urlpath + '/index', component: _import(filePath), meta: store.getters.addRouters[i].meta }]
            }
          ])
        } catch (e) {
          console.log('创建一级路由失败', e)
        }
      }
      // 动态添加可访问路由表
      router.addRoutes(store.getters.addRouters)
      // next({ path: '/work/index' })
      next(toPath)
      // hack方法 确保addRoutes已完成
      // next({ ...to })
    }).catch(() => {
      NProgress.done()
      store.dispatch('FedLogOut').then(() => {
        next({
          path: '/login'
        })
      })
    })
  }).catch(() => {
    store.dispatch('FedLogOut').then(() => {
      next({
        path: '/login'
      })
    })
  })
}
// register global progress.
const whiteList = ['register', '/login', '/authredirect', '/plat/index', '/auth/userRegister', '/auth/resetPassWord'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  // 开启Progress
  NProgress.start()
  // 判断是否已登录
  if (hasLogined()) {
    // 防止页面F5 刷新 vuex中数据清空
    let simpleRole = ''
    let curProjectCode = ''
    if (store.state.user.simpleRole) {
      simpleRole = store.state.user.simpleRole
    } else {
      simpleRole = Number(sessionStorage.getItem('EDENEP_SYSTEM_SIMPLEROLE'))
    }
    console.log('store', store.state.user)
    if (store.state.user.curprojectcode) {
      curProjectCode = store.state.user.curprojectcode
    } else {
      curProjectCode = sessionStorage.getItem('EDENEP_CURPROJECTCODE')
    }
    console.log('curProjectCode', curProjectCode)
    if (to.path === '/login') {
      next({
        path: '/'
      })
    } else if (to.path === '/dashboard' && simpleRole === 1) {
      console.log('e0')
      // 判断当前用户是否已拉取完模块菜单信息
      if (store.getters.appsMenuList.length === 0) {
        let nextPath = ''
        // 单一项目权限时 直接跳转项目, 否则跳转环卫工作台首页
        if (!curProjectCode) {
          nextPath = { path: '/work/index' }
        } else {
          nextPath = { path: '/work/project/index' }
        }
        setRoutes(to, from, next, nextPath)
      } else {
        next({ path: '/work/index' })
      }
    } else {
      // 判断当前用户是否已拉取完模块菜单信息
      if (store.getters.appsMenuList.length === 0) {
        // 拉取模块信息
        setRoutes(to, from, next, { ...to })
      } else {
        store.state.app.minimenu = true
        if (hasPermission(to.meta)) {
          next()
        } else {
          next({ path: '/401', query: { noGoBack: true }})
        }
      }
    }
  } else {
    // 在免登录白名单，直接进入
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      // 否则全部重定向到登录页
      next('/login')
      // 在hash模式下 改变手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // 结束Progress
  NProgress.done()
})
