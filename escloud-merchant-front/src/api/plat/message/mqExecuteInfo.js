import { commonFetch } from '@/api/common'

export function getMqExecuteInfoList(params) {
  return commonFetch({
    url: '/edenep/plat/mqExecuteInfo/list',
    method: 'get',
    params: params
  })
}

export function addMqExecuteInfo(params) {
  return commonFetch({
    url: '/edenep/plat/mqExecuteInfo/add',
    method: 'post',
    params: params
  })
}

export function editMqExecuteInfo(params) {
  return commonFetch({
    url: '/edenep/plat/mqExecuteInfo/edit',
    method: 'post',
    params: params
  })
}

export function delMqExecuteInfo(params) {
  return commonFetch({
    url: '/edenep/plat/mqExecuteInfo/del',
    method: 'post',
    params: params
  })
}

export function delBatchMqExecuteInfo(params) {
  return commonFetch({
    url: '/edenep/plat/mqExecuteInfo/del_batch',
    method: 'post',
    params: params
  })
}
