import Mock from 'mockjs'
import { mockParam2Obj } from '@/utils'

const List = []
const count = 500

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    btnNo: Mock.Random.string('number', 4, 8),
    btnName: '@cname',
    menuNo: Mock.Random.string('number', 4, 8),
    btnIcon: Mock.Random.dataImage('32x32', '图标'),
    btnUrl: '@url()',
    createBy: '@first',
    createDate: '@datetime',
    modifyBy: '@first',
    modifyDate: '@datetime'
  }))
}

export default {
  getButtonList: config => {
    const {
      id,
      btnNo,
      btnName,
      menuNo,
      btnIcon,
      btnUrl,
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
      if (btnNo && item.btnNo === btnNo) return false
      if (btnName && item.btnName.indexOf(btnName) < 0) return false
      if (menuNo && item.menuNo.indexOf(menuNo) < 0) return false
      if (btnIcon && item.btnIcon.indexOf(btnIcon) < 0) return false
      if (btnUrl && item.btnUrl.indexOf(btnUrl) < 0) return false
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
      error_info: '查询列表成功',
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
  addButton: config => {
    const result = {
      error_no: 0,
      error_info: '添加成功',
      result: {}
    }
    return result
  },
  editButton: config => {
    const result = {
      error_no: 0,
      error_info: '修改成功',
      result: {}
    }
    return result
  },
  delButton: config => {
    const result = {
      error_no: 0,
      error_info: '删除成功',
      result: {}
    }
    return result
  },
  delBatchButton: config => {
    const result = {
      error_no: 0,
      error_info: '删除成功',
      result: {}
    }
    return result
  }
}
