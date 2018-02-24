const _import = require('@/router/_import_' + process.env.NODE_ENV)
import Layout from '@/views/plat/layout/Layout'
import { getToken } from '@/utils/auth'
export function registerNewComponent(urlPath, filePath, createCompnentState = false) {
  if (createCompnentState) {
    return {
      path: urlPath,
      component: Layout,
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
