import { commonFetch } from '@/api/common'

export function getEquipmentModelList(params) {
  return commonFetch({
    url: '/edenep/manager/collect/equipmentModel/list',
    method: 'get',
    params: params
  })
}

export function addEquipmentModel(params) {
  return commonFetch({
    url: '/edenep/manager/collect/equipmentModel/add',
    method: 'post',
    params: params
  })
}

export function editEquipmentModel(params) {
  return commonFetch({
    url: '/edenep/manager/collect/equipmentModel/edit',
    method: 'post',
    params: params
  })
}

export function delEquipmentModel(params) {
  return commonFetch({
    url: '/edenep/manager/collect/equipmentModel/del',
    method: 'post',
    params: params
  })
}

export function delBatchEquipmentModel(params) {
  return commonFetch({
    url: '/edenep/manager/collect/equipmentModel/delAll',
    method: 'post',
    params: params
  })
}

export function searchEquipmentModels(params) {
  return commonFetch({
    url: '/edenep/manager/collect/equipmentModel/search',
    method: 'get',
    params: params
  })
}
