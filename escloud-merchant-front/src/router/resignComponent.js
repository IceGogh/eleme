const _import = require('@/router/_import_' + process.env.NODE_ENV)
const File = require('./wrapComponentUrl')
import { getToken } from '@/utils/auth'
export function registerNewComponent(urlPath, filePath, createCompnentState = false, parentComponentName) {
  if (createCompnentState) {
    return {
      path: urlPath,
      component: File(parentComponentName),
      meta: { requirToken: true, token: getToken() },
      hidden: true, children: [{ path: urlPath, component: _import(filePath), meta: { requirToken: true, token: getToken() }}]
    }
  } else {
    return {
      path: urlPath,
      component: _import(filePath),
      meta: { requirToken: true, token: getToken() }
    }
  }
}
