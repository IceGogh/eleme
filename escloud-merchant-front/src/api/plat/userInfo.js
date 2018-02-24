import { commonFetch } from '@/api/common'

export function getUserInfo(params) {
  return commonFetch({
    url: '/edenep/plat/user/get',
    method: 'get',
    params: params
  })
}

export function getUserInfoList(params) {
  return commonFetch({
    url: '/edenep/plat/user/list',
    method: 'get',
    params: params
  })
}

export function addUserInfo(params) {
  return commonFetch({
    url: '/edenep/plat/user/add',
    method: 'post',
    params: params
  })
}

export function editUserInfo(params) {
  return commonFetch({
    url: '/edenep/plat/user/edit',
    method: 'post',
    params: params
  })
}

export function delUserInfo(params) {
  return commonFetch({
    url: '/edenep/plat/user/del',
    method: 'post',
    params: params
  })
}

export function delBatchUserInfo(params) {
  return commonFetch({
    url: '/edenep/plat/user/del_batch',
    method: 'post',
    params: params
  })
}
