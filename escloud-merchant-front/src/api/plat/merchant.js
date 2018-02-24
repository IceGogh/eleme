import { commonFetch } from '@/api/common'

export function getMerchantList(params) {
  return commonFetch({
    url: '/edenep/plat/merchant/list',
    method: 'get',
    params: params
  })
}

export function addMerchant(params) {
  return commonFetch({
    url: '/edenep/plat/merchant/add',
    method: 'post',
    params: params
  })
}

export function editMerchant(params) {
  return commonFetch({
    url: '/edenep/plat/merchant/edit',
    method: 'post',
    params: params
  })
}

export function delMerchant(params) {
  return commonFetch({
    url: '/edenep/plat/merchant/del',
    method: 'post',
    params: params
  })
}

export function delBatchMerchant(params) {
  return commonFetch({
    url: '/edenep/plat/merchant/del_batch',
    method: 'post',
    params: params
  })
}
export function queryNameIdDic(params) {
  return commonFetch({
    url: '/edenep/plat/merchant/name_id_dic',
    method: 'post',
    params: params
  })
}
