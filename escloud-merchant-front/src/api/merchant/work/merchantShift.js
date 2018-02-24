import { commonFetch } from '@/api/common'

export function getMerchantShiftList(params) {
  return commonFetch({
    url: '/edenep/merchant/work/shift/list',
    method: 'get',
    params: params
  })
}

export function addMerchantShift(params) {
  return commonFetch({
    url: '/edenep/merchant/work/shift/add',
    method: 'post',
    params: params
  })
}

export function editMerchantShift(params) {
  return commonFetch({
    url: '/edenep/merchant/work/shift/edit',
    method: 'post',
    params: params
  })
}

export function delMerchantShift(params) {
  return commonFetch({
    url: '/edenep/merchant/work/shift/del',
    method: 'post',
    params: params
  })
}

export function delBatchMerchantShift(params) {
  return commonFetch({
    url: '/edenep/merchant/work/shift/delAll',
    method: 'post',
    params: params
  })
}
