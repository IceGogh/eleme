import Mock from 'mockjs'
import { mockParam2Obj } from '@/utils'

export default {
  getUserInfo: config => {
    const params = mockParam2Obj(config.url)
    // const curMerchantId = params.curMerchantId
    const curUserId = params.curUserId
    // const userToken = params.userToken
    if (curUserId === '1023143455') {
      const userInfo = {
        error_no: 0,
        error_info: '查询用户详细信息成功',
        result: {
          id: '4',
          merchantId: '1001',
          userId: '1023143455',
          userName: '测试',
          phone: '18681547661',
          createBy: 'admin',
          createDate: '2017-10-23 14:34:55',
          roleId: '0'
        }
      }
      return userInfo
    } else {
      return Promise.reject('error')
    }
  },
  getUserInfoList: config => {
    const {
      id,
      merchantId,
      userId,
      userName,
      phone,
      createBy,
      createDate,
      current,
      pageSize,
      sort
    } = mockParam2Obj(config.url)

    const List = []
    const count = 100
    for (let i = 0; i < count; i++) {
      List.push(Mock.mock({
        id: '@increment',
        merchantId: '@increment(1000)',
        userId: '@natural(1000,100000)',
        userName: '@cname',
        phone: /^1[0-9]{10}$/,
        createBy: '@first',
        createDate: '@datetime'
      }))
    }

    let mockList = List.filter(item => {
      if (id && item.id === Number(id)) return false
      if (merchantId && item.merchantId === Number(merchantId)) return false
      if (userId && item.userId === Number(userId)) return false
      if (userName && item.userName.indexOf(userName) < 0) return false
      if (phone && item.phone.indexOf(phone) < 0) return false
      if (createBy && item.createBy.indexOf(createBy) < 0) return false
      if (createDate && item.createDate.indexOf(createDate) < 0) return false
      return true
    })

    if (sort === '-id') {
      mockList = mockList.reverse()
    }

    const pageList = mockList.filter((item, index) => index < pageSize * current && index >= pageSize * (current - 1))

    return {
      error_no: 0,
      error_info: '查询模块列表成功',
      result: {
        offset: 0,
        limit: 2147483647,
        total: mockList.length,
        size: pageSize,
        pages: 1,
        current: current,
        searchCount: true,
        openSort: true,
        orderByField: null,
        condition: null,
        asc: true,
        offsetCurrent: 0,
        records: pageList
      }
    }
  },
  addUserInfo: config => {
    const result = {
      error_no: 0,
      error_info: '添加成功',
      result: {}
    }
    return result
  },
  editUserInfo: config => {
    const result = {
      error_no: 0,
      error_info: '修改成功',
      result: {}
    }
    return result
  },
  delUserInfo: config => {
    const result = {
      error_no: 0,
      error_info: '删除成功',
      result: {}
    }
    return result
  },
  delBatchUserInfo: config => {
    const result = {
      error_no: 0,
      error_info: '删除成功',
      result: {}
    }
    return result
  }
}
