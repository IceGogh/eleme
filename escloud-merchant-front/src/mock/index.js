// import Mock from 'mockjs'
// import loginAPI from './login'
// import remoteSearchAPI from './remoteSearch'
// import menuAPI from './menu'
// import userAPI from './userInfo'
// import dictAPI from './dict'
// import sysResourceAPI from './sysResource'
// import privilegeAPI from './privilege'
// import applicationAPI from './application'
// import roleAPI from './role'
// import merchantAPI from './merchant'
// import buttonAPI from './button'
// import groupAPI from './group'
// Mock.setup({
//   timeout: '350-600'
// })
//
// // 登录相关
// Mock.mock(/\/edenep\/plat\/user\/login/, 'post', loginAPI.loginByAccount)
// Mock.mock(/\/edenep\/plat\/user\/logout/, 'post', loginAPI.logout)
//
// // 平台用户相关
// Mock.mock(/\/edenep\/plat\/user\/get/, 'get', userAPI.getUserInfo)
// Mock.mock(/\/edenep\/plat\/user\/list/, 'get', userAPI.getUserInfoList)
// Mock.mock(/\/edenep\/plat\/user\/add/, 'post', userAPI.addUserInfo)
// Mock.mock(/\/edenep\/plat\/user\/edit/, 'post', userAPI.editUserInfo)
// Mock.mock(/\/edenep\/plat\/user\/del/, 'post', userAPI.delUserInfo)
// Mock.mock(/\/edenep\/plat\/user\/del_batch/, 'post', userAPI.delBatchUserInfo)
//
// // 搜索相关
// Mock.mock(/\/search\/user/, 'get', remoteSearchAPI.searchUser)
//
// // 系统菜单相关
// Mock.mock(/\/system\/menuList/, 'get', menuAPI.loadMenuList)
//
// // 数据字典相关
// Mock.mock(/\/system\/dictTree/, 'get', dictAPI.getDictTree)
// Mock.mock(/\/system\/dictEnumList/, 'get', dictAPI.getDictEnumList)
// Mock.mock(/\/system\/allStaticDictMap/, 'get', dictAPI.getAllStaticDictMap)
//
// // 资源相关
// Mock.mock(/\/system\/sysResourceList/, 'get', sysResourceAPI.sysResourceList)
//
// // 权限相关
// Mock.mock(/\/edenep\/plat\/privilege\/list_apps_menus/, 'get', privilegeAPI.listAppsMenus)
//
// // 组相关
// Mock.mock(/\/edenep\/plat\/group\/list_all/, 'get', groupAPI.getGroupTree)
// Mock.mock(/\/edenep\/plat\/group\/list/, 'get', groupAPI.getGroupList)
// Mock.mock(/\/edenep\/plat\/group\/add/, 'post', groupAPI.addGroup)
// Mock.mock(/\/edenep\/plat\/group\/edit/, 'post', groupAPI.editGroup)
// Mock.mock(/\/edenep\/plat\/group\/del/, 'post', groupAPI.delGroup)
// Mock.mock(/\/edenep\/plat\/group\/del_batch/, 'post', groupAPI.delBatchGroup)
// Mock.mock(/\/edenep\/plat\/group\/list_user/, 'get', groupAPI.getGroupUserList)
// Mock.mock(/\/edenep\/plat\/group\/list_user_exclude/, 'get', groupAPI.getGroupExcludeUserList)
// Mock.mock(/\/edenep\/plat\/group\/add_user/, 'post', groupAPI.addUserToGroup)
// Mock.mock(/\/edenep\/plat\/group\/del_user/, 'post', groupAPI.delUserFromGroup)
// Mock.mock(/\/edenep\/plat\/group\/del_batch_user/, 'post', groupAPI.delBatchUserFromGroup)

//
// // 应用管理相关
// Mock.mock(/\/edenep\/plat\/app\/list/, 'get', applicationAPI.getAppList)
// Mock.mock(/\/edenep\/plat\/app\/add/, 'post', applicationAPI.addAppInfo)
// Mock.mock(/\/edenep\/plat\/app\/edit/, 'post', applicationAPI.editAppInfo)
// Mock.mock(/\/edenep\/plat\/app\/del/, 'post', applicationAPI.delAppInfo)
// Mock.mock(/\/edenep\/plat\/app\/del_batch/, 'post', applicationAPI.delAppBatch)
//
// // 角色相关
// // Mock.mock(/\/edenep\/plat\/role\/list/, 'get', roleAPI.getRoleList)
// Mock.mock(/\/edenep\/plat\/role\/add/, 'post', roleAPI.addRole)
// Mock.mock(/\/edenep\/plat\/role\/edit/, 'post', roleAPI.editRole)
// Mock.mock(/\/edenep\/plat\/role\/del/, 'post', roleAPI.delRole)
// Mock.mock(/\/edenep\/plat\/role\/del_batch/, 'post', roleAPI.delBatchRole)
// Mock.mock(/\/edenep\/plat\/role\/list_user/, 'get', roleAPI.getRoleUserList)
// Mock.mock(/\/edenep\/plat\/role\/list_user_exclude/, 'get', roleAPI.getRoleExcludeUserList)
// Mock.mock(/\/edenep\/plat\/role\/add_user/, 'post', roleAPI.addUserToRole)
// Mock.mock(/\/edenep\/plat\/role\/del_user/, 'post', roleAPI.delUserFromRole)
// Mock.mock(/\/edenep\/plat\/role\/del_batch_user/, 'post', roleAPI.delBatchUserFromRole)
//
// // 商户管理相关
// Mock.mock(/\/edenep\/plat\/merchant\/list/, 'get', merchantAPI.getMerchantList)
// Mock.mock(/\/edenep\/plat\/merchant\/add/, 'post', merchantAPI.addMerchant)
// Mock.mock(/\/edenep\/plat\/merchant\/edit/, 'post', merchantAPI.editMerchant)
// Mock.mock(/\/edenep\/plat\/merchant\/del/, 'post', merchantAPI.delMerchant)
// Mock.mock(/\/edenep\/plat\/merchant\/del_batch/, 'post', merchantAPI.delBatchMerchant)
//
// // 菜单管理相关
// Mock.mock(/\/edenep\/plat\/menu\/list/, 'get', menuAPI.getMenuList)
// Mock.mock(/\/edenep\/plat\/menu\/add/, 'post', menuAPI.addMenu)
// Mock.mock(/\/edenep\/plat\/menu\/edit/, 'post', menuAPI.editMenu)
// Mock.mock(/\/edenep\/plat\/menu\/del/, 'post', menuAPI.delMenu)
// Mock.mock(/\/edenep\/plat\/menu\/del_batch/, 'post', menuAPI.delBatchMenu)
// Mock.mock(/\/edenep\/plat\/menu\/list_tree/, 'post', menuAPI.getMenuTree)
//
// // 按钮管理相关
// Mock.mock(/\/edenep\/plat\/button\/list/, 'get', buttonAPI.getButtonList)
// Mock.mock(/\/edenep\/plat\/button\/add/, 'post', buttonAPI.addButton)
// Mock.mock(/\/edenep\/plat\/button\/edit/, 'post', buttonAPI.editButton)
// Mock.mock(/\/edenep\/plat\/button\/del/, 'post', buttonAPI.delButton)
// Mock.mock(/\/edenep\/plat\/button\/del_batch/, 'post', buttonAPI.delBatchButton)
//
// export default Mock
