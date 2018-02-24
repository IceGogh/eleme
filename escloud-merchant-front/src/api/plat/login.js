import { commonFetch } from '@/api/common'

export function loginByAccount(params) {
  return commonFetch({
    url: '/edenep/plat/user/login',
    method: 'post',
    params
  })
}

export function logout(params) {
  return commonFetch({
    url: '/edenep/plat/user/logout',
    method: 'post',
    params
  })
}

export function queryAppsMenuList(params) {
  return commonFetch({
    url: '/edenep/plat/privilege/list_apps_menus',
    method: 'get',
    params
  })
}
