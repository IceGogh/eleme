import { commonFetch } from '@/api/common'

export function getChildAdminList(params) {
  return commonFetch({
    url: '/edenep/merchant/auth/childAdminManage/list',
    method: 'get',
    params: params
  })
}

export function addChildAdmin(params) {
  return commonFetch({
    url: '/edenep/merchant/auth/childAdminManage/add',
    method: 'post',
    params: params
  })
}

export function editChildAdmin(params) {
  return commonFetch({
    url: '/edenep/merchant/auth/childAdminManage/edit',
    method: 'post',
    params: params
  })
}

export function deleteChildAdmin(params) {
  return commonFetch({
    url: '/edenep/merchant/auth/childAdminManage/del',
    method: 'post',
    params: params
  })
}

export function deleteBatchChildAdmin(params) {
  return commonFetch({
    url: '/edenep/merchant/auth/childAdminManage/delAll',
    method: 'post',
    params: params
  })
}

