import { commonFetch } from '@/api/common'

export function queryMerchantAuthList(params) {
  return commonFetch({
    url: '/edenep/merchant/auth/merchantAuth/list',
    method: 'get',
    params: params
  })
}

export function updateDisable(params) {
  return commonFetch({
    url: '/edenep/merchant/auth/merchantAuth/disable',
    method: 'post',
    params: params
  })
}

export function updateEnable(params) {
  return commonFetch({
    url: '/edenep/merchant/auth/merchantAuth/enable',
    method: 'post',
    params: params
  })
}

export function authApproval(params) {
  return commonFetch({
    url: '/edenep/merchant/auth/merchantAuth/authApproval',
    method: 'post',
    params: params
  })
}

export function enableDisableBatch(params) {
  return commonFetch({
    url: '/edenep/merchant/auth/merchantAuth/enableDisableBatch',
    method: 'post',
    params: params
  })
}

export function queryMerchantAuth(params) {
  return commonFetch({
    url: '/edenep/merchant/auth/merchantAuth/queryMerchantAuth',
    method: 'post',
    params: params
  })
}

export function addMerchantAuth(params) {
  return commonFetch({
    url: '/edenep/merchant/auth/merchantAuth/add',
    method: 'post',
    params: params
  })
}

export function editMerchantAuth(params) {
  return commonFetch({
    url: '/edenep/merchant/auth/merchantAuth/edit',
    method: 'post',
    params: params
  })
}

export function queryAddress(params) {
  return commonFetch({
    url: '/edenep/plat/address/list',
    method: 'post',
    params: params
  })
}

export function editAddress(params) {
  return commonFetch({
    url: '/edenep/plat/address/edit',
    method: 'post',
    params: params
  })
}
