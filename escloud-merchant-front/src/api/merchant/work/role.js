import { commonFetch } from '@/api/common'

export function getAllRoleList(query) {
  return commonFetch({
    url: '/edenep/merchant/work/privilege/role_list',
    method: 'get',
    params: query
  })
}
export function getRoleList(params) {
  return commonFetch({
    url: '/edenep/merchant/work/role/list',
    method: 'get',
    params: params
  })
}
export function addRole(params) {
  return commonFetch({
    url: '/edenep/merchant/work/role/add',
    method: 'post',
    params: params
  })
}
export function editRole(params) {
  return commonFetch({
    url: '/edenep/merchant/work/role/edit',
    method: 'post',
    params: params
  })
}
export function delRole(params) {
  return commonFetch({
    url: '/edenep/merchant/work/role/del',
    method: 'post',
    params: params
  })
}

