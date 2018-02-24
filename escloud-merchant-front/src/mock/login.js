import { mockParam2Obj } from '@/utils'

export default {
  loginByAccount: config => {
    const params = mockParam2Obj(config.body)
    const userAccount = params.userAccount
    const passWord = params.passWord
    if (userAccount === 'admin' && passWord === 'a123456') {
      const result = {
        error_no: 0,
        error_info: '用户登录认证通过',
        result: {
          userToken: '37C014E89348D8E0FC733583A075505E',
          userInfo: {
            id: '4',
            merchantId: '1001',
            userId: '1023143455',
            userName: '测试',
            phone: '18681547661',
            createBy: 'admin',
            createDate: '2017-10-23 14:34:55'
          }
        }
      }
      return result
    } else {
      const result = {
        error_no: '-1',
        error_info: '用户名或密码错误',
        result: {}
      }
      return result
    }
  },
  logout: config => {
    // const params = JSON.parse(config.body)
    // const curMerchantId = params.curMerchantId
    // const curUserId = params.curUserId
    // const userToken = params.userToken
    const result = {
      error_no: 0,
      error_info: '注销成功',
      result: {}
    }
    return result
  }
}
