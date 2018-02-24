import { commonFetch } from '@/api/common'

export function queryPhoneNumberRepeat(params) {
  return commonFetch({
    url: '/edenep/merchant/auth/userregister/queryPhoneNumberRepeat',
    method: 'get',
    params: params
  })
}

export function addUserRegister(params) {
  return commonFetch({
    url: '/edenep/merchant/auth/userregister/add',
    method: 'post',
    params: params
  })
}

export function sendSms(params) {
  return commonFetch({
    url: '/edenep/merchant/auth/userregister/sendSms',
    method: 'post',
    params: params
  })
}
