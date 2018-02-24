import { commonFetch } from '@/api/common'

export function getMqConsumerList(params) {
  return commonFetch({
    url: '/edenep/plat/message/mq/consumer_list',
    method: 'get',
    params: params
  })
}

export function addMqConsumer(params) {
  return commonFetch({
    url: '/edenep/plat/message/mq/consumer_add',
    method: 'post',
    params: params
  })
}

export function editMqConsumer(params) {
  return commonFetch({
    url: '/edenep/plat/message/mq/consumer_edit',
    method: 'post',
    params: params
  })
}

export function delMqConsumer(params) {
  return commonFetch({
    url: '/edenep/plat/message/mq/consumer_del',
    method: 'post',
    params: params
  })
}

export function delBatchMqConsumer(params) {
  return commonFetch({
    url: '/edenep/plat/message/mq/consumer_del',
    method: 'post',
    params: params
  })
}
