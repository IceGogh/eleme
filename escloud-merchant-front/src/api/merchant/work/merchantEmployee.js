import { commonFetch } from '@/api/common'

export function getMerchantEmployeeList(params) {
  return commonFetch({
    url: '/edenep/merchant/work/merchantEmployee/list',
    method: 'get',
    params: params
  })
}

export function addEmployee(params) {
  return commonFetch({
    url: '/edenep/merchant/work/merchantEmployee/add',
    method: 'post',
    params: params
  })
}

export function editEmployee(params) {
  return commonFetch({
    url: '/edenep/merchant/work/merchantEmployee/edit',
    method: 'post',
    params: params
  })
}

export function getMerchantPostList(params) {
  return commonFetch({
    url: '/edenep/merchant/work/merchantPost/queryMerchantPostListByProject',
    method: 'post',
    params: params
  })
}

export function queryEquipmentList(params) {
  return commonFetch({
    url: '/edenep/merchant/work/equipment/queryEquipmentList',
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

export function searchEmployeeById(params) {
  return commonFetch({
    url: '/edenep/merchant/work/merchantEmployee/searchEmployeeById',
    method: 'get',
    params: params
  })
}
