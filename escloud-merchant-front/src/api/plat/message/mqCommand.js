import { commonFetch } from '@/api/common'

export function getMqCommandList(params) {
  return commonFetch({
    url: '/edenep/plat/message/mq/command_list',
    method: 'get',
    params: params
  })
}

export function getQueueName() {
  return commonFetch({
    url: 'edenep/plat/message/mq/queue_dic',
    method: 'get',
    params: {}
  })
}

export function getConsumerName() {
  return commonFetch({
    url: 'edenep/plat/message/mq/consumer_dic',
    method: 'get',
    params: {}
  })
}

export function addMqCommand(params) {
  return commonFetch({
    url: '/edenep/plat/message/mq/command_add',
    method: 'post',
    params: params
  })
}

export function editMqCommand(params) {
  return commonFetch({
    url: '/edenep/plat/message/mq/command_edit',
    method: 'post',
    params: params
  })
}

export function delMqCommand(params) {
  return commonFetch({
    url: '/edenep/plat/message/mq/command_del',
    method: 'post',
    params: params
  })
}

export function delBatchMqCommand(params) {
  return commonFetch({
    url: '/edenep/plat/message/mq/command_del',
    method: 'post',
    params: params
  })
}
export function synAllMqCommand(params) {
  return commonFetch({
    url: '/edenep/plat/message/mq/synAll_command',
    method: 'post',
    params: params
  })
}
export function synBatchMqCommand(params) {
  return commonFetch({
    url: '/edenep/plat/message/mq/syn_command',
    method: 'post',
    params: params
  })
}
