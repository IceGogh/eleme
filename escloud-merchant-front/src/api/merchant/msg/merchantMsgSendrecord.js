import { commonFetch } from '@/api/common'

export function getMerchantMsgSendrecordList(params) {
  return commonFetch({
    url: '/edenep/merchant/msg/merchantMsgSendrecord/list',
    method: 'get',
    params: params
  })
}

export function addMerchantMsgSendrecord(params) {
  return commonFetch({
    url: '/edenep/merchant/msg/merchantMsgSendrecord/add',
    method: 'post',
    params: params
  })
}

export function editMerchantMsgSendrecord(params) {
  return commonFetch({
    url: '/edenep/merchant/msg/merchantMsgSendrecord/edit',
    method: 'post',
    params: params
  })
}

export function delMerchantMsgSendrecord(params) {
  return commonFetch({
    url: '/edenep/merchant/msg/merchantMsgSendrecord/del',
    method: 'post',
    params: params
  })
}

export function delBatchMerchantMsgSendrecord(params) {
  return commonFetch({
    url: '/edenep/merchant/msg/merchantMsgSendrecord/del_batch',
    method: 'post',
    params: params
  })
}
