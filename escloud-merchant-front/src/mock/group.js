import {
  mockParam2Obj
} from '@/utils'
import Mock from 'mockjs'

export default {
  getGroupTree: config => {
    const result = {
      error_no: 0,
      error_info: '查询分组列表成功',
      result: [{
        id: 1,
        merchantId: 10001,
        groupName: '管理组',
        groupEname: 'manage',
        description: '管理人员信息',
        state: '0',
        children: [],
        createBy: 'admin',
        createDate: '2017-11-14 10:50:00',
        modifyBy: 'admin',
        modifyDate: '2017-11-14 10:50:00'
      },
      {
        id: 2,
        merchantId: 10001,
        groupName: '运营组',
        groupEname: 'spread',
        description: '运营人员信息',
        state: '0',
        children: [],
        createBy: 'admin',
        createDate: '2017-11-14 10:50:00',
        modifyBy: 'admin',
        modifyDate: '2017-11-14 10:50:00'
      }
      ]
    }
    return result
  },
  getGroupList: config => {
    const {
      id,
      merchantId,
      groupName,
      groupEname,
      description,
      state,
      createBy,
      createDate,
      modifyBy,
      modifyDate,
      current,
      pageSize,
      sort
    } = mockParam2Obj(config.url)

    const List = []
    const count = 1000

    for (let i = 0; i < count; i++) {
      List.push(Mock.mock({
        id: '@increment',
        merchantId: Mock.Random.string('number', 4, 8),
        groupName: '@cname',
        groupEname: '@name',
        description: '@csentence',
        'state|1': ['0', '1'],
        createBy: '@first',
        createDate: '@datetime',
        modifyBy: '@first',
        modifyDate: '@datetime'
      }))
    }

    let mockList = List.filter(item => {
      if (id && item.id === Number(id)) return false
      if (merchantId && item.merchantId === merchantId) return false
      if (groupName && item.groupName.indexOf(groupName) < 0) return false
      if (groupEname && item.groupEname.indexOf(groupEname) < 0) return false
      if (description && item.description.indexOf(description) < 0) return false
      if (state && item.state.indexOf(state) < 0) return false
      if (createBy && item.createBy.indexOf(createBy) < 0) return false
      if (createDate && item.createDate.indexOf(createDate) < 0) return false
      if (modifyBy && item.modifyBy.indexOf(modifyBy) < 0) return false
      if (modifyDate && item.modifyDate.indexOf(modifyDate) < 0) return false
      return true
    })

    if (sort === '-id') {
      mockList = mockList.reverse()
    }
    const pageList = mockList.filter((item, index) => index < pageSize * current && index >= pageSize * (current - 1))

    return {
      error_no: 0,
      error_info: '查询成功',
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
  addGroup: config => {
    const result = {
      error_no: 0,
      error_info: '添加成功',
      result: {}
    }
    return result
  },
  editGroup: config => {
    const result = {
      error_no: 0,
      error_info: '修改成功',
      result: {}
    }
    return result
  },
  delGroup: config => {
    const result = {
      error_no: 0,
      error_info: '删除成功',
      result: {}
    }
    return result
  },
  delBatchGroup: config => {
    const result = {
      error_no: 0,
      error_info: '删除成功',
      result: {}
    }
    return result
  },
  getGroupUserList: config => {
    const {
      groupId,
      merchantId,
      userId,
      userName,
      groupName,
      current,
      pageSize,
      sort
    } = mockParam2Obj(config.url)

    const List = []
    const count = 100

    for (let i = 0; i < count; i++) {
      List.push(Mock.mock({
        id: '@increment',
        merchantId: Mock.Random.string('number', 4, 8),
        groupId: Mock.Random.string('number', 4, 8),
        userId: '@increment',
        userName: '@name',
        groupName: '@name',
        phone: /^1[0-9]{10}$/
      }))
    }

    let mockList = List.filter(item => {
      if (merchantId && item.merchantId === merchantId) return false
      if (groupName && item.groupName.indexOf(groupName) < 0) return false
      if (groupId && item.groupId.indexOf(groupId) < 0) return false
      if (userId && item.userId.indexOf(userId) < 0) return false
      if (userName && item.userName.indexOf(userName) < 0) return false
      if (groupName && item.groupName.indexOf(groupName) < 0) return false
      return true
    })

    if (sort === '-id') {
      mockList = mockList.reverse()
    }
    const pageList = mockList.filter((item, index) => index < pageSize * current && index >= pageSize * (current - 1))

    return {
      error_no: 0,
      error_info: '查询成功',
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
  getGroupExcludeUserList: config => {
    const {
      groupId,
      merchantId,
      userId,
      userName,
      groupName,
      current,
      pageSize,
      sort
    } = mockParam2Obj(config.url)

    const List = []
    const count = 100

    for (let i = 0; i < count; i++) {
      List.push(Mock.mock({
        id: '@increment',
        merchantId: Mock.Random.string('number', 4, 8),
        groupId: Mock.Random.string('number', 4, 8),
        userId: '@increment',
        userName: '@name',
        groupName: '@name',
        phone: /^1[0-9]{10}$/
      }))
    }

    let mockList = List.filter(item => {
      if (merchantId && item.merchantId === merchantId) return false
      if (groupName && item.groupName.indexOf(groupName) < 0) return false
      if (groupId && item.groupId.indexOf(groupId) < 0) return false
      if (userId && item.userId.indexOf(userId) < 0) return false
      if (userName && item.userName.indexOf(userName) < 0) return false
      if (groupName && item.groupName.indexOf(groupName) < 0) return false
      return true
    })

    if (sort === '-id') {
      mockList = mockList.reverse()
    }
    const pageList = mockList.filter((item, index) => index < pageSize * current && index >= pageSize * (current - 1))

    return {
      error_no: 0,
      error_info: '查询成功',
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
  addUserToGroup: config => {
    const result = {
      error_no: 0,
      error_info: '添加成功',
      result: {}
    }
    return result
  },
  delUserFromGroup: config => {
    const result = {
      error_no: 0,
      error_info: '删除成功',
      result: {}
    }
    return result
  },
  delBatchUserFromGroup: config => {
    const result = {
      error_no: 0,
      error_info: '删除成功',
      result: {}
    }
    return result
  }
}
