import { commonFetch } from '@/api/common'

export function getRoleList(params) {
  return commonFetch({
    url: '/edenep/plat/role/list',
    method: 'get',
    params: params
  })
}

export function getRoleTree(query) {
  return commonFetch({
    url: '/edenep/plat/role/list_all',
    method: 'get',
    params: query
  })
}

export function addRole(params) {
  return commonFetch({
    url: '/edenep/plat/role/add',
    method: 'post',
    params: params
  })
}

export function editRole(params) {
  return commonFetch({
    url: '/edenep/plat/role/edit',
    method: 'post',
    params: params
  })
}

export function delRole(params) {
  return commonFetch({
    url: '/edenep/plat/role/del',
    method: 'post',
    params: params
  })
}

export function delBatchRole(params) {
  return commonFetch({
    url: '/edenep/plat/role/del_batch',
    method: 'post',
    params: params
  })
}

export function getRoleExcludeUserList(params) {
  return commonFetch({
    url: '/edenep/plat/role/list_user_exclude',
    method: 'get',
    params: params
  })
}

export function getRoleUserList(params) {
  return commonFetch({
    url: '/edenep/plat/role/list_user',
    method: 'get',
    params: params
  })
}

export function addUserToRole(params) {
  return commonFetch({
    url: '/edenep/plat/role/add_user',
    method: 'post',
    params: params
  })
}

export function delUserFromRole(params) {
  return commonFetch({
    url: '/edenep/plat/role/del_user',
    method: 'post',
    params: params
  })
}

export function delBatchUserFromRole(params) {
  return commonFetch({
    url: '/edenep/plat/role/del_batch_user',
    method: 'post',
    params: params
  })
}
