import { commonFetch } from '@/api/common'

export function getGroupTree(query) {
  return commonFetch({
    url: '/edenep/plat/group/list_all',
    method: 'get',
    params: query
  })
}

export function getGroupList(params) {
  return commonFetch({
    url: '/edenep/plat/group/list',
    method: 'get',
    params: params
  })
}

export function addGroup(params) {
  return commonFetch({
    url: '/edenep/plat/group/add',
    method: 'post',
    params: params
  })
}

export function editGroup(params) {
  return commonFetch({
    url: '/edenep/plat/group/edit',
    method: 'post',
    params: params
  })
}

export function delGroup(params) {
  return commonFetch({
    url: '/edenep/plat/group/del',
    method: 'post',
    params: params
  })
}

export function delBatchGroup(params) {
  return commonFetch({
    url: '/edenep/plat/group/del_batch',
    method: 'post',
    params: params
  })
}

export function getGroupUserList(params) {
  return commonFetch({
    url: '/edenep/plat/group/list_user',
    method: 'get',
    params: params
  })
}

export function getGroupExcludeUserList(params) {
  return commonFetch({
    url: '/edenep/plat/group/list_user_exclude',
    method: 'get',
    params: params
  })
}

export function addUserToGroup(params) {
  return commonFetch({
    url: '/edenep/plat/group/add_user',
    method: 'post',
    params: params
  })
}

export function delUserFromGroup(params) {
  return commonFetch({
    url: '/edenep/plat/group/del_user',
    method: 'post',
    params: params
  })
}

export function delBatchUserFromGroup(params) {
  return commonFetch({
    url: '/edenep/plat/group/del_batch_user',
    method: 'post',
    params: params
  })
}
