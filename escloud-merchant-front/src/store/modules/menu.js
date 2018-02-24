import { loadMenuList } from '@/api/plat/system'

const menu = {
  state: {
    tableTree: []
  },
  mutations: {
    SET_SYSTEM_MENUS: (state, data) => {
      state.tableTree = data
    }
  },
  actions: {
    // 获取菜单信息
    LoadMenuList({ commit, state }) {
      return new Promise((resolve, reject) => {
        loadMenuList(state.token).then(response => {
          const data = response.data
          commit('SET_SYSTEM_MENUS', data.tableTree)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default menu
