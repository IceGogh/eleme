import { commonFetch } from '@/api/common'

export function getMerchantMsgTypeGroupList(params) {
  return commonFetch({
    url: '/edenep/merchant/msg/merchantMsgTypeGroup/list',
    method: 'get',
    params: params
  })
}

export function addMerchantMsgTypeGroup(params) {
  return commonFetch({
    url: '/edenep/merchant/msg/merchantMsgTypeGroup/add',
    method: 'post',
    params: params
  })
}

export function editMerchantMsgTypeGroup(params) {
  return commonFetch({
    url: '/edenep/merchant/msg/merchantMsgTypeGroup/edit',
    method: 'post',
    params: params
  })
}

export function delMerchantMsgTypeGroup(params) {
  return commonFetch({
    url: '/edenep/merchant/msg/merchantMsgTypeGroup/del',
    method: 'post',
    params: params
  })
}

export function delBatchMerchantMsgTypeGroup(params) {
  return commonFetch({
    url: '/edenep/merchant/msg/merchantMsgTypeGroup/del_batch',
    method: 'post',
    params: params
  })
}
