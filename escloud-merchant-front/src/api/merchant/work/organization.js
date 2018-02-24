import { commonFetch } from '@/api/common'

export function getOrganizationList(params) {
  return commonFetch({
    url: '/edenep/merchant/work/organization/list',
    method: 'get',
    params: params
  })
}

export function addOrganization(params) {
  return commonFetch({
    url: '/edenep/merchant/work/organization/add',
    method: 'post',
    params: params
  })
}

export function editOrganization(params) {
  return commonFetch({
    url: '/edenep/merchant/work/organization/edit',
    method: 'post',
    params: params
  })
}

export function delOrganization(params) {
  return commonFetch({
    url: '/edenep/merchant/work/organization/del',
    method: 'post',
    params: params
  })
}

export function delBatchOrganization(params) {
  return commonFetch({
    url: '/edenep/merchant/work/organization/del_batch',
    method: 'post',
    params: params
  })
}

export function searchOrganizationList(params) {
  return commonFetch({
    url: '/edenep/merchant/work/organization/search',
    method: 'get',
    params: params
  })
}

export function quryOrganizationListTree(params) {
  return commonFetch({
    url: '/edenep/merchant/work/organization/list_organizaTionTree',
    method: 'get',
    params: params
  })
}

export function quryOrganizaTionCode(params) {
  return commonFetch({
    url: '/edenep/merchant/work/organization/list_organizaTion_code',
    method: 'get',
    params: params
  })
}
