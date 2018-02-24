import { commonFetch } from '@/api/common'

export function getEquipmentMfrsList(params) {
  return commonFetch({
    url: '/edenep/manager/collect/equipmentMfrs/list',
    method: 'get',
    params: params
  })
}

export function addEquipmentMfrs(params) {
  return commonFetch({
    url: '/edenep/manager/collect/equipmentMfrs/add',
    method: 'post',
    params: params
  })
}

export function editEquipmentMfrs(params) {
  return commonFetch({
    url: '/edenep/manager/collect/equipmentMfrs/edit',
    method: 'post',
    params: params
  })
}

export function delEquipmentMfrs(params) {
  return commonFetch({
    url: '/edenep/manager/collect/equipmentMfrs/del',
    method: 'post',
    params: params
  })
}

export function delBatchEquipmentMfrs(params) {
  return commonFetch({
    url: '/edenep/manager/collect/equipmentMfrs/delAll',
    method: 'post',
    params: params
  })
}

export function searchEquipmentMfrs(params) {
  return commonFetch({
    url: '/edenep/manager/collect/equipmentMfrs/search',
    method: 'get',
    params: params
  })
}
