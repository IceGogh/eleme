import Mock from 'mockjs'
import { mockParam2Obj } from '@/utils'

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

export default {
  getUserGroupList: config => {
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
  addUserGroup: config => {
    const result = {
      error_no: 0,
      error_info: '添加成功',
      result: {}
    }
    return result
  },
  editUserGroup: config => {
    const result = {
      error_no: 0,
      error_info: '修改成功',
      result: {}
    }
    return result
  },
  delUserGroup: config => {
    const result = {
      error_no: 0,
      error_info: '删除成功',
      result: {}
    }
    return result
  },
  delBatchUserGroup: config => {
    const result = {
      error_no: 0,
      error_info: '删除成功',
      result: {}
    }
    return result
  }
}
