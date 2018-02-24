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
    url: '/edenep/merchant/auth/merchantUser/list',
    method: 'get',
    params: params
  })
}

export function addUserInfo(params) {
  return commonFetch({
    url: '/edenep/merchant/auth/merchantUser/add',
    method: 'post',
    params: params
  })
}

export function editUserInfo(params) {
  return commonFetch({
    url: '/edenep/merchant/auth/merchantUser/edit',
    method: 'post',
    params: params
  })
}

export function delUserInfo(params) {
  return commonFetch({
    url: '/edenep/merchant/auth/merchantUser/del',
    method: 'post',
    params: params
  })
}
