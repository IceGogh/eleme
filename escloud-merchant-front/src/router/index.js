import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development env not use Lazy Loading,because Lazy Loading too many pages will cause webpack hot update too slow.so only in production use Lazy Loading

Vue.use(Router)

/* layout */
import Layout from '../views/plat/layout/Layout'
import AppMain from '../views/plat/layout/AppMain'
import { getToken } from '@/utils/auth'
/**
* icon : the icon show in the sidebar
* hidden : if `hidden:true` will not show in the sidebar
* redirect : if `redirect:noredirect` will no redirct in the levelbar
* noDropdown : if `noDropdown:true` will has no submenu
* meta : { role: ['admin'] }  will control the page role
**/
export const constantRouterMap = [
  { path: '/login', component: _import('plat/login/index'), meta: { requirToken: false, token: null }, hidden: true },
  { path: '/authredirect', component: _import('plat/login/authredirect'), meta: { requirToken: false, token: null }, hidden: true },
  { path: '/404', component: _import('plat/errorPage/404'), meta: { requirToken: false, token: null }, hidden: true },
  { path: '/401', component: _import('plat/errorPage/401'), meta: { requirToken: false, token: null }, hidden: true },
  { path: '/auth/userRegister', component: _import('merchant/auth/userRegister'), meta: { requirToken: false, token: null }, hidden: true },
  { path: '/auth/resetPassWord', component: _import('merchant/auth/resetPassWord'), meta: { requirToken: false, token: null }, hidden: true },
  { path: '/', component: Layout, redirect: '/dashboard', name: '首页', meta: { requirToken: false, token: null }, hidden: true,
    children: [{ path: 'dashboard', component: _import('plat/dashboard/index'), meta: { requirToken: false, token: null }}]
  }
]

export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

// export const asyncRouterMap = [
//   {
//     path: '/system',
//     component: Layout,
//     redirect: 'noredirect',
//     name: '系统管理',
//     icon: 'lock',
//     meta: { role: ['admin'] },
//     children: [
//       { path: 'role', component: _import('plat/system/role'), name: '角色管理', meta: { role: ['admin'] }},
//       { path: 'menu', component: _import('plat/system/menu'), name: '菜单管理', meta: { role: ['admin'] }},
//       { path: 'dict', component: _import('plat/system/dict'), name: '数据字典', meta: { role: ['admin'] }},
//       { path: 'user', component: _import('plat/system/user'), name: '用户管理', meta: { role: ['admin'] }},
//       { path: 'resource', component: _import('plat/system/sysResource'), name: '资源管理', meta: { role: ['admin'] }}
//     ]
//   }
// ]
export const asyncRouterMap = []
export function GenerateRouterMap(data) {
  if (typeof data !== undefined && data.error_no === 0) {
    const resultDataArr = data.result
    if (data.result.length !== 0) {
      resultDataArr.forEach(function(resultData, index) {
        // 循环添加APP的第一级
        const appRouterMap = {
          path: resultData.applicationUrl.indexOf('/') === 0 ? resultData.applicationUrl : '/' + resultData.applicationUrl,
          component: Layout,
          redirect: resultData.applicationUrl + '/index',
          name: resultData.applicationName,
          icon: resultData.menuIcon,
          meta: { requirToken: true, token: getToken() },
          children: [],
          code: resultData.applicationCode,
          applicationFilePath: resultData.applicationFilePath
        }
        asyncRouterMap.push(appRouterMap)
        if (resultData.menuList.length > 0) {
          resultData.menuList.forEach(function(menuData) {
            if (typeof menuData === 'string') {
              const menuStrJson = menuData.replace(/\[\"/g, '\[').replace(/\"\[/g, '\]')
              addRouterMap(JSON.parse(menuStrJson))
            } else {
              addRouterMap(menuData)
            }
          })
        }
      })
    }
    // 最后添加
    const routerMapNotFound = [{ path: '*', redirect: '/404', meta: { requirToken: false, token: null }, hidden: true }]
    return asyncRouterMap.concat(routerMapNotFound)
  }
}

function addRouterMap(menuData) {
  // 有子项，说明是父级
  if (menuData.menuList.length > 0) {
    try {
      const routerMenuMap = {
        path: menuData.menuUrl,
        component: AppMain,
        redirect: 'noredirect',
        name: menuData.menuName,
        icon: menuData.menuIcon,
        meta: { requirToken: true, token: getToken() },
        children: [],
        code: menuData.applicationCode,
        menuNo: menuData.menuNo,
        menuOrder: menuData.menuOrder,
        menuParentNo: menuData.menuParentNo
      }
      // 根据code找到所属APP，并添加进去
      asyncRouterMap.forEach(function(router) {
        if (router.code === menuData.applicationCode) {
          addParent(router, routerMenuMap)
        }
      })
      menuData.menuList.forEach(function(menuData) {
        addRouterMap(menuData)
      })
    } catch (e) {
      console.log('创建二级菜单错误', typeof e)
    }
  } else if (menuData.menuList.length === 0) {
    try {
      // 没有子项，说明已经是子
      const routerMapChildren = {
        path: menuData.menuUrl,
        component: _import(menuData.menuFilePath),
        name: menuData.menuName,
        meta: { requirToken: true, token: getToken() },
        desc: menuData.menuDesc,
        code: menuData.applicationCode,
        menuNo: menuData.menuNo,
        icon: menuData.menuIcon,
        menuParentNo: menuData.menuParentNo,
        menuOrder: menuData.menuOrder,
        children: []
      }
      // 根据code找到所属APP，所属的菜单
      asyncRouterMap.forEach(function(router) {
        if (router.code === menuData.applicationCode) {
          addParent(router, routerMapChildren)
        }
      })
    } catch (e) {
      console.log('创建三级菜单错误', e)
    }
  }
}

function addParent(routerNode, routerChild) {
  if (routerChild.menuParentNo === '') {
    routerNode.children.push(routerChild)
    return
  } else {
    if (routerNode.menuNo === routerChild.menuParentNo) {
      routerNode.children.push(routerChild)
      return
    } else {
      if (routerNode.children !== undefined) {
        routerNode.children.forEach(function(router) {
          addParent(router, routerChild)
        })
      }
    }
  }
}
