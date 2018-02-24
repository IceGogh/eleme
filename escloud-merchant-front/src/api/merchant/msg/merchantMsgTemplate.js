import { commonFetch } from '@/api/common'

export function getMerchantMsgTemplateList(params) {
  return commonFetch({
    url: '/edenep/merchant/msg/merchantMsgTemplate/list',
    method: 'get',
    params: params
  })
}

export function addMerchantMsgTemplate(params) {
  return commonFetch({
    url: '/edenep/merchant/msg/merchantMsgTemplate/add',
    method: 'post',
    params: params
  })
}

export function editMerchantMsgTemplate(params) {
  return commonFetch({
    url: '/edenep/merchant/msg/merchantMsgTemplate/edit',
    method: 'post',
    params: params
  })
}

export function delMerchantMsgTemplate(params) {
  return commonFetch({
    url: '/edenep/merchant/msg/merchantMsgTemplate/del',
    method: 'post',
    params: params
  })
}

export function delBatchMerchantMsgTemplate(params) {
  return commonFetch({
    url: '/edenep/merchant/msg/merchantMsgTemplate/del_batch',
    method: 'post',
    params: params
  })
}
