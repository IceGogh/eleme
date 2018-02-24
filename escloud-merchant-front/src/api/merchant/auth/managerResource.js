import { commonFetch } from '@/api/common'

export function getManagerResourceList(params) {
  return commonFetch({
    url: '/edenep/merchant/auth/managerResource/list',
    method: 'get',
    params: params
  })
}

export function addManagerResource(params) {
  return commonFetch({
    url: '/edenep/merchant/auth/managerResource/add',
    method: 'post',
    params: params
  })
}

export function editManagerResource(params) {
  return commonFetch({
    url: '/edenep/merchant/auth/managerResource/edit',
    method: 'post',
    params: params
  })
}

export function delManagerResource(params) {
  return commonFetch({
    url: '/edenep/merchant/auth/managerResource/del',
    method: 'post',
    params: params
  })
}

export function delBatchManagerResource(params) {
  return commonFetch({
    url: '/edenep/merchant/auth/managerResource/delAll',
    method: 'post',
    params: params
  })
}

export function getMerchantResourceRelation(params) {
  return commonFetch({
    url: '/edenep/merchant/auth/managerResource/getMerchantResourceRelation',
    method: 'get',
    params: params
  })
}

export function queryManagerResourceListByProjectCode(params) {
  return commonFetch({
    url: '/edenep/merchant/auth/managerResource/queryManagerResourceListByProjectCode',
    method: 'get',
    params: params
  })
}
