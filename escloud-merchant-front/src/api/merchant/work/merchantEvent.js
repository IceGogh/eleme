import { commonFetch } from '@/api/common'

export function getMerchantEventList(params) {
  return commonFetch({
    url: '/edenep/merchant/work/merchantEvent/list',
    method: 'get',
    params: params
  })
}

export function addMerchantEvent(params) {
  return commonFetch({
    url: '/edenep/merchant/work/merchantEvent/add',
    method: 'post',
    params: params
  })
}

export function editMerchantEvent(params) {
  return commonFetch({
    url: '/edenep/merchant/work/merchantEvent/edit',
    method: 'post',
    params: params
  })
}

export function delMerchantEvent(params) {
  return commonFetch({
    url: '/edenep/merchant/work/merchantEvent/del',
    method: 'post',
    params: params
  })
}

export function delBatchMerchantEvent(params) {
  return commonFetch({
    url: '/edenep/merchant/work/merchantEvent/del_batch',
    method: 'post',
    params: params
  })
}

export function getMerchantEventTypeList(params) {
  return commonFetch({
    url: '/edenep/merchant/work/merchantEventType/list',
    method: 'get',
    params: params
  })
}

export function addMerchantEventType(params) {
  return commonFetch({
    url: '/edenep/merchant/work/merchantEventType/add',
    method: 'post',
    params: params
  })
}

export function editMerchantEventType(params) {
  return commonFetch({
    url: '/edenep/merchant/work/merchantEventType/edit',
    method: 'post',
    params: params
  })
}

export function delMerchantEventType(params) {
  return commonFetch({
    url: '/edenep/merchant/work/merchantEventType/del',
    method: 'post',
    params: params
  })
}

export function delBatchMerchantEventType(params) {
  return commonFetch({
    url: '/edenep/merchant/work/merchantEventType/del_batch',
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

export function assignmentPerson(params) {
  return commonFetch({
    url: '/edenep/merchant/work/merchantEvent/assignmentPerson',
    method: 'post',
    params: params
  })
}

export function rebut(params) {
  return commonFetch({
    url: '/edenep/merchant/work/merchantEvent/rebut',
    method: 'post',
    params: params
  })
}
