import { commonFetch } from '@/api/common'

export function getVehicleModelList(params) {
  return commonFetch({
    url: '/edenep/manager/collect/vehicleModel/list',
    method: 'get',
    params: params
  })
}

export function addVehicleModel(params) {
  return commonFetch({
    url: '/edenep/manager/collect/vehicleModel/add',
    method: 'post',
    params: params
  })
}

export function editVehicleModel(params) {
  return commonFetch({
    url: '/edenep/manager/collect/vehicleModel/edit',
    method: 'post',
    params: params
  })
}

export function delVehicleModel(params) {
  return commonFetch({
    url: '/edenep/manager/collect/vehicleModel/del',
    method: 'post',
    params: params
  })
}

export function delBatchVehicleModel(params) {
  return commonFetch({
    url: '/edenep/manager/collect/vehicleModel/delAll',
    method: 'post',
    params: params
  })
}
