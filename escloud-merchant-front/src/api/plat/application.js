import { commonFetch } from '@/api/common'

export function getApplicationList(params) {
  return commonFetch({
    url: '/edenep/plat/app/list',
    method: 'get',
    params: params
  })
}

export function addApplication(params) {
  return commonFetch({
    url: '/edenep/plat/app/add',
    method: 'post',
    params: params
  })
}

export function editApplication(params) {
  return commonFetch({
    url: '/edenep/plat/app/edit',
    method: 'post',
    params: params
  })
}

export function delApplication(params) {
  return commonFetch({
    url: '/edenep/plat/app/del',
    method: 'post',
    params: params
  })
}

export function delBatchApplication(params) {
  return commonFetch({
    url: '/edenep/plat/app/del_batch',
    method: 'post',
    params: params
  })
}

export function queryFreeModel(params) {
  return commonFetch({
    url: '/edenep/plat/menu/free_model',
    method: 'get',
    params: params
  })
}

export function updateChildModel(params) {
  return commonFetch({
    url: '/edenep/plat/menu/update_model',
    method: 'post',
    params: params
  })
}
export function synAllApplication(params) {
  return commonFetch({
    url: '/edenep/plat/app/synAll',
    method: 'post',
    params: params
  })
}
