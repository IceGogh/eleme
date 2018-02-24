import { commonFetch } from '@/api/common'

export function getMqErrorList(params) {
  return commonFetch({
    url: '/edenep/plat/mqError/list',
    method: 'get',
    params: params
  })
}

export function addMqError(params) {
  return commonFetch({
    url: '/edenep/plat/mqError/add',
    method: 'post',
    params: params
  })
}

export function editMqError(params) {
  return commonFetch({
    url: '/edenep/plat/mqError/edit',
    method: 'post',
    params: params
  })
}

export function delMqError(params) {
  return commonFetch({
    url: '/edenep/plat/mqError/del',
    method: 'post',
    params: params
  })
}

export function delBatchMqError(params) {
  return commonFetch({
    url: '/edenep/plat/mqError/del_batch',
    method: 'post',
    params: params
  })
}
