import Mock from 'mockjs'
import { mockParam2Obj } from '@/utils'

export default {
  getRoleList: config => {
    const {
      id,
      merchantId,
      roleName,
      roleCname,
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
    const count = 100
    for (let i = 0; i < count; i++) {
      List.push(Mock.mock({
        id: '@increment',
        merchantId: '@natural(1000,100000)',
        roleName: '@cname',
        roleCname: '@first',
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
      if (merchantId && item.merchantId === Number(merchantId)) return false
      if (roleName && item.roleName.indexOf(roleName) < 0) return false
      if (roleCname && item.roleCname.indexOf(roleCname) < 0) return false
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
  addRoleInfo: config => {
    const result = {
      error_no: 0,
      error_info: '添加成功',
      result: {}
    }
    return result
  },
  editRoleInfo: config => {
    const result = {
      error_no: 0,
      error_info: '修改成功',
      result: {}
    }
    return result
  },
  delRoleInfo: config => {
    const result = {
      error_no: 0,
      error_info: '删除成功',
      result: {}
    }
    return result
  },
  delBatchRoleInfo: config => {
    const result = {
      error_no: 0,
      error_info: '删除成功',
      result: {}
    }
    return result
  },
  getRoleTree: config => {
    const result = {
      error_no: 0,
      error_info: '查询列表成功',
      result: [{
        id: 1,
        merchantId: 10001,
        roleName: '管理员',
        description: '保证系统正常运行',
        state: '0',
        createBy: 'admin',
        createDate: '2017-11-14 10:50:00',
        modifyBy: 'admin',
        modifyDate: '2017-11-14 10:50:00',
        roleCname: 'admin'
      },
      {
        id: 2,
        merchantId: 10002,
        roleName: '运维人员2',
        description: '保证系统正常运行',
        state: '0',
        createBy: 'admin',
        createDate: '2017-11-14 10:50:00',
        modifyBy: 'admin',
        modifyDate: '2017-11-14 10:50:00',
        roleCname: 'operation'
      },
      {
        id: 3,
        merchantId: 10002,
        roleName: '运维人员',
        description: '保证系统正常运行',
        state: '0',
        createBy: 'admin',
        createDate: '2017-11-14 10:50:00',
        modifyBy: 'admin',
        modifyDate: '2017-11-14 10:50:00',
        roleCname: 'operation'
      },
      {
        id: 4,
        merchantId: 10002,
        roleName: '运维人员',
        description: '保证系统正常运行',
        state: '0',
        createBy: null,
        createDate: null,
        modifyBy: null,
        modifyDate: null,
        roleCname: 'operation'
      }
      ]
    }
    return result
  },
  getRoleUserList: config => {
    const {
      roleId,
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
        roleId: Mock.Random.string('number', 4, 8),
        userId: '@increment',
        userName: '@name',
        roleName: '@name',
        phone: /^1[0-9]{10}$/
      }))
    }

    let mockList = List.filter(item => {
      if (merchantId && item.merchantId === merchantId) return false
      if (groupName && item.groupName.indexOf(groupName) < 0) return false
      if (roleId && item.roleId.indexOf(roleId) < 0) return false
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
  getRoleExcludeUserList: config => {
    const {
      roleId,
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
        roleId: Mock.Random.string('number', 4, 8),
        userId: '@increment',
        userName: '@name',
        roleName: '@name',
        phone: /^1[0-9]{10}$/
      }))
    }

    let mockList = List.filter(item => {
      if (merchantId && item.merchantId === merchantId) return false
      if (groupName && item.groupName.indexOf(groupName) < 0) return false
      if (roleId && item.roleId.indexOf(roleId) < 0) return false
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
  addUserToRole: config => {
    const result = {
      error_no: 0,
      error_info: '添加成功',
      result: {}
    }
    return result
  },
  delUserFromRole: config => {
    const result = {
      error_no: 0,
      error_info: '删除成功',
      result: {}
    }
    return result
  },
  delBatchUserFromRole: config => {
    const result = {
      error_no: 0,
      error_info: '删除成功',
      result: {}
    }
    return result
  }
}
