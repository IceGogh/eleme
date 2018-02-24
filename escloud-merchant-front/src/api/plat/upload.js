import fetch from '@/utils/fetch'

export function uploadImage(params) {
  return fetch({
    url: '/edenep/plat/button/add',
    method: 'post',
    data: params
  })
}
