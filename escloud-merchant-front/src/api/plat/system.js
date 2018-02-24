import { commonFetch } from '@/api/common'

export function loadMenuList(token) {
  return commonFetch({
    url: '/system/menuList',
    method: 'get',
    params: { token }
  })
}

export function getSysResourceList(query) {
  return commonFetch({
    url: '/system/sysResourceList',
    method: 'get',
    params: query
  })
}

export function getSysPrivilegeResList(query) {
  return commonFetch({
    url: '/edenep/plat/privilege/query_res',
    method: 'get',
    params: query
  })
}

export function getCheckedRes(query) {
  return commonFetch({
    url: '/edenep/plat/privilege/query_checked_res',
    method: 'get',
    params: query
  })
}

export function addPrivilege(params) {
  return commonFetch({
    url: '/edenep/plat/privilege/add',
    method: 'post',
    params: params
  })
}
