<template>
<div class="app-container calendar-list-container">
  <el-row>
    <el-col :span="5">
      <el-tabs type="border-card" @tab-click="tabClick">
        <el-tab-pane label="分组">
          <el-input placeholder="输入关键字进行过滤" v-model="filterGroupText"></el-input>
          <el-tree ref="groupTreeId" node-key="id" highlight-current :data="groupTree" :props="groupProps" class="filter-tree" style="height: 647px;" :filter-node-method="filterGroupNode" @node-click="handleNodeClick"></el-tree>
        </el-tab-pane>
        <el-tab-pane label="角色">
          <el-input placeholder="输入关键字进行过滤" v-model="filterRoleText"></el-input>
          <el-tree ref="roleTreeId" node-key="id" highlight-current :data="roleTree" :props="roleProps" class="filter-tree" style="height: 647px;" :filter-node-method="filterRoleNode" @node-click="handleNodeClick"></el-tree>
        </el-tab-pane>
      </el-tabs>
    </el-col>
    <el-col :span="19">
      <!--<div style="color:#1f2d3d; padding-left: 20px; line-height: 41px;">-->
        <!--权限列表-->
      <!--</div>-->
      <!--<div style="border-bottom: 1px solid #d1dbe5; border-top: 1px solid #d1dbe5; border-right: 1px solid #d1dbe5; padding-top: 21px;padding-bottom: 16px;">-->
      <div>
        <div class="simpleFilter" style="margin-top: 0;">
          <el-form>
            <el-row class="button-group">
              <el-col :span="24" class="searchBtn">
                <el-button round type="primary" plain size="small" icon="el-icon-document" @click="updatePrivilege" v-waves>更新权限</el-button>
              </el-col>
            </el-row>
            <el-row class="button-group" v-loading="treeLoadingStatus">
              <el-tree node-key="resNo" :default-checked-keys="checkedTree" ref="resourceId" default-expand-all show-checkbox :data="resourceTree" :props="resProps" :check-strictly="checkStrictly" class="filter-tree privilege-tree"></el-tree>
            </el-row>
          </el-form>
        </div>
      </div>
    </el-col>
  </el-row>
</div>
</template>

<script>
import { getGroupTree } from '@/api/plat/group'
import { getRoleTree } from '@/api/plat/role'
import { getSysPrivilegeResList, addPrivilege } from '@/api/plat/system'
import waves from '@/directive/waves/index.js' // 水波纹指令
export default {
  directives: {
    waves
  },
  data() {
    return {
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
  created() {
    this.loadGroupTree()
    this.loadRoleTree()
  },
  methods: {
    filterGroupNode(value, data) {
      if (!value) return true
      return data.groupName.indexOf(value) !== -1
    },
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
    loadGroupTree() {
      this.listLoading = true
      getGroupTree(this.filterForm).then(response => {
        const responseData = response.data
        if (typeof responseData !== 'undefined' && responseData) {
          if (responseData.error_no === 0) {
            this.groupTree = responseData.result
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
    loadRoleTree() {
      this.listLoading = true
      getRoleTree(this.filterForm).then(response => {
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
        if (nodeData.groupName) {
          this.filterForm.masterName = 'group'
          this.filterForm.masterValue = nodeData.id
        }
        if (nodeData.roleName) {
          this.filterForm.masterName = 'role'
          this.filterForm.masterValue = nodeData.id
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
    filterGroupText(val) {
      this.$refs.groupTreeId.filter(val)
    },
    filterRoleText(val) {
      this.$refs.roleTreeId.filter(val)
    }
  }
}
</script>
<style>
.privilege-tree{
  overflow-y: auto;
}
</style>
