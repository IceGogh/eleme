const getters = {
  sidebar: state => state.app.sidebar,
  visitedViews: state => state.app.visitedViews,
  userToken: state => state.user.userToken,
  userId: state => state.user.userId,
  merchantId: state => state.user.merchantId,
  userInfo: state => state.user.userInfo,
  appsMenuList: state => state.user.appsMenuList,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  tableTree: state => state.menu.tableTree
}
export default getters
