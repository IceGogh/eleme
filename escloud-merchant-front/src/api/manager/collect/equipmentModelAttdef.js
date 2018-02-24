import { commonFetch } from '@/api/common'

export function getEquipmentModelAttdefList(params) {
  return commonFetch({
    url: '/edenep/manager/collect/equipmentModel/attDefList',
    method: 'get',
    params: params
  })
}

export function addEquipmentModelAttdef(params) {
  return commonFetch({
    url: '/edenep/manager/collect/equipmentModel/addAttdef',
    method: 'post',
    params: params
  })
}

export function editEquipmentModelAttdef(params) {
  return commonFetch({
    url: '/edenep/manager/collect/equipmentModel/editAttdef',
    method: 'post',
    params: params
  })
}

export function removeEquipmentModelAttdef(params) {
  return commonFetch({
    url: '/edenep/manager/collect/equipmentModel/removeAttdef',
    method: 'post',
    params: params
  })
}
