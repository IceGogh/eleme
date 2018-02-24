<template>
  <div class="main-contain-new clearfix">
    <!-- 二三级菜单导航 (不用修改)-->
    <!-- 原 aside部分 封装成 单独组件 <div class="aside" :class="{ 'aside-hidd...-->
    <sidebar-menu></sidebar-menu>

    <!-- main-contain部分-->
    <div class="main-contain-new-inner" :class="{'main-contain-new-inner-all': !minimenu2ndStatus}">
      <!-- main-contain-inner 原 application.vue 结构代码-->
      <template>
        <div class="app-container calendar-list-container">
          <el-row>
            <el-col :span="24" class="privilegeResCss">
              <el-col :span="5">
                <div class="titleArea">
                  <div class="title">角色</div>
                  <div class="searchbox">
                    <i class="el-icon-search"></i>
                    <input type="text" v-model="filterRoleText" placeholder="请输入角色"/>
                  </div>
                </div>
                <el-tree ref="roleTreeId" node-key="id" highlight-current :data="roleTree" :props="roleProps" class="filter-tree" style="height: 778px; padding: 15px; overflow-y: auto;" :filter-node-method="filterRoleNode" @node-click="handleNodeClick"></el-tree>
              </el-col>
              <el-col :span="19" class="rightbox">
                <!--<div style="color:#1f2d3d; padding-left: 20px; line-height: 41px;">-->
                <!--权限列表-->
                <!--</div>-->
                <!--<div style="border-bottom: 1px solid #d1dbe5; border-top: 1px solid #d1dbe5; border-right: 1px solid #d1dbe5; padding-top: 21px;padding-bottom: 16px;">-->
                <div>
                  <div>
                    <el-form>
                      <el-row class="button-group">
                        <el-col :span="24" class="searchBtn">
                          <el-button round type="primary" plain size="small" icon="el-icon-document" @click="updatePrivilege" v-waves>更新权限</el-button>
                        </el-col>
                      </el-row>
                      <el-row class="button-group" v-loading="treeLoadingStatus">
                        <el-tree style="height: 778px; box-sizing: border-box; padding: 20px;" node-key="resNo" :default-checked-keys="checkedTree" ref="resourceId" default-expand-all show-checkbox :data="resourceTree" :props="resProps" :check-strictly="checkStrictly" class="filter-tree privilege-tree"></el-tree>
                      </el-row>
                    </el-form>
                  </div>
                </div>
              </el-col>
            </el-col>

          </el-row>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { getAllRoleList } from '@/api/merchant/work/role'
import { getSysPrivilegeResList, addPrivilege } from '@/api/merchant/work/privilege'
import waves from '@/directive/waves/index.js' // 水波纹指令
import SidebarMenu from '@/views/plat/layout/SidebarMenu'
import { getApplicationCode, getCurProjectCode } from '@/api/common'
export default {
  directives: {
    waves
  },
  computed: {
    minimenu2ndStatus() {
      return this.$store.state.app.minimenu2ndStatus
    }
  },
  data() {
    return {
      curApplicationCode: getApplicationCode(this),
      curProjectCode: getCurProjectCode(),
      treeLoadingStatus: false,
      checkStrictly: true,
      resourceTree: [],
      groupTree: [],
      roleTree: [],
      roleGroupTree: [],
      checkedTree: [],
      listLoading: true,
      filterForm: {
        masterName: '',
        masterValue: ''
      },
      submitForm: {
        masterName: 'group',
        masterValue: '',
        accessName: '',
        accessValue: ''
      },
      filterGroupText: '',
      filterRoleText: '',
      groupProps: {
        children: 'children',
        label: 'groupName'
      },
      roleProps: {
        children: 'children',
        label: 'roleName'
      },
      resProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  components: {
    SidebarMenu
  },
  created() {
    this.loadRoleTree()
  },
  methods: {
    filterRoleNode(value, data) {
      if (!value) return true
      return data.roleName.indexOf(value) !== -1
    },
    tabClick(targetName) {
      this.$refs.resourceId.setCheckedKeys([])
      if (targetName.label === '分组') {
        this.submitForm.masterName = 'group'
      }
      if (targetName.label === '角色') {
        this.submitForm.masterName = 'role'
      }
    },
    loadRoleTree() {
      this.listLoading = true
      this.filterForm.curProjectCode = this.curProjectCode
      getAllRoleList(this.filterForm).then(response => {
        const responseData = response.data
        if (typeof responseData !== 'undefined' && responseData) {
          if (responseData.error_no === 0) {
            this.roleTree = responseData.result
          } else {
            this.$notify({
              title: '错误',
              message: responseData.error_info,
              type: 'error',
              duration: 2000
            })
          }
        } else {
          this.$notify({
            title: '失败',
            message: '请求失败',
            type: 'error',
            duration: 2000
          })
        }
        this.listLoading = false
      })
    },
    loadSysPrivilegeResList() {
      this.listLoading = true
      this.checkedTree = []
      this.treeLoadingStatus = this.checkStrictly = this.$refs.resourceId.store.checkStrictly = true
      this.filterForm.curProjectCode = this.curProjectCode
      this.filterForm.curApplicationCode = this.curApplicationCode
      getSysPrivilegeResList(this.filterForm).then(response => {
        const responseData = response.data
        if (typeof responseData !== 'undefined' && responseData) {
          if (responseData.error_no === 0) {
            this.resourceTree = responseData.result
            this.resourceTree.forEach(item => {
              if (item.checked) {
                if (!this.checkedTree[item.resNo]) {
                  this.checkedTree.push(item.resNo)
                }
              }
              this.filterCheckedTree(item.children)
            })
            const _this = this
            window.setTimeout(function() {
              _this.treeLoadingStatus = false
              _this.checkStrictly = _this.$refs.resourceId.store.checkStrictly = false
            }, 1000)
          } else {
            this.treeLoadingStatus = this.checkStrictly = this.$refs.resourceId.store.checkStrictly = false
            this.$notify({
              title: '错误',
              message: responseData.error_info,
              type: 'error',
              duration: 2000
            })
          }
        } else {
          this.treeLoadingStatus = this.checkStrictly = this.$refs.resourceId.store.checkStrictly = false
          this.$notify({
            title: '失败',
            message: '请求失败',
            type: 'error',
            duration: 2000
          })
        }
        this.listLoading = false
      })
    },
    // filterCheckedTreeback(childrenList) {
    //   childrenList.forEach(item => {
    //     if (item.children.length === 0) {
    //       if (item.checked) {
    //         if (!this.checkedTree[item.resNo]) {
    //           this.checkedTree.push(item.resNo)
    //         }
    //       }
    //     } else {
    //       this.filterCheckedTreeback(item.children)
    //     }
    //   })
    // },
    filterCheckedTree(childrenList) {
      childrenList.forEach(item => {
        if (item.checked) {
          if (!this.checkedTree[item.resNo]) {
            this.checkedTree.push(item.resNo)
          }
        }
        if (item.children.length !== 0) {
          this.filterCheckedTree(item.children)
        }
      })
    },
    handleNodeClick(nodeData) {
      if (typeof nodeData !== 'undefined' && nodeData) {
        if (nodeData.roleName) {
          this.filterForm.masterName = 'role'
          this.filterForm.masterValue = nodeData.roleId
        }
        this.loadSysPrivilegeResList()
      }
    },
    getIndeterminateNode(Node, checkTree) {
      if (Node.length > 0) {
        for (let i = 0; i < Node.length; i++) {
          if (Node[i].indeterminate) {
            checkTree.push(Node[i].data)
            this.getIndeterminateNode(Node[i].childNodes, checkTree)
          }
        }
      }
    },
    updatePrivilege() {
      this.$confirm('此操作将永久更改, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const checkTree = this.$refs.resourceId.getCheckedNodes()
        const ChildrentComponent = this.$refs.resourceId.$children
        for (let i = 0; i < ChildrentComponent.length; i++) {
          if (ChildrentComponent[i].node.indeterminate) {
            checkTree.push(ChildrentComponent[i].node.data)
            this.getIndeterminateNode(ChildrentComponent[i].node.childNodes, checkTree)
          }
        }
        const param = {
          privilege: []
        }
        checkTree.forEach(item => {
          const submitForm = {
            masterName: this.filterForm.masterName,
            masterValue: this.filterForm.masterValue,
            accessName: item.type,
            accessValue: item.resNo
          }
          param.privilege.push(submitForm)
        })
        param.privilege = JSON.stringify(param.privilege)
        param.masterName = this.filterForm.masterName
        param.masterValue = this.filterForm.masterValue
        param.curApplicationCode = this.curApplicationCode
        addPrivilege(param).then(response => {
          const responseData = response.data
          if (typeof responseData !== 'undefined' && responseData) {
            if (responseData.error_no === 0) {
              this.$notify({
                title: '成功',
                message: responseData.error_info,
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '错误',
                message: responseData.error_info,
                type: 'error',
                duration: 2000
              })
            }
          } else {
            this.$notify({
              title: '失败',
              message: '请求失败',
              type: 'error',
              duration: 2000
            })
          }
          this.listLoading = false
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  },
  watch: {
    filterRoleText(val) {
      this.$refs.roleTreeId.filter(val)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
  .privilegeResCss {
    box-shadow: rgba(0, 0, 0, 0.12) 0px 2px 4px 0px, rgba(0, 0, 0, 0.04) 0px 0px 6px 0px;
    padding: 20px;
    .privilege-tree{
      overflow-y: auto;
    }
    .el-tabs--border-card{
      box-shadow: none;
      border: none;
      background: inherit;
    }
    .el-tabs__content {
      margin: 0!important;
      padding-top: 0;
    }
    .el-tabs__header {
      margin: 16px 16px 8px!important;
    }
    .rightbox {
      padding: 20px 0 0 20px;
    }
    .titleArea {
      position: relative;
      width: 100%;
      height: 53px;
      padding: 10px 0;
      box-sizing: border-box;
      .title {
        float: left;
        padding: 0 10px;
        height: 33px;
        line-height: 33px;
        background: #eee;
      }
      .searchbox {
        float: right;
        width: 60%;
        overflow: hidden;
        height: 33px;
        padding: 0 10px;
        position: relative;
        input {
          border: none;
          position: absolute;
          left: 0;
          top: 3px;
          width: 100%;
          height: 28px;
          line-height: 28px;
          background: inherit;
          border-bottom: 1px #a7a7a7 solid;
          outline: none;
        }
        i {
          position: absolute;
          top: 3px;
          right: 0;
          z-index: 10;
          height: 28px;
          width: 28px;
          cursor: pointer;
        }
        i:before {
          font-size: 23px;
          color: #a7a7a7;
        }
      }
    }
  }
</style>
