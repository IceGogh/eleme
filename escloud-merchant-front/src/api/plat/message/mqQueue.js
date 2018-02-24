import { commonFetch } from '@/api/common'

export function getMqQueueList(params) {
  return commonFetch({
    url: '/edenep/plat/message/mq/queue_list',
    method: 'get',
    params: params
  })
}

export function addMqQueue(params) {
  return commonFetch({
    url: '/edenep/plat/message/mq/queue_add',
    method: 'post',
    params: params
  })
}

export function editMqQueue(params) {
  return commonFetch({
    url: '/edenep/plat/message/mq/queue_edit',
    method: 'post',
    params: params
  })
}

export function delMqQueue(params) {
  return commonFetch({
    url: '/edenep/plat/message/mq/queue_del',
    method: 'post',
    params: params
  })
}

export function delBatchMqQueue(params) {
  return commonFetch({
    url: '/edenep/plat/message/mq/queue_del',
    method: 'post',
    params: params
  })
}
