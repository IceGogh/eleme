import { commonFetch } from '@/api/common'
export function getSysPrivilegeResList(query) {
  return commonFetch({
    url: '/edenep/merchant/work/privilege/res_list',
    method: 'get',
    params: query
  })
}
export function addPrivilege(params) {
  return commonFetch({
    url: '/edenep/merchant/work/privilege/add',
    method: 'post',
    params: params
  })
}
