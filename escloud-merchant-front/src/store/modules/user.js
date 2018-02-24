import { getUserInfo } from '@/api/plat/userInfo'
import {
  loginByAccount,
  logout,
  queryAppsMenuList
} from '@/api/plat/login'
import {
  getToken,
  setToken,
  removeToken,
  getUserId,
  setUserId,
  removeUserId,
  getMerchantId,
  setMerchantId,
  removeMerchantId
} from '@/utils/auth'

const user = {
  state: {
    simpleRole: '',
    curprojectcode: '',
    userToken: getToken(),
    userId: getUserId(),
    merchantId: getMerchantId(),
    userInfo: {},
    appsMenuList: []
  },

  mutations: {
    SET_USER_SIMPLEROLE: (state, simpleRole) => {
      state.simpleRole = simpleRole
      sessionStorage.setItem('EDENEP_SYSTEM_SIMPLEROLE', simpleRole)
    },
    SET_CURPROJECTCODE: (state, curprojectcode) => {
      state.curprojectcode = curprojectcode
      sessionStorage.setItem('EDENEP_CURPROJECTCODE', curprojectcode)
    },
    SET_USER_TOKEN: (state, userToken) => {
      state.userToken = userToken
    },
    SET_USER_ID: (state, userId) => {
      state.userId = userId
    },
    SET_MERCHANT_ID: (state, merchantId) => {
      state.merchantId = merchantId
    },
    SET_USER_INFO: (state, userInfo) => {
      state.userInfo = userInfo
    },
    SET_APPS_MENU_LIST: (state, appsMenuList) => {
      state.appsMenuList = appsMenuList
    }
  },

  actions: {
    // 用户登录
    UserLogin({ commit }, params) {
      return new Promise((resolve, reject) => {
        loginByAccount(params).then(response => {
          const resultData = response.data
          //  根据登录 返回的权限  是否为单一权限用户  设置全局状态，  在  permission中 控制路由直接跳转 环卫工作台
          if (resultData.result.userInfo.userName === '田高') {
            commit('SET_USER_SIMPLEROLE', 1)
          }
          //  根据 是否为单一项目用户    设置全局状态  在 permission中 控制路由直接跳转 项目首页
          // if (resultData.result.userInfo.curProjectCode) {
          commit('SET_CURPROJECTCODE', 'c457e93b2b1d495db0e497b07701ecfa')
          // }
          if (typeof resultData !== undefined && resultData.error_no === 0) {
            commit('SET_USER_TOKEN', resultData.result.userToken)
            setToken(resultData.result.userToken)
            commit('SET_USER_ID', resultData.result.userInfo.userId)
            setUserId(resultData.result.userInfo.userId)
            commit('SET_MERCHANT_ID', resultData.result.userInfo.merchantId)
            setMerchantId(resultData.result.userInfo.merchantId)
            sessionStorage.setItem('EDENEP_SYSTEM_USERNAME', resultData.result.userInfo.userName)
            resolve(response)
          } else {
            throw new Error('登录输入err:', resultData.error_info)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        const params = {
          curMerchantId: state.merchantId,
          curUserId: state.userId,
          userToken: state.userToken,
          merchantId: state.merchantId,
          userId: state.userId
        }
        getUserInfo(params).then(response => {
          const resultData = response.data
          if (typeof resultData !== undefined && resultData.error_no === 0) {
            commit('SET_USER_INFO', resultData.result)
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户拥有模块和菜单
    GetAppsMenuList({ commit, state }) {
      return new Promise((resolve, reject) => {
        const params = {
          curMerchantId: state.merchantId,
          curUserId: state.userId,
          userToken: state.userToken,
          merchantId: state.merchantId,
          userId: state.userId
        }
        queryAppsMenuList(params).then(response => {
          const resultData = response.data
          if (typeof resultData !== undefined && resultData.error_no === 0) {
            commit('SET_APPS_MENU_LIST', resultData.result)
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_USER_TOKEN', '')
          commit('SET_USER_ID', '')
          commit('SET_MERCHANT_ID', '')
          commit('SET_USER_SIMPLEROLE', '')
          commit('SET_CURPROJECTCODE', '')
          removeToken()
          removeUserId()
          removeMerchantId()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_USER_TOKEN', '')
        commit('SET_USER_ID', '')
        commit('SET_MERCHANT_ID', '')
        commit('SET_USER_SIMPLEROLE', '')
        removeToken()
        removeUserId()
        removeMerchantId()
        resolve()
      })
    },

    // 动态修改权限
    ChangeRole({ commit }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getUserInfo(role).then(response => {
          const data = response.data
          commit('SET_ROLES', data.role)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          resolve()
        })
      })
    }
  }
}

export default user
