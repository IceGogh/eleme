export const InfoGroup = {
  state: {
    CityList: []
  },
  mutations: {
    SET_CITY: (state, payload) => {
      state.CityList = payload
    }
  }
}
