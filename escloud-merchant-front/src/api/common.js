import fetch from '@/utils/fetch'
import utils from '@/utils/util'
import { getToken, getUserId, getMerchantId } from '@/utils/auth'

export function commonFetch(request) {
  const querystring = require('querystring')
  if (!request.params) {
    request['params'] = {}
  }
  request['params']['curUserId'] = getUserId()
  request['params']['userToken'] = getToken()
  request['params']['curMerchantId'] = getMerchantId()
  const tempRequest = JSON.parse(JSON.stringify(request))
  if (tempRequest.params) {
    for (const index in tempRequest.params) {
      if (tempRequest.params[index] === '' || tempRequest.params[index] == null) {
        delete tempRequest.params[index]
      }
    }
  }

  if (typeof request.params && request.params && typeof request.params.createDate && request.params.createDate) {
    if (request.params.createDate.length > 0 && request.params.createDate[0] !== null && request.params.createDate[0] !== '') {
      tempRequest.params['startCreateDate'] = utils.formatDate(request.params.createDate[0], 'yyyy-MM-dd HH:mm:ss')
      tempRequest.params['endCreateDate'] = utils.formatDate(request.params.createDate[1], 'yyyy-MM-dd HH:mm:ss')
    }
  }

  if (typeof request.params && request.params && typeof request.params.modifyDate && request.params.modifyDate) {
    if (request.params.modifyDate.length > 0 && request.params.modifyDate[0] !== null && request.params.modifyDate[0] !== '') {
      tempRequest.params['startModifyDate'] = utils.formatDate(request.params.modifyDate[0], 'yyyy-MM-dd HH:mm:ss')
      tempRequest.params['endModifyDate'] = utils.formatDate(request.params.modifyDate[1], 'yyyy-MM-dd HH:mm:ss')
    }
  }

  if (typeof request.params && request.params) {
    delete tempRequest.params['createDate']
    delete tempRequest.params['modifyDate']
  }

  if (tempRequest.method === 'post') {
    tempRequest['data'] = querystring.stringify(tempRequest.params)
    delete tempRequest['params']
  }
  return fetch(tempRequest)
}

export function getApplicationCode(e) {
  if (!e) {
    return null
  }
  if (e.$store.state.app.applicationCode) {
    return e.$store.state.app.applicationCode
  } else {
    return sessionStorage.getItem('EDENEP_APPLICATION_CODE')
  }
}

export function getDicts(e) {
  if (!e) {
    return null
  }
  const edenepSystemDicts = JSON.parse(sessionStorage.getItem('EDENEP_SYSTEM_DICTS'))
  if (edenepSystemDicts[e]) {
    return JSON.parse(edenepSystemDicts[e])
  } else {
    return null
  }
}

export function setCurProjectCode(code) {
  if (code) {
    sessionStorage.setItem('EDENEP_CURPROJECTCODE', code)
  }
}

export function getCurProjectCode() {
  return sessionStorage.getItem('EDENEP_CURPROJECTCODE')
}
