import { commonFetch } from '@/api/common'

export function getMerchantPersonAlarmList(params) {
  return commonFetch({
    url: '/edenep/merchant/work/merchantAlarm/personAlarmList',
    method: 'get',
    params: params
  })
}

export function getMerchantVehicleAlarmList(params) {
  return commonFetch({
    url: '/edenep/merchant/work/merchantAlarm/vehicleAlarmList',
    method: 'get',
    params: params
  })
}

export function getMerchantEquipmentAlarmList(params) {
  return commonFetch({
    url: '/edenep/merchant/work/merchantAlarm/equipmentAlarmList',
    method: 'get',
    params: params
  })
}
