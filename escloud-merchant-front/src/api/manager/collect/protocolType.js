import { commonFetch } from '@/api/common'

export function getProtocolTypeList(params) {
  return commonFetch({
    url: '/edenep/manager/collect/protocolType/list',
    method: 'get',
    params: params
  })
}

export function addProtocolType(params) {
  return commonFetch({
    url: '/edenep/manager/collect/protocolType/add',
    method: 'post',
    params: params
  })
}

export function editProtocolType(params) {
  return commonFetch({
    url: '/edenep/manager/collect/protocolType/edit',
    method: 'post',
    params: params
  })
}

export function delProtocolType(params) {
  return commonFetch({
    url: '/edenep/manager/collect/protocolType/del',
    method: 'post',
    params: params
  })
}

export function delBatchProtocolType(params) {
  return commonFetch({
    url: '/edenep/manager/collect/protocolType/delAll',
    method: 'post',
    params: params
  })
}

export function synAll(params) {
  return commonFetch({
    url: '/edenep/manager/collect/protocolType/synAll',
    method: 'post',
    params: params
  })
}
export function syn(params) {
  return commonFetch({
    url: '/edenep/manager/collect/protocolType/syn',
    method: 'post',
    params: params
  })
}
