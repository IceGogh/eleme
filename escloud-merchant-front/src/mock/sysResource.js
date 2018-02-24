import Mock from 'mockjs'
import {
  mockParam2Obj
} from '@/utils'

const List = []
const count = 500

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    parent_id: '@natural(1000,100000)',
    resource_name: '@cname',
    'type|1': ['0', '1'],
    resource_url: '@url()',
    'state|1': ['0', '1'],
    sort_value: '@natural(0,100)',
    description: '@csentence',
    create_date: '@datetime',
    create_by: '@first'
  }))
}

export default {
  sysResourceList: config => {
    const {
      id,
      parent_id,
      resource_name,
      type,
      resource_url,
      state,
      sort_value,
      description,
      create_date,
      create_by,
      page = 1,
      limit = 10,
      sort
    } = mockParam2Obj(config.url)

    let mockList = List.filter(item => {
      if (id && item.id.indexOf(id) < 0) return false
      if (parent_id && item.parent_id.indexOf(parent_id) < 0) return false
      if (resource_name && item.resource_name.indexOf(resource_name) < 0) return false
      if (type && item.type.indexOf(type) < 0) return false
      if (resource_url && item.resource_url.indexOf(resource_url) < 0) return false
      if (state && item.state.indexOf(state) < 0) return false
      if (sort_value && item.sort_value.indexOf(sort_value) < 0) return false
      if (description && item.description.indexOf(description) < 0) return false
      if (create_date && item.create_date.indexOf(create_date) < 0) return false
      if (create_by && item.create_by.indexOf(create_by) < 0) return false
      return true
    })

    if (sort === '-id') {
      mockList = mockList.reverse()
    }

    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

    return {
      total: mockList.length,
      items: pageList
    }
  },
  sysResourceInfo: () => ({
    id: '10',
    parent_id: '1',
    resource_name: '资源管理',
    type: '0',
    resource_url: 'system/resource',
    state: '1',
    sort_value: '10',
    description: '资源管理页面',
    create_date: +new Date(),
    create_by: 'admin'
  })
}
