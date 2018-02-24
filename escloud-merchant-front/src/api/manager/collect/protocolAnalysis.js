import { commonFetch } from '@/api/common'

export function getProtocolAnalysisList(params) {
  return commonFetch({
    url: '/edenep/manager/collect/protocolAnalysis/list',
    method: 'get',
    params: params
  })
}

export function addProtocolAnalysis(params) {
  return commonFetch({
    url: '/edenep/manager/collect/protocolAnalysis/add',
    method: 'post',
    params: params
  })
}

export function editProtocolAnalysis(params) {
  return commonFetch({
    url: '/edenep/manager/collect/protocolAnalysis/edit',
    method: 'post',
    params: params
  })
}

export function delProtocolAnalysis(params) {
  return commonFetch({
    url: '/edenep/manager/collect/protocolAnalysis/del',
    method: 'post',
    params: params
  })
}

export function delBatchProtocolAnalysis(params) {
  return commonFetch({
    url: '/edenep/manager/collect/protocolAnalysis/delAll',
    method: 'post',
    params: params
  })
}

export function queryNameIdDic() {
  return commonFetch({
    url: '/edenep/manager/collect/protocol/nameIdDic',
    method: 'post',
    params: {}
  })
}
