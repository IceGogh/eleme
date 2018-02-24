import { commonFetch } from '@/api/common'

export function getProjectList(params) {
  return commonFetch({
    url: '/edenep/merchant/project/projectManage/list',
    method: 'get',
    params: params
  })
}

export function addProject(params) {
  return commonFetch({
    url: '/edenep/merchant/project/projectManage/add',
    method: 'post',
    params: params
  })
}

export function delProject(params) {
  return commonFetch({
    url: '/edenep/merchant/project/projectManage/del',
    method: 'post',
    params: params
  })
}

export function delBatchProject(params) {
  return commonFetch({
    url: '/edenep/merchant/project/projectManage/delAll',
    method: 'post',
    params: params
  })
}

export function editProject(params) {
  return commonFetch({
    url: '/edenep/merchant/project/projectManage/edit',
    method: 'post',
    params: params
  })
}

export function getProjectAddressList(params) {
  return commonFetch({
    url: '/edenep/merchant/project/projectManage/addressList',
    method: 'get',
    params: params
  })
}

export function editAddress(params) {
  return commonFetch({
    url: '/edenep/merchant/project/projectManage/editAddress',
    method: 'post',
    params: params
  })
}

export function addAddress(params) {
  return commonFetch({
    url: '/edenep/merchant/project/projectManage/addAddress',
    method: 'post',
    params: params
  })
}

export function removeAddress(params) {
  return commonFetch({
    url: '/edenep/merchant/project/projectManage/delAddress',
    method: 'post',
    params: params
  })
}

export function getMerchantProjectAdminList(params) {
  return commonFetch({
    url: '/edenep/merchant/project/projectManage/merchantProjectAdminList',
    method: 'get',
    params: params
  })
}

export function getProjectByCode(params) {
  return commonFetch({
    url: '/edenep/merchant/project/projectManage/getByCode',
    method: 'get',
    params: params
  })
}

export function settingDSTWT(params) {
  return commonFetch({
    url: '/edenep/merchant/project/projectManage/settingDSTWT',
    method: 'post',
    params: params
  })
}

