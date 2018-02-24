import { commonFetch } from '@/api/common'

export function getMerchantMsgSubscribeList(params) {
  return commonFetch({
    url: '/edenep/merchant/msg/merchantMsgSubscribe/list',
    method: 'get',
    params: params
  })
}

export function addMerchantMsgSubscribe(params) {
  return commonFetch({
    url: '/edenep/merchant/msg/merchantMsgSubscribe/add',
    method: 'post',
    params: params
  })
}

export function editMerchantMsgSubscribe(params) {
  return commonFetch({
    url: '/edenep/merchant/msg/merchantMsgSubscribe/edit',
    method: 'post',
    params: params
  })
}

export function delMerchantMsgSubscribe(params) {
  return commonFetch({
    url: '/edenep/merchant/msg/merchantMsgSubscribe/del',
    method: 'post',
    params: params
  })
}

export function delBatchMerchantMsgSubscribe(params) {
  return commonFetch({
    url: '/edenep/merchant/msg/merchantMsgSubscribe/del_batch',
    method: 'post',
    params: params
  })
}
