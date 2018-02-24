import { commonFetch } from '@/api/common'

export function getMerchantAttendanceGroupList(params) {
  return commonFetch({
    url: '/edenep/merchant/work/attendanceGroup/list',
    method: 'get',
    params: params
  })
}

export function addMerchantAttendanceGroup(params) {
  return commonFetch({
    url: '/edenep/merchant/work/attendanceGroup/add',
    method: 'post',
    params: params
  })
}

export function editMerchantAttendanceGroup(params) {
  return commonFetch({
    url: '/edenep/merchant/work/attendanceGroup/edit',
    method: 'post',
    params: params
  })
}

export function delMerchantAttendanceGroup(params) {
  return commonFetch({
    url: '/edenep/merchant/work/attendanceGroup/del',
    method: 'post',
    params: params
  })
}

/**
 * 搜索员工，排除掉已排班的。
 * @param params
 * @returns {*}
 */
export function searchForUnscheduledEmployees(params) {
  return commonFetch({
    url: '/edenep/merchant/work/attendanceGroup/searchForUnscheduledEmployees',
    method: 'get',
    params: params
  })
}

export function getWorkDayConfig(params) {
  return commonFetch({
    url: '/edenep/merchant/work/attendanceGroup/getWorkDayConfig',
    method: 'get',
    params: params
  })
}

export function getEspecialDateConfigList(params) {
  return commonFetch({
    url: '/edenep/merchant/work/attendanceGroup/getEspecialDateConfigList',
    method: 'get',
    params: params
  })
}

export function getAttendanceEmployeeList(params) {
  return commonFetch({
    url: '/edenep/merchant/work/attendanceGroup/getAttendanceEmployees',
    method: 'get',
    params: params
  })
}

export function getScheduleCycleConfig(params) {
  return commonFetch({
    url: '/edenep/merchant/work/attendanceGroup/getScheduleCycleConfig',
    method: 'get',
    params: params
  })
}

export function getAttendanceGroupEmployeeScheduleList(params) {
  return commonFetch({
    url: '/edenep/merchant/work/attendanceGroup/getAttendanceGroupEmployeeScheduleList',
    method: 'get',
    params: params
  })
}

export function changeEmployeeSchedule(params) {
  return commonFetch({
    url: '/edenep/merchant/work/attendanceGroup/changeEmployeeSchedule',
    method: 'post',
    params: params
  })
}

export function getEmployeeScheduleList(params) {
  return commonFetch({
    url: '/edenep/merchant/work/attendanceGroup/getEmployeeScheduleList',
    method: 'get',
    params: params
  })
}
