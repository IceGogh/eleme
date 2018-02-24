import { commonFetch } from '@/api/common'

export function getMerchantVehicleList(params) {
  return commonFetch({
    url: '/edenep/merchant/work/vehicle/list',
    method: 'get',
    params: params
  })
}

export function addMerchantVehicle(params) {
  return commonFetch({
    url: '/edenep/merchant/work/vehicle/add',
    method: 'post',
    params: params
  })
}

export function editMerchantVehicle(params) {
  return commonFetch({
    url: '/edenep/merchant/work/vehicle/edit',
    method: 'post',
    params: params
  })
}

export function delMerchantVehicle(params) {
  return commonFetch({
    url: '/edenep/merchant/work/vehicle/del',
    method: 'post',
    params: params
  })
}

export function delBatchMerchantVehicle(params) {
  return commonFetch({
    url: '/edenep/merchant/work/vehicle/delAll',
    method: 'post',
    params: params
  })
}
