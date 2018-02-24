import { commonFetch } from '@/api/common'

export function getEquipmentList(params) {
  return commonFetch({
    url: '/edenep/merchant/work/equipment/list',
    method: 'get',
    params: params
  })
}

export function addEquipment(params) {
  return commonFetch({
    url: '/edenep/merchant/work/equipment/add',
    method: 'post',
    params: params
  })
}

export function editEquipment(params) {
  return commonFetch({
    url: '/edenep/merchant/work/equipment/edit',
    method: 'post',
    params: params
  })
}

export function delEquipment(params) {
  return commonFetch({
    url: '/edenep/merchant/work/equipment/del',
    method: 'post',
    params: params
  })
}

export function delBatchEquipment(params) {
  return commonFetch({
    url: '/edenep/merchant/work/equipment/delAll',
    method: 'post',
    params: params
  })
}
