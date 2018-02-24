import { commonFetch } from '@/api/common'

export function getMenuList(params) {
  return commonFetch({
    url: '/edenep/plat/menu/list',
    method: 'get',
    params: params
  })
}

export function addMenu(params) {
  return commonFetch({
    url: '/edenep/plat/menu/add',
    method: 'post',
    params: params
  })
}

export function editMenu(params) {
  return commonFetch({
    url: '/edenep/plat/menu/edit',
    method: 'post',
    params: params
  })
}

export function delMenu(params) {
  return commonFetch({
    url: '/edenep/plat/menu/del',
    method: 'post',
    params: params
  })
}

export function delBatchMenu(params) {
  return commonFetch({
    url: '/edenep/plat/menu/del_batch',
    method: 'post',
    params: params
  })
}

export function getMenuTree(params) {
  return commonFetch({
    url: '/edenep/plat/menu/list_tree',
    method: 'post',
    params: params
  })
}
