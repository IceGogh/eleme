import { commonFetch } from '@/api/common'

export function getMerchantPostList(params) {
  return commonFetch({
    url: '/edenep/merchant/work/merchantPost/list',
    method: 'get',
    params: params
  })
}

export function addMerchantPost(params) {
  return commonFetch({
    url: '/edenep/merchant/work/merchantPost/add',
    method: 'post',
    params: params
  })
}

export function editMerchantPost(params) {
  return commonFetch({
    url: '/edenep/merchant/work/merchantPost/edit',
    method: 'post',
    params: params
  })
}

export function delMerchantPost(params) {
  return commonFetch({
    url: '/edenep/merchant/work/merchantPost/del',
    method: 'post',
    params: params
  })
}

