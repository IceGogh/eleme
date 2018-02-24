import Cookies from 'js-cookie'

const app = {
  state: {
    sidebar: {
      opened: !+Cookies.get('sidebarStatus')
    },
    minimenu: true,
    minimenu2ndStatus: false,
    visitedViews: [],
    applicationCode: '',
    toggleMenuStatus: -1
  },
  mutations: {
    SET_MENUSTATUS: (state, statusNub) => {
      state.toggleMenuStatus = statusNub
    },
    SET_APPLICATIONCODE: (state, code) => {
      state.applicationCode = code
    },
    SET_APPCODE_TO_SESSION: (state, code) => {
      sessionStorage.setItem('EDENEP_APPLICATION_CODE', code)
    },
    MINI_MENU_change: (state, status) => {
      state.minimenu = status
    },
    MINI_MENU2ndStatus_change: state => {
      state.minimenu2ndStatus = !state.minimenu2ndStatus
    },
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
    },
    ADD_VISITED_VIEWS: (state, view) => {
      if (state.visitedViews.every(function(v) {
        return view.path !== v.path
      })) {
        return state.visitedViews.push({
          name: view.name,
          path: view.path
        })
      }
    },
    DEL_VISITED_VIEWS: (state, view) => {
      let index
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.path === view.path) {
          index = i
          break
        }
      }
      state.visitedViews.splice(index, 1)
    }
  },
  actions: {
    ACTION_SET_MENUSTATUS({ commit }, statusNub) {
      commit('SET_MENUSTATUS', statusNub)
    },
    ACTION_SET_APPCODE_TO_SESSION({ commit }, code) {
      commit('SET_APPCODE_TO_SESSION', code)
    },
    ACTION_SET_APPLICATIONCODE({ commit }, code) {
      commit('SET_APPLICATIONCODE', code)
    },
    ToggleSideBar({ commit }) {
      commit('TOGGLE_SIDEBAR')
    },
    addVisitedViews({ commit }, view) {
      commit('ADD_VISITED_VIEWS', view)
    },
    delVisitedViews({ commit, state }, view) {
      return new Promise((resolve) => {
        commit('DEL_VISITED_VIEWS', view)
        resolve([...state.visitedViews])
      })
    }
  }
}

export default app
