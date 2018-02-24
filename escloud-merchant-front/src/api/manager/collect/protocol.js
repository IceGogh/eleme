import { commonFetch } from '@/api/common'

export function getProtocolList(params) {
  return commonFetch({
    url: '/edenep/manager/collect/protocol/list',
    method: 'get',
    params: params
  })
}

export function addProtocol(params) {
  return commonFetch({
    url: '/edenep/manager/collect/protocol/add',
    method: 'post',
    params: params
  })
}

export function editProtocol(params) {
  return commonFetch({
    url: '/edenep/manager/collect/protocol/edit',
    method: 'post',
    params: params
  })
}

export function delProtocol(params) {
  return commonFetch({
    url: '/edenep/manager/collect/protocol/del',
    method: 'post',
    params: params
  })
}

export function delBatchProtocol(params) {
  return commonFetch({
    url: '/edenep/manager/collect/protocol/delAll',
    method: 'post',
    params: params
  })
}

export function queryNameIdDic() {
  return commonFetch({
    url: '/edenep/manager/collect/protocolType/nameIdDic',
    method: 'post',
    params: {}
  })
}

export function synAll(params) {
  return commonFetch({
    url: '/edenep/manager/collect/protocol/synAll',
    method: 'post',
    params: params
  })
}
export function syn(params) {
  return commonFetch({
    url: '/edenep/manager/collect/protocol/syn',
    method: 'post',
    params: params
  })
}
