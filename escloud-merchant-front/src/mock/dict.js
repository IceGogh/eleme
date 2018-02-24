import {
  mockParam2Obj
} from '@/utils'

export default {
  getDictTree() {
    const dictTree = {
      error_no: 0,
      error_info: '查询成功',
      result: [{
        id: '1',
        enumCode: 'ZDL_GY',
        label: '公用类',
        enumStatus: '0',
        state: '1',
        isDictType: '1',
        orderline: '1',
        description: '',
        createBy: 'admin',
        createDate: '2017-11-10 10:10:10',
        modifyBy: 'admin',
        modifyDate: '2017-11-11 11:11:11',
        children: [{
          id: '1',
          enumCode: 'ZD_MZ',
          label: '民族',
          enumStatus: '0',
          state: '1',
          isDictType: '0',
          orderline: '1',
          isDynamic: '0',
          sqlStatement: '',
          description: '',
          createBy: 'admin',
          createDate: '2017-11-10 10:10:10',
          modifyBy: 'admin',
          modifyDate: '2017-11-11 11:11:11',
          children: []
        },
        {
          id: '2',
          enumCode: 'ZD_GJ',
          label: '国籍',
          enumStatus: '0',
          state: '1',
          isDictType: '0',
          orderline: '2',
          isDynamic: '1',
          sqlStatement: 'select enumCode, name from table_country',
          description: '',
          createBy: 'admin',
          createDate: '2017-11-10 10:10:10',
          modifyBy: 'admin',
          modifyDate: '2017-11-11 11:11:11',
          children: []
        },
        {
          id: '3',
          enumCode: 'ZDL_SFYX',
          label: '是否有效',
          enumStatus: '0',
          state: '1',
          isDictType: '0',
          orderline: '3',
          isDynamic: '0',
          sqlStatement: '',
          description: '',
          createBy: 'admin',
          createDate: '2017-11-10 10:10:10',
          modifyBy: 'admin',
          modifyDate: '2017-11-11 11:11:11',
          children: []
        }]
      },
      {
        id: '2',
        enumCode: 'ZDL_DSRW',
        label: '定时任务类',
        enumStatus: '0',
        state: '1',
        isDictType: '1',
        orderline: '2',
        description: '',
        createBy: 'admin',
        createDate: '2017-11-10 10:10:10',
        modifyBy: 'admin',
        modifyDate: '2017-11-11 11:11:11',
        children: [{
          id: '10',
          enumCode: 'ZD_YWLX',
          label: '业务类型',
          enumStatus: '0',
          state: '1',
          isDictType: '0',
          orderline: '4',
          isDynamic: '0',
          sqlStatement: '',
          description: '',
          createBy: 'admin',
          createDate: '2017-11-10 10:10:10',
          modifyBy: 'admin',
          modifyDate: '2017-11-11 11:11:11',
          children: []
        }]
      },
      {
        id: '3',
        enumCode: 'ZDL_PTJC',
        label: '平台基础类',
        enumStatus: '0',
        state: '1',
        isDictType: '1',
        orderline: '3',
        description: '',
        createBy: 'admin',
        createDate: '2017-11-10 10:10:10',
        modifyBy: 'admin',
        modifyDate: '2017-11-11 11:11:11',
        children: [{
          id: '100',
          enumCode: 'ZD_ZYLX',
          label: '资源类型',
          enumStatus: '0',
          state: '1',
          isDictType: '0',
          orderline: '5',
          isDynamic: '0',
          sqlStatement: '',
          description: '',
          createBy: 'admin',
          createDate: '2017-11-10 10:10:10',
          modifyBy: 'admin',
          modifyDate: '2017-11-11 11:11:11',
          children: []
        }]
      }]
    }
    return dictTree
  },
  getDictEnumList: config => {
    const params = mockParam2Obj(config.url)
    const enumCode = params.enumCode
    if (enumCode === 'ZD_MZ') {
      const enumList = {
        error_no: 0,
        error_info: '查询成功',
        result: {
          offset: 0,
          limit: 15,
          total: 6,
          size: 15,
          pages: 1,
          current: 1,
          searchCount: true,
          openSort: true,
          orderByField: null,
          records: [{
            id: '10001',
            enumCode: 'ZD_MZ',
            enumName: '汉族',
            enumValue: 'ZD_MZ_HANZU',
            enumStatus: '1',
            orderline: '1',
            createBy: 'admin',
            createDate: '2017-11-10 10:10:10',
            modifyBy: 'admin',
            modifyDate: '2017-11-11 11:11:11'
          },
          {
            id: '10002',
            enumCode: 'ZD_MZ',
            enumName: '藏族',
            enumValue: 'ZD_MZ_ZANGZU',
            enumStatus: '1',
            orderline: '2',
            createBy: 'admin',
            createDate: '2017-11-10 10:10:10',
            modifyBy: 'admin',
            modifyDate: '2017-11-11 11:11:11'
          },
          {
            id: '10003',
            enumCode: 'ZD_MZ',
            enumName: '蒙古族',
            enumValue: 'ZD_MZ_MENGGUZ',
            enumStatus: '1',
            orderline: '3',
            createBy: 'admin',
            createDate: '2017-11-10 10:10:10',
            modifyBy: 'admin',
            modifyDate: '2017-11-11 11:11:11'
          },
          {
            id: '10004',
            enumCode: 'ZD_MZ',
            enumName: '维吾尔族',
            enumValue: 'ZD_MZ_WEIWUERZU',
            enumStatus: '1',
            orderline: '4',
            createBy: 'admin',
            createDate: '2017-11-10 10:10:10',
            modifyBy: 'admin',
            modifyDate: '2017-11-11 11:11:11'
          },
          {
            id: '10005',
            enumCode: 'ZD_MZ',
            enumName: '回族',
            enumValue: 'ZD_MZ_HUIZU',
            enumStatus: '1',
            orderline: '5',
            createBy: 'admin',
            createDate: '2017-11-10 10:10:10',
            modifyBy: 'admin',
            modifyDate: '2017-11-11 11:11:11'
          },
          {
            id: '10006',
            enumCode: 'ZD_MZ',
            enumName: '壮族',
            enumValue: 'ZD_MZ_ZHUANGZU',
            enumStatus: '1',
            orderline: '6',
            createBy: 'admin',
            createDate: '2017-11-10 10:10:10',
            modifyBy: 'admin',
            modifyDate: '2017-11-11 11:11:11'
          }]
        }
      }
      return enumList
    } else if (enumCode === 'ZD_GJ') {
      const enumList = {
        error_no: 0,
        error_info: '查询成功',
        result: {
          offset: 0,
          limit: 15,
          total: 2,
          size: 15,
          pages: 1,
          current: 1,
          searchCount: true,
          openSort: true,
          orderByField: null,
          records: [{
            id: '20001',
            enumCode: 'ZD_GJ',
            enumName: '中国',
            enumValue: 'ZD_GJ_CHINA',
            enumStatus: '1',
            orderline: '1',
            createBy: 'admin',
            createDate: '2017-11-10 10:10:10',
            modifyBy: 'admin',
            modifyDate: '2017-11-11 11:11:11'
          },
          {
            id: '20002',
            enumCode: 'ZD_GJ',
            enumName: '美国',
            enumValue: 'ZD_GJ_AMERICA',
            enumStatus: '1',
            orderline: '2',
            createBy: 'admin',
            createDate: '2017-11-10 10:10:10',
            modifyBy: 'admin',
            modifyDate: '2017-11-11 11:11:11'
          }]
        }
      }
      return enumList
    } else if (enumCode === 'ZDL_SFYX') {
      const enumList = {
        error_no: 0,
        error_info: '查询成功',
        result: {
          offset: 0,
          limit: 15,
          total: 2,
          size: 15,
          pages: 1,
          current: 1,
          searchCount: true,
          openSort: true,
          orderByField: null,
          records: [{
            id: '30001',
            enumCode: 'ZD_SFYX',
            enumName: '是',
            enumValue: '1',
            enumStatus: '1',
            orderline: '1',
            createBy: 'admin',
            createDate: '2017-11-10 10:10:10',
            modifyBy: 'admin',
            modifyDate: '2017-11-11 11:11:11'
          },
          {
            id: '30002',
            enumCode: 'ZD_SFYX',
            enumName: '否',
            enumValue: '0',
            enumStatus: '1',
            orderline: '2',
            createBy: 'admin',
            createDate: '2017-11-10 10:10:10',
            modifyBy: 'admin',
            modifyDate: '2017-11-11 11:11:11'
          }]
        }
      }
      return enumList
    } else if (enumCode === 'ZD_YWLX') {
      const enumList = {
        error_no: 0,
        error_info: '查询成功',
        result: {
          offset: 0,
          limit: 15,
          total: 0,
          size: 15,
          pages: 1,
          current: 1,
          searchCount: true,
          openSort: true,
          orderByField: null,
          records: [{
            id: '50001',
            enumCode: 'ZD_YWLX',
            enumName: '采集解码后的数据入队列',
            enumValue: 'COLLECT_ANALYSIS_MSG_QUEUE_COMMAND',
            enumStatus: '1',
            orderline: '1',
            createBy: 'admin',
            createDate: '2017-11-10 10:10:10',
            modifyBy: 'admin',
            modifyDate: '2017-11-11 11:11:11'
          },
          {
            id: '50002',
            enumCode: 'ZD_YWLX',
            enumName: '采集合法数据入队列',
            enumValue: 'COLLECT_AUTH_MSG_QUEUE_COMMAND',
            enumStatus: '1',
            orderline: '2',
            createBy: 'admin',
            createDate: '2017-11-10 10:10:10',
            modifyBy: 'admin',
            modifyDate: '2017-11-11 11:11:11'
          }]
        }
      }
      return enumList
    } else if (enumCode === 'ZD_ZYLX') {
      const enumList = {
        error_no: 0,
        error_info: '查询成功',
        result: {
          offset: 0,
          limit: 15,
          total: 2,
          size: 15,
          pages: 1,
          current: 1,
          searchCount: true,
          openSort: true,
          orderByField: null,
          records: [{
            id: '50001',
            enumCode: 'ZD_ZYLX',
            enumName: '菜单',
            enumValue: '0',
            enumStatus: '1',
            orderline: '1',
            createBy: 'admin',
            createDate: '2017-11-10 10:10:10',
            modifyBy: 'admin',
            modifyDate: '2017-11-11 11:11:11'
          },
          {
            id: '50002',
            enumCode: 'ZD_ZYLX',
            enumName: '接口',
            enumValue: '1',
            enumStatus: '1',
            orderline: '2',
            createBy: 'admin',
            createDate: '2017-11-10 10:10:10',
            modifyBy: 'admin',
            modifyDate: '2017-11-11 11:11:11'
          }]
        }
      }
      return enumList
    } else {
      const enumList = {
        error_no: 0,
        error_info: '查询成功',
        result: {
          offset: 0,
          limit: 15,
          total: 0,
          size: 15,
          pages: 1,
          current: 1,
          searchCount: true,
          openSort: true,
          orderByField: null,
          records: []
        }
      }
      return enumList
    }
  },
  getAllStaticDictMap: config => {
    const enumList = {
      error_no: 0,
      error_info: '查询成功',
      result: {
        ZD_SFYX: [{
          id: '30001',
          enumCode: 'ZD_SFYX',
          enumName: '是',
          enumValue: '1',
          enumStatus: '1',
          orderline: '1',
          createBy: 'admin',
          createDate: '2017-11-10 10:10:10',
          modifyBy: 'admin',
          modifyDate: '2017-11-11 11:11:11'
        },
        {
          id: '30002',
          enumCode: 'ZD_SFYX',
          enumName: '否',
          enumValue: '0',
          enumStatus: '1',
          orderline: '2',
          createBy: 'admin',
          createDate: '2017-11-10 10:10:10',
          modifyBy: 'admin',
          modifyDate: '2017-11-11 11:11:11'
        }],
        ZD_ZYLX: [{
          id: '50001',
          enumCode: 'ZD_ZYLX',
          enumName: '菜单',
          enumValue: '0',
          enumStatus: '1',
          orderline: '1',
          createBy: 'admin',
          createDate: '2017-11-10 10:10:10',
          modifyBy: 'admin',
          modifyDate: '2017-11-11 11:11:11'
        },
        {
          id: '50002',
          enumCode: 'ZD_ZYLX',
          enumName: '接口',
          enumValue: '1',
          enumStatus: '1',
          orderline: '2',
          createBy: 'admin',
          createDate: '2017-11-10 10:10:10',
          modifyBy: 'admin',
          modifyDate: '2017-11-11 11:11:11'
        }],
        ZD_YWLX: [
          {
            id: '50001',
            enumCode: 'ZD_YWLX',
            enumName: '采集解码后的数据入队列',
            enumValue: 'COLLECT_ANALYSIS_MSG_QUEUE_COMMAND',
            enumStatus: '1',
            orderline: '1',
            createBy: 'admin',
            createDate: '2017-11-10 10:10:10',
            modifyBy: 'admin',
            modifyDate: '2017-11-11 11:11:11'
          },
          {
            id: '50002',
            enumCode: 'ZD_YWLX',
            enumName: '采集合法数据入队列',
            enumValue: 'COLLECT_AUTH_MSG_QUEUE_COMMAND',
            enumStatus: '1',
            orderline: '2',
            createBy: 'admin',
            createDate: '2017-11-10 10:10:10',
            modifyBy: 'admin',
            modifyDate: '2017-11-11 11:11:11'
          }
        ]
      }
    }
    return enumList
  }
}
