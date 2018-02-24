import { commonFetch } from '@/api/common'

export function getButtonList(params) {
  return commonFetch({
    url: '/edenep/plat/button/list',
    method: 'get',
    params: params
  })
}

export function addButton(params) {
  return commonFetch({
    url: '/edenep/plat/button/add',
    method: 'post',
    params: params
  })
}

export function editButton(params) {
  return commonFetch({
    url: '/edenep/plat/button/edit',
    method: 'post',
    params: params
  })
}

export function delButton(params) {
  return commonFetch({
    url: '/edenep/plat/button/del',
    method: 'post',
    params: params
  })
}

export function delAllButton(params) {
  return commonFetch({
    url: '/edenep/plat/button/del_batch',
    method: 'post',
    params: params
  })
}
