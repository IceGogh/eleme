<template>
<div class="app-container calendar-list-container">
  <el-row>
    <el-col :span="5">
      <el-tabs type="border-card" @tab-click="tabClick">
        <el-tab-pane label="用户">
          <el-input placeholder="输入关键字进行过滤" v-model="filterGroupText"></el-input>
          <el-tree ref="groupTreeId" node-key="id" highlight-current :data="groupTree" :props="groupProps" class="filter-tree" :filter-node-method="filterGroupNode" @node-click="handleNodeClick" style="height: 648px"></el-tree>
        </el-tab-pane>
        <el-tab-pane label="角色">
          <el-input placeholder="输入关键字进行过滤" v-model="filterRoleText"></el-input>
          <el-tree ref="roleTreeId" node-key="id" highlight-current :data="roleTree" :props="roleProps" class="filter-tree" :filter-node-method="filterRoleNode" @node-click="handleNodeClick" style="height: 647px"></el-tree>
        </el-tab-pane>
      </el-tabs>
    </el-col>
    <el-col :span="19">
      <!--<div style="color:#1f2d3d; border-top: 1px solid #d1dbe5; border-right: 1px solid #d1dbe5; padding-left: 20px; line-height: 29px;">-->
        <!--分组管理-->
      <!--</div>-->
      <div style="color:#1f2d3d; padding-left: 20px; line-height: 29px;">
        分组管理
      </div>
      <div class="filter-container" style="margin-top: 10px;">
        <el-form :model="filterForm" ref="filterForm">
          <div>
            <el-row>
              <el-col :span="11">
                <el-form-item label="用户ID" :label-width="filterFormLabelWidth" prop="userId" class="form-bottom">
                  <el-input @keyup.enter.native="searchUserInfo"  size="small" class="filter-item" placeholder="用户ID" v-model="filterForm.userId">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="商户" :label-width="filterFormLabelWidth" prop="merchantId" class="form-bottom">
                  <el-select @keyup.enter.native="searchUserInfo" size="small" class="filter-item" clearable placeholder="商户" v-model="filterForm.merchantId">
                    <el-option v-for="item in merchantIdArr" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="姓名" :label-width="filterFormLabelWidth" prop="userName" class="form-bottom">
                  <el-input @keyup.enter.native="searchUserInfo" size="small" class="filter-item" placeholder="姓名" v-model="filterForm.userName">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="联系方式" :label-width="filterFormLabelWidth" prop="phone" class="form-bottom">
                  <el-input @keyup.enter.native="searchUserInfo" size="small" class="filter-item" placeholder="联系方式" v-model="filterForm.phone">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="button-group">
              <el-col :span="12" class="searchSimpleBtn">
                <el-form-item label=" " :label-width="filterFormLabelWidth" class="form-bottom">
                  <el-button round type="primary" size="small" icon="el-icon-search" @click="searchUserInfo" v-waves>搜索</el-button>
                  <el-button round type="primary" plain size="small" icon="el-icon-delete" @click="resetSearch" v-waves>清空</el-button>
                </el-form-item>
              </el-col>
              <el-col :span="12" class="searchProBtn">
                <el-button round type="primary" plain size="small" icon="el-icon-document" @click="handleDownload" :loading="downloadLoading">导出</el-button>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </div>
      <!--<div style="height: 652px; border-bottom: 1px solid #d1dbe5; border-top: 1px solid #d1dbe5; border-right: 1px solid #d1dbe5; padding: 20px;">-->
      <div style="margin: 0 20px; padding: 20px; box-shadow: 0 0 0.06rem rgba(117, 208, 255, 0.6);">
        <el-table ref="multipleTable" :key='tableKey' :data="list" fit highlight-current-row size='mini' :default-sort="{prop: 'id', order: 'aescending'}" @select="selectCheckBox" @select-all="selectAllCheckBox" v-loading="listLoading" element-loading-text="给我一点时间"
          style="width: 100%" height="400">
          <el-table-column show-overflow-tooltip type="selection" width="50"></el-table-column>
          <el-table-column show-overflow-tooltip type="index" width="62"></el-table-column>
          <el-table-column show-overflow-tooltip header-align="center" align="center" label="" prop='id' v-if=false sortable>
            <template slot-scope="scope">
              <span>{{scope.row.id}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip header-align="center" align="center" label="商户" prop='merchantId'>
            <template slot-scope="scope">
              <span>{{merchantIdMap[scope.row.merchantId]}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip header-align="center" align="center" label="用户ID" prop='userId'>
            <template slot-scope="scope">
              <span>{{scope.row.userId}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip header-align="center" align="center" label="姓名" prop='userName'>
            <template slot-scope="scope">
              <span>{{scope.row.userName}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip header-align="center" align="center" label="联系方式" prop='phone'>
            <template slot-scope="scope">
              <span>{{scope.row.phone}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip align="center" label="操作" width="240" fixed='right'>
            <template slot-scope="scope">
              <el-button round size="small" type="text" @click="deleteUser(scope.row,'delete')">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div v-show="!listLoading" class="pagination-container">
          <el-row>
            <el-col :span="7">
              <el-button round type="info" plain size="small" :disabled="isAddUserFlag" icon="el-icon-edit" @click="addUser">添加</el-button>
              <el-button round type="info" plain size="small" :disabled="isBatch" icon="el-icon-delete" @click="deleteBatch">批量删除</el-button>
            </el-col>
            <el-col :span="17">
              <el-pagination @size-change="pageSizeChange" @current-change="currentPageChange" :current-page.sync="filterForm.current" :page-sizes="pageSize" :page-size="filterForm.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
              </el-pagination>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-col>
  </el-row>
  <el-dialog center class="create_dialog" title="添加用户" :visible.sync="dialogFormVisible" size="small">
    <div class="filter-container">
      <el-form :model="dialogFilterForm" ref="filterForm">
        <el-row>
          <el-col :span="11">
            <el-form-item label="用户ID" :label-width="filterFormLabelWidth" prop="userId" class="form-bottom">
              <el-input @keyup.enter.native="dialogSearchUserInfo" size="small"  class="filter-item" placeholder="用户ID" v-model="dialogFilterForm.userId">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="商户" :label-width="filterFormLabelWidth" prop="merchantId" class="form-bottom">
              <el-select @keyup.enter.native="dialogSearchUserInfo" size="small" class="filter-item" clearable placeholder="商户" v-model="filterForm.merchantId">
                <el-option v-for="item in merchantIdArr" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="姓名" :label-width="filterFormLabelWidth" prop="userName" class="form-bottom">
              <el-input @keyup.enter.native="dialogSearchUserInfo" size="small" class="filter-item" placeholder="姓名" v-model="dialogFilterForm.userName">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="联系方式" :label-width="filterFormLabelWidth" prop="phone" class="form-bottom">
              <el-input @keyup.enter.native="dialogSearchUserInfo" size="small" class="filter-item" placeholder="联系方式" v-model="dialogFilterForm.phone">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="button-group">
          <el-col :span="12" class="searchSimpleBtn">
            <el-form-item label=" " :label-width="filterFormLabelWidth" class="form-bottom">
              <el-button round type="primary" size="small" icon="el-icon-search" @click="dialogSearchUserInfo" v-waves>搜索</el-button>
              <el-button round type="primary" plain size="small" icon="el-icon-delete" @click="dialogResetSearch" v-waves>清空</el-button>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12" class="searchProBtn">
            <el-button round type="primary" plain size="small" icon="el-icon-document" @click="handleDownload" :loading="downloadLoading">导出</el-button>
          </el-col> -->
        </el-row>
      </el-form>
    </div>
    <el-table ref="dialogMultipleTable" :key='dialogTableKey' :data="dialogList" stripe fit highlight-current-row size='mini' :default-sort="{prop: 'id', order: 'aescending'}" @select="dialogSelectCheckBox" @select-all="dialogSelectAllCheckBox" v-loading="dialogListLoading" element-loading-text="给我一点时间"
      style="width: 100%" height="280">
      <el-table-column show-overflow-tooltip type="selection" width="50"></el-table-column>
      <el-table-column show-overflow-tooltip type="index" width="62"></el-table-column>
      <el-table-column show-overflow-tooltip header-align="center" align="center" label="" prop='id' v-if=false sortable>
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip header-align="center" align="center" label="商户ID" prop='merchantId'>
        <template slot-scope="scope">
          <span>{{merchantIdMap[scope.row.merchantId]}}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip header-align="center" align="center" label="用户ID" prop='userId'>
        <template slot-scope="scope">
          <span>{{scope.row.userId}}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip header-align="center" align="center" label="姓名" prop='userName'>
        <template slot-scope="scope">
          <span>{{scope.row.userName}}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip header-align="center" align="center" label="联系方式" prop='phone'>
        <template slot-scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!dialogListLoading" class="pagination-container">
      <el-row>
        <el-col :span="24">
          <el-pagination @size-change="dialogPageSizeChange" @current-change="dialogCurrentPageChange" :current-page.sync="dialogFilterForm.current" :page-sizes="pageSize" :page-size="dialogFilterForm.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="dialogTotal">
          </el-pagination>
        </el-col>
      </el-row>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button round @click="dialogFormVisible = false">取 消</el-button>
      <el-button round type="primary" @click="addSubmit" :disabled="dialogIsBatch">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import {
  getGroupTree,
  getGroupUserList,
  getGroupExcludeUserList,
  addUserToGroup,
  delUserFromGroup,
  delBatchUserFromGroup
} from '@/api/plat/group'
import {
  getRoleUserList,
  getRoleExcludeUserList,
  addUserToRole,
  delUserFromRole,
  delBatchUserFromRole
} from '@/api/plat/role'
import {
  queryNameIdDic
} from '@/api/plat/merchant'
import { getRoleTree } from '@/api/plat/role'
import { globalConfig } from '@/globalConfig'
import waves from '@/directive/waves/index.js'

export default {
  name: 'tableGroup',
  directives: {
    waves
  },
  data() {
    return {
      groupTree: [],
      roleTree: [],
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
      filterFormLabelWidth: '100px',
      downloadLoading: false,
      filterForm: {
        privilegeId: '',
        merchantId: '',
        userId: '',
        userName: '',
        phone: '',
        current: globalConfig.startPage,
        pageSize: globalConfig.initPageSize
      },
      list: [],
      tableKey: 0,
      isBatch: true,
      isAddUserFlag: true,
      listLoading: true,
      total: 0,
      pageSize: globalConfig.pageSize,
      submitForm: {
        submitType: '0',
        id: '',
        merchantId: ''
      },
      merchantIdMap: {},
      merchantIdArr: [],
      dialogFormVisible: false,
      dialogList: [],
      dialogTableKey: 0,
      dialogListLoading: true,
      dialogTotal: 0,
      dialogIsBatch: true,
      dialogFilterForm: {
        groupId: '',
        roleId: '',
        merchantId: '',
        userId: '',
        userName: '',
        phone: '',
        current: globalConfig.startPage,
        pageSize: globalConfig.initPageSize
      }
    }
  },
  watch: {
    filterGroupText(val) {
      this.$refs.groupTreeId.filter(val)
    },
    filterRoleText(val) {
      this.$refs.roleTreeId.filter(val)
    }
  },
  created() {
    this.loadGroupTree()
    this.loadRoleTree()
    this.getMerchantDis()
  },
  methods: {
    getMerchantDis() {
      queryNameIdDic({}).then(response => {
        if (response.data.error_no === 0) {
          this.nameIdMapArrTemp = response.data.result
          for (const index of this.nameIdMapArrTemp) {
            const indexTemp = {}
            indexTemp.label = index.merchantName
            indexTemp.value = index.merchantId
            this.merchantIdArr.push(indexTemp)
            this.merchantIdMap[index.merchantId] = index.merchantName
          }
        } else {
          this.$message(response.data.error_info)
        }
      })
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
    filterGroupNode(value, data) {
      if (!value) return true
      return data.groupName.indexOf(value) !== -1
    },
    filterRoleNode(value, data) {
      if (!value) return true
      return data.roleName.indexOf(value) !== -1
    },
    tabClick(targetName) {
      this.submitForm.submitType = targetName.index
      this.submitForm.id = ''
      this.submitForm.merchantId = ''
      this.list = []
      this.total = 0
      this.isBatch = true
      this.isAddUserFlag = true
    },
    handleNodeClick(nodeData) {
      this.resetSearch()
      this.submitForm.id = nodeData.id
      this.isBatch = true
      this.isAddUserFlag = false
      // this.submitForm.merchantId = nodeData.merchantId
      this.getUserInfoList()
    },
    searchUserInfo() {
      this.filterForm.current = globalConfig.startPage
      this.getUserInfoList()
    },
    resetSearch() {
      this.filterForm = {
        privilegeId: '',
        merchantId: '',
        userId: '',
        userName: '',
        phone: '',
        current: globalConfig.startPage,
        pageSize: globalConfig.initPageSize
      }
    },
    handleDownload() {
      this.downloadLoading = true
      require.ensure([], () => {
        const {
          export_json_to_excel
        } = require('vendor/Export2Excel')
        const tHeader = [
          'ID',
          '商户ID',
          '用户ID',
          '姓名',
          '联系方式',
          '创建者',
          '创建时间'
        ]
        const filterVal = [
          'id',
          'merchantId',
          'userId',
          'userName',
          'phone',
          'createBy',
          'createDate'
        ]
        const list = this.list
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, '平台用户')
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    selectCheckBox(selection, row) {
      if (selection.length === 0) {
        this.isBatch = true
      } else {
        this.isBatch = false
      }
    },
    selectAllCheckBox(selection) {
      if (selection.length === 0) {
        this.isBatch = true
      } else {
        this.isBatch = false
      }
    },
    pageSizeChange(val) {
      this.isBatch = true
      this.filterForm.current = globalConfig.startPage
      this.filterForm.pageSize = val
      this.getUserInfoList()
    },
    currentPageChange(val) {
      this.isBatch = true
      this.filterForm.current = val
      this.getUserInfoList()
    },
    getUserInfoList() {
      this.isBatch = true
      if (this.submitForm.submitType === '0') {
        this.listLoading = true
        this.filterForm.privilegeId = this.submitForm.id
        getGroupUserList(this.filterForm).then(response => {
          if (response.data.error_no === 0) {
            this.list = response.data.result.records
            this.total = response.data.result.total
          } else {
            this.$message(response.data.error_info)
          }
          this.listLoading = false
        })
      } else if (this.submitForm.submitType === '1') {
        this.listLoading = true
        this.filterForm.privilegeId = this.submitForm.id
        getRoleUserList(this.filterForm).then(response => {
          if (response.data.error_no === 0) {
            this.list = response.data.result.records
            this.total = response.data.result.total
          } else {
            this.$message(response.data.error_info)
          }
          this.listLoading = false
        })
      }
    },
    deleteUser(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.submitForm.submitType === '0') {
          const param = {
            primaryKey: row.id,
            groupId: this.filterForm.groupId
          }
          this.listLoading = true
          delUserFromGroup(param).then(response => {
            if (response.data.error_no === 0) {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
              this.searchUserInfo()
              this.$refs.multipleTable.clearSelection()
            } else {
              this.$message(response.data.error_info)
            }
            this.listLoading = false
          })
        } else if (this.submitForm.submitType === '1') {
          const param = {
            primaryKey: row.id,
            roleId: this.filterForm.roleId
          }
          this.listLoading = true
          delUserFromRole(param).then(response => {
            if (response.data.error_no === 0) {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
              this.searchUserInfo()
              this.$refs.multipleTable.clearSelection()
            } else {
              this.$message(response.data.error_info)
            }
            this.listLoading = false
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteBatch() {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.submitForm.submitType === '0') {
          const selection = this.$refs.multipleTable.selection
          const selectIds = []
          for (var i = 0; i < selection.length; i++) {
            selectIds.push(selection[i].id)
          }
          const param = {
            primaryKeys: selectIds,
            groupId: this.filterForm.groupId
          }
          this.listLoading = true
          delBatchUserFromGroup(param).then(response => {
            if (response.data.error_no === 0) {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
              this.searchUserInfo()
              this.$refs.multipleTable.clearSelection()
            } else {
              this.$message(response.data.error_info)
            }
            this.listLoading = false
          })
        } else if (this.submitForm.submitType === '1') {
          const selection = this.$refs.multipleTable.selection
          const selectIds = []
          for (let i = 0; i < selection.length; i++) {
            selectIds.push(selection[i].id)
          }
          const param = {
            primaryKeys: selectIds,
            roleId: this.filterForm.roleId
          }
          this.listLoading = true
          delBatchUserFromRole(param).then(response => {
            if (response.data.error_no === 0) {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
              this.searchUserInfo()
              this.$refs.multipleTable.clearSelection()
            } else {
              this.$message(response.data.error_info)
            }
            this.listLoading = false
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    addUser() {
      this.dialogResetSearch()
      this.dialogFormVisible = true
      this.dialogSearchUserInfo()
    },
    dialogResetSearch() {
      this.dialogIsBatch = true
      this.dialogFilterForm = {
        groupId: '',
        roleId: '',
        merchantId: '',
        userId: '',
        userName: '',
        phone: '',
        current: globalConfig.startPage,
        pageSize: globalConfig.initPageSize
      }
      if (this.$refs['dialogFilterForm'] !== undefined) {
        this.$refs['dialogFilterForm'].resetFields()
      }
    },
    dialogSelectCheckBox(selection, row) {
      if (selection.length === 0) {
        this.dialogIsBatch = true
      } else {
        this.dialogIsBatch = false
      }
    },
    dialogSelectAllCheckBox(selection) {
      if (selection.length === 0) {
        this.dialogIsBatch = true
      } else {
        this.dialogIsBatch = false
      }
    },
    dialogSearchUserInfo() {
      this.dialogFilterForm.current = globalConfig.startPage
      this.getDialogUserInfoList()
    },
    getDialogUserInfoList() {
      this.dialogIsBatch = true
      if (this.submitForm.submitType === '0') {
        this.dialogListLoading = true
        this.dialogFilterForm.groupId = this.submitForm.id
        getGroupExcludeUserList(this.dialogFilterForm).then(response => {
          if (response.data.error_no === 0) {
            this.dialogList = response.data.result.records
            this.dialogTotal = response.data.result.total
          } else {
            this.$message(response.data.error_info)
          }
          this.dialogListLoading = false
        })
      } else if (this.submitForm.submitType === '1') {
        this.dialogListLoading = true
        this.dialogFilterForm.roleId = this.submitForm.id
        getRoleExcludeUserList(this.dialogFilterForm).then(response => {
          if (response.data.error_no === 0) {
            this.dialogList = response.data.result.records
            this.dialogTotal = response.data.result.total
          } else {
            this.$message(response.data.error_info)
          }
          this.dialogListLoading = false
        })
      }
    },
    dialogPageSizeChange(val) {
      this.dialogIsBatch = true
      this.dialogFilterForm.current = globalConfig.startPage
      this.dialogFilterForm.pageSize = val
      this.getDialogUserInfoList()
    },
    dialogCurrentPageChange(val) {
      this.dialogIsBatch = true
      this.dialogFilterForm.current = val
      this.getDialogUserInfoList()
    },
    addSubmit() {
      if (this.submitForm.submitType === '0') {
        const selection = this.$refs.dialogMultipleTable.selection
        const selectIds = []
        for (let i = 0; i < selection.length; i++) {
          selectIds.push(selection[i].userId)
        }
        const param = {
          userIds: selectIds,
          groupId: this.filterForm.privilegeId
        }
        addUserToGroup(param).then(response => {
          if (response.data.error_no === 0) {
            this.$notify({
              title: '成功',
              message: '添加成功',
              type: 'success',
              duration: 2000
            })
            this.dialogFormVisible = false
            this.searchUserInfo()
          } else {
            this.$message(response.data.error_info)
          }
        })
      } else if (this.submitForm.submitType === '1') {
        const selection = this.$refs.dialogMultipleTable.selection
        const selectIds = []
        for (let i = 0; i < selection.length; i++) {
          selectIds.push(selection[i].userId)
        }
        const param = {
          userIds: selectIds,
          roleId: this.filterForm.privilegeId
        }
        addUserToRole(param).then(response => {
          if (response.data.error_no === 0) {
            this.$notify({
              title: '成功',
              message: '添加成功',
              type: 'success',
              duration: 2000
            })
            this.dialogFormVisible = false
            this.searchUserInfo()
          } else {
            this.$message(response.data.error_info)
          }
        })
      }
    }
  }
}
</script>
