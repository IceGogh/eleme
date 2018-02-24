import { commonFetch } from '@/api/common'

export function getMerchantMsgUsermessageList(params) {
  return commonFetch({
    url: '/edenep/merchant/msg/merchantMsgUsermessage/list',
    method: 'get',
    params: params
  })
}

export function addMerchantMsgUsermessage(params) {
  return commonFetch({
    url: '/edenep/merchant/msg/merchantMsgUsermessage/add',
    method: 'post',
    params: params
  })
}

export function editMerchantMsgUsermessage(params) {
  return commonFetch({
    url: '/edenep/merchant/msg/merchantMsgUsermessage/edit',
    method: 'post',
    params: params
  })
}

export function delMerchantMsgUsermessage(params) {
  return commonFetch({
    url: '/edenep/merchant/msg/merchantMsgUsermessage/del',
    method: 'post',
    params: params
  })
}

export function delBatchMerchantMsgUsermessage(params) {
  return commonFetch({
    url: '/edenep/merchant/msg/merchantMsgUsermessage/del_batch',
    method: 'post',
    params: params
  })
}
