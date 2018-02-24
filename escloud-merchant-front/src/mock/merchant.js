import Mock from 'mockjs'
import { mockParam2Obj } from '@/utils'

const List = []
const count = 500

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    merchantId: Mock.Random.string('number', 4, 8),
    merchantName: '@cname',
    description: '@csentence',
    logo: '@url()',
    createBy: '@first',
    createDate: '@datetime',
    modifyBy: '@first',
    modifyDate: '@datetime'
  }))
}

export default {
  getMerchantList: config => {
    const {
      id,
      merchantId,
      merchantName,
      description,
      logo,
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
      if (merchantId && item.applicationCode === merchantId) return false
      if (merchantName && item.merchantName.indexOf(merchantName) < 0) return false
      if (description && item.description.indexOf(description) < 0) return false
      if (logo && item.applicationUrl.indexOf(logo) < 0) return false
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
  addMerchant: config => {
    const result = {
      error_no: 0,
      error_info: '添加成功',
      result: {}
    }
    return result
  },
  editMerchant: config => {
    const result = {
      error_no: 0,
      error_info: '修改成功',
      result: {}
    }
    return result
  },
  delMerchant: config => {
    const result = {
      error_no: 0,
      error_info: '删除成功',
      result: {}
    }
    return result
  },
  delBatchMerchant: config => {
    const result = {
      error_no: 0,
      error_info: '删除成功',
      result: {}
    }
    return result
  }
}
