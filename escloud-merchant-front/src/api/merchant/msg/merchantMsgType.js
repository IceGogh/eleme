import { commonFetch } from '@/api/common'

export function getMerchantMsgTypeList(params) {
  return commonFetch({
    url: '/edenep/merchant/msg/merchantMsgType/list',
    method: 'get',
    params: params
  })
}

export function addMerchantMsgType(params) {
  return commonFetch({
    url: '/edenep/merchant/msg/merchantMsgType/add',
    method: 'post',
    params: params
  })
}

export function editMerchantMsgType(params) {
  return commonFetch({
    url: '/edenep/merchant/msg/merchantMsgType/edit',
    method: 'post',
    params: params
  })
}

export function delMerchantMsgType(params) {
  return commonFetch({
    url: '/edenep/merchant/msg/merchantMsgType/del',
    method: 'post',
    params: params
  })
}

export function delBatchMerchantMsgType(params) {
  return commonFetch({
    url: '/edenep/merchant/msg/merchantMsgType/del_batch',
    method: 'post',
    params: params
  })
}
