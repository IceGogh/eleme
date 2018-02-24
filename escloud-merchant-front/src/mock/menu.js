import Mock from 'mockjs'
import {
  mockParam2Obj
} from '@/utils'

const List = []
const count = 500

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    menuNo: Mock.Random.string('number', 4, 8),
    menuName: '@cname',
    menuDesc: '@csentence',
    applicationCode: '@natural(0,100)',
    menuParentNo: '@natural(0,100)',
    menuOrder: '@natural(0,100)',
    menuFilePath: '@url()',
    menuUrl: '@url()',
    menuIcon: Mock.Random.dataImage('32x32', '图标'),
    createBy: '@first',
    createDate: '@datetime',
    modifyBy: '@first',
    modifyDate: '@datetime'
  }))
}

export default {
  getMenuList: config => {
    const {
      id,
      applicationCode,
      applicationName,
      applicationDesc,
      applicationUrl,
      createBy,
      createDate,
      modifyBy,
      modifyDate,
      current,
      pageSize,
      sort
    } = mockParam2Obj(config.url)

    let mockList = List.filter(item => {
      if (id && item.id !== Number(id)) return false
      if (applicationCode && item.applicationCode !== applicationCode) return false
      if (applicationName && item.applicationName.indexOf(applicationName) < 0) return false
      if (applicationDesc && item.applicationDesc.indexOf(applicationDesc) < 0) return false
      if (applicationUrl && item.applicationUrl.indexOf(applicationUrl) < 0) return false
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
  addMenu: config => {
    const result = {
      error_no: 0,
      error_info: '添加成功',
      result: {}
    }
    return result
  },
  editMenu: config => {
    const result = {
      error_no: 0,
      error_info: '修改成功',
      result: {}
    }
    return result
  },
  delMenu: config => {
    const result = {
      error_no: 0,
      error_info: '删除成功',
      result: {}
    }
    return result
  },
  delBatchMenu: config => {
    const result = {
      error_no: 0,
      error_info: '删除成功',
      result: {}
    }
    return result
  },
  getMenuTree: config => {
    const menuTree = {
      error_no: 0,
      error_info: '查询权限资源列表',
      result: [{
        id: 1,
        status: 0,
        resNo: '201711041750000001',
        applicationCode: '201711041750000001',
        type: 'application',
        label: '工作台',
        menuParentNo: null,
        checked: true,
        children: [{
          id: 1,
          status: 0,
          resNo: '2017110417510000000',
          menuParentNo: '201711041750000001',
          applicationCode: '201711041750000001',
          type: 'menu',
          label: '系统管理',
          checked: true,
          children: [{
            id: 3,
            status: 0,
            resNo: '2017110417510000001',
            menuParentNo: '2017110417510000000',
            applicationCode: '201711041750000001',
            type: 'menu',
            label: '角色管理',
            checked: true,
            children: []
          },
          {
            id: 4,
            status: 0,
            resNo: '2017110417510000003',
            menuParentNo: '2017110417510000000',
            applicationCode: '201711041750000001',
            type: 'menu',
            label: '用户管理',
            checked: true,
            children: []
          },
          {
            id: 5,
            status: 0,
            resNo: '2017110417510000004',
            menuParentNo: '2017110417510000000',
            applicationCode: '201711041750000001',
            type: 'menu',
            label: '分组管理',
            checked: true,
            children: []
          },
          {
            id: 6,
            status: 0,
            resNo: '2017110417510000005',
            menuParentNo: '2017110417510000000',
            applicationCode: '201711041750000001',
            type: 'menu',
            label: '按钮管理',
            checked: true,
            children: []
          }]
        }]
      },
      {
        id: 2,
        status: 0,
        resNo: '201711041750000001',
        applicationCode: '201711041750000010',
        type: 'application',
        label: '环卫云平台',
        menuParentNo: null,
        checked: true,
        children: []
      }]
    }
    return menuTree
  }
}
