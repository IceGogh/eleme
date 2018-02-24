import { commonFetch } from '@/api/common'

// 获取字典分类及字典
export function getDictTree() {
  return commonFetch({
    url: '/edenep/plat/dict/enumtype/list_all',
    method: 'get'
  })
}

// 获取字典的枚举值分页列表（静态字典 动态字典通用）
export function getDictEnumList(query) {
  return commonFetch({
    url: '/edenep/plat/dict/enumvalue/list',
    method: 'get',
    params: query
  })
}

// 获取字典所有(不分页)的静态字典枚举值Map
export function getAllStaticDictMap(query) {
  return commonFetch({
    url: '/edenep/plat/dict/enumvalue/list_map_all',
    method: 'get',
    params: query
  })
}

export function addEnumValue(params) {
  return commonFetch({
    url: '/edenep/plat/dict/enumvalue/add',
    method: 'post',
    params: params
  })
}

export function editEnumValue(params) {
  return commonFetch({
    url: '/edenep/plat/dict/enumvalue/edit',
    method: 'post',
    params: params
  })
}

export function delEnumValue(params) {
  return commonFetch({
    url: '/edenep/plat/dict/enumvalue/del',
    method: 'post',
    params: params
  })
}

export function delBatchEnumValue(params) {
  return commonFetch({
    url: '/edenep/plat/dict/enumvalue/del_batch',
    method: 'post',
    params: params
  })
}

export function addEnumType(params) {
  return commonFetch({
    url: '/edenep/plat/dict/enumtype/add',
    method: 'post',
    params: params
  })
}

export function editEnumType(params) {
  return commonFetch({
    url: '/edenep/plat/dict/enumtype/edit',
    method: 'post',
    params: params
  })
}

export function delEnumType(params) {
  return commonFetch({
    url: '/edenep/plat/dict/enumtype/del',
    method: 'post',
    params: params
  })
}

export function delBatchEnumType(params) {
  return commonFetch({
    url: '/edenep/plat/dict/enumtype/del_batch',
    method: 'post',
    params: params
  })
}
