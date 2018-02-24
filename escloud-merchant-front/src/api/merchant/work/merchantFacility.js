import { commonFetch } from '@/api/common'

export function getMerchantFacilityList(params) {
  return commonFetch({
    url: '/edenep/merchant/work/facility/list',
    method: 'get',
    params: params
  })
}

export function addMerchantFacility(params) {
  return commonFetch({
    url: '/edenep/merchant/work/facility/add',
    method: 'post',
    params: params
  })
}

export function editMerchantFacility(params) {
  return commonFetch({
    url: '/edenep/merchant/work/facility/edit',
    method: 'post',
    params: params
  })
}

export function delMerchantFacility(params) {
  return commonFetch({
    url: '/edenep/merchant/work/facility/del',
    method: 'post',
    params: params
  })
}

export function delBatchMerchantFacility(params) {
  return commonFetch({
    url: '/edenep/merchant/work/facility/delAll',
    method: 'post',
    params: params
  })
}

export function searchEmployee(params) {
  return commonFetch({
    url: '/edenep/merchant/work/merchantEmployee/search',
    method: 'get',
    params: params
  })
}

