<template>
  <div class="main-contain-new clearfix">
    <!-- 菜单导航-->
    <sidebar-menu></sidebar-menu>

    <!-- main-contain部分-->
    <div class="main-contain-new-inner" :class="{'main-contain-new-inner-all': !minimenu2ndStatus}">
      <!-- 操作栏 （添加、搜索按钮 根据需要写入）-->
      <div class="option-bar">
        <el-button type="edenep-blue-btn" icon="el-icon-circle-plus-outline" class="add-btn" @click="addChildAdmin">添加子管理员</el-button>
        <div class="searchBox">
          <input type="text" class="search" placeholder="请输入关键词查询" v-model="filterForm.searchWord" @keyup.enter="searchChildAdmin" />
          <i class="el-icon-search" @click="searchChildAdmin"></i>
        </div>
      </div>

      <template>
        <div>
          <div class="app-container calendar-list-container">

            <el-table ref="multipleTable" :key='tableKey' :data="list" fit highlight-current-row size='mini' :default-sort="{prop: 'id', order: 'aescending'}" @select="selectCheckBox" @select-all="selectAllCheckBox" v-loading="listLoading" element-loading-text="给我一点时间"
              style="width: 100%">
              <el-table-column type="selection" width="50"></el-table-column>
              <el-table-column header-align="center" align="center" label="用户账号" prop='userAccount'>
                <template slot-scope="scope">
                  <span>{{scope.row.userAccount}}</span>
                </template>
              </el-table-column>
              <el-table-column header-align="center" align="center" label="姓名" prop='userName'>
                <template slot-scope="scope">
                  <span>{{scope.row.userName}}</span>
                </template>
              </el-table-column>
              <el-table-column header-align="center" align="center" label="下属项目" prop='userName'>
                <template slot-scope="scope">
                  <span v-for="(item, i) in scope.row.projectList">{{item.projectName}} <br v-if="i < scope.row.projectList.length - 1"> </span>
                </template>
              </el-table-column>
              <el-table-column header-align="center" align="center" label="联系方式" prop='phone'>
                <template slot-scope="scope">
                  <span>{{scope.row.phone}}</span>
                </template>
              </el-table-column>
              <el-table-column header-align="center" align="center" label="创建时间" prop='createDate'>
                <template slot-scope="scope">
                  <span>{{scope.row.createDate}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作" width="200">
                <template slot-scope="scope">
                  <el-button size="small" type="text" @click="modifyChildAdmin(scope.row,'update')">修改
                  </el-button>|
                  <el-button size="small" type="text" @click="deleteChildAdmin(scope.row,'delete')">删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <div v-show="!listLoading" class="pagination-container">
              <el-row>
                <el-col :span="12">
                  <el-button type="info" plain size="small" :disabled="isBatch" icon="delete" @click="deleteBatch">批量删除</el-button>
                </el-col>
                <el-col :span="12">
                  <el-pagination @size-change="pageSizeChange" @current-change="currentPageChange" :current-page.sync="filterForm.current" :page-sizes="pageSize" :page-size="filterForm.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                  </el-pagination>
                </el-col>
              </el-row>
            </div>

            <el-dialog class="create_dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" size="small" :before-close="closeDialog">
              <el-form :model="userInfoForm" :rules="userInfoFormRules" ref="userInfoForm" label-width="80px">
                <el-row>
                  <el-col :span="11">
                    <el-form-item label="姓名" :label-width="formLabelWidth" prop="userName">
                      <el-input size="small" v-model="userInfoForm.userName" :maxlength="50"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="用户账号" :label-width="formLabelWidth" prop="userAccount">
                      <el-input size="small" v-model="userInfoForm.userAccount" :maxlength="11"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="11">
                    <el-form-item label="用户密码" :label-width="formLabelWidth" prop="passWord">
                      <el-input size="small" type="password"   v-model="userInfoForm.passWord" :maxlength="11"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="联系方式" :label-width="formLabelWidth" prop="phone">
                      <el-input size="small" v-model="userInfoForm.phone" :maxlength="11"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="closeDialog">取 消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" @click="addSubmit">确 定</el-button>
                <el-button v-else type="primary" @click="updateSubmit">确 定</el-button>
              </div>
            </el-dialog>
          </div>
        </div>
      </template>
    </div>
</div>
</template>
<script>
import {
  getChildAdminList,
  addChildAdmin,
  editChildAdmin,
  deleteChildAdmin,
  deleteBatchChildAdmin
} from '@/api/merchant/auth/childAdminManage'

import {
  globalConfig
} from '@/globalConfig'
import waves from '@/directive/waves/index.js'

import { getApplicationCode, getDicts } from '@/api/common'
import SidebarMenu from '@/views/plat/layout/SidebarMenu'

export default {
  name: 'tableUserInfo',
  directives: {
    waves
  },
  components: {
    'sidebar-menu': SidebarMenu
  },
  data() {
    return {
      curApplicationCode: '',
      curMerchantId: getDicts('EDENEP_SYSTEM_MERCHANT_ID'),
      list: [],
      total: 0,
      listLoading: true,
      isBatch: true,
      pageSize: globalConfig.pageSize,
      filterFormLabelWidth: '100px',
      filterFormLabelWidth2: '12px',
      filterForm: {
        searchWord: '',
        current: globalConfig.startPage,
        pageSize: globalConfig.initPageSize
      },
      dialogStatus: '',
      tableKey: 0,
      dialogFormVisible: false,
      dialogEditFormVisible: false,
      formLabelWidth: '120px',
      userInfoForm: {
        userName: '',
        phone: '',
        userAccount: '',
        passWord: ''
      },
      textMap: {
        update: '编辑',
        create: '创建'
      },
      // 表单校验规则
      userInfoFormRules: {
        userName: [{
          required: true,
          message: '请输入姓名',
          trigger: 'blur'
        }],
        userAccount: [{
          required: true,
          message: '请输入账号',
          trigger: 'blur'
        }],
        passWord: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }],
        phone: [{
          required: true,
          message: '请输入联系方式',
          trigger: 'blur'
        }]
      }
    }
  },
  computed: {
    minimenu2ndStatus() {
      return this.$store.state.app.minimenu2ndStatus
    }
  },
  created() {
    this.curApplicationCode = getApplicationCode(this)
    this.getChildAdminList()
  },
  methods: {
    getChildAdminList() {
      this.listLoading = true
      this.filterForm.curApplicationCode = this.curApplicationCode
      getChildAdminList(this.filterForm).then(response => {
        if (response.data.error_no === 0) {
          this.list = response.data.result.records
          this.total = response.data.result.total
        } else {
          this.$message(response.data.error_info)
        }
        this.listLoading = false
      })
    },
    searchChildAdmin() {
      this.filterForm.current = globalConfig.startPage
      this.getChildAdminList()
    },
    addChildAdmin() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    modifyChildAdmin(row) {
      this.userInfoForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    pageSizeChange(val) {
      this.filterForm.current = globalConfig.startPage
      this.filterForm.pageSize = val
      this.getChildAdminList()
    },
    currentPageChange(val) {
      this.filterForm.current = val
      this.getChildAdminList()
    },
    addSubmit() {
      this.$refs['userInfoForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          this.userInfoForm.merchantId = this.curMerchantId
          this.userInfoForm.curApplicationCode = this.curApplicationCode
          addChildAdmin(this.userInfoForm).then(response => {
            if (response.data.error_no === 0) {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: response.data.error_info,
                type: 'success',
                duration: 2000
              })
              this.closeDialog()
              this.searchChildAdmin()
            } else {
              this.$message(response.data.error_info)
            }
            this.listLoading = false
          })
        } else {
          return false
        }
      })
    },
    updateSubmit() {
      this.$refs['userInfoForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          this.userInfoForm.merchantId = this.curMerchantId
          this.userInfoForm.curApplicationCode = this.curApplicationCode
          editChildAdmin(this.userInfoForm).then(response => {
            if (response.data.error_no === 0) {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: response.data.error_info,
                type: 'success',
                duration: 2000
              })
              this.closeDialog()
              this.searchChildAdmin()
            } else {
              this.$message(response.data.error_info)
            }
            this.listLoading = false
          })
        } else {
          return false
        }
      })
    },
    deleteChildAdmin(row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        const params = { userId: row.userId }
        params.curApplicationCode = this.curApplicationCode
        deleteChildAdmin(params).then(response => {
          if (response.data.error_no === 0) {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.searchChildAdmin()
            this.$refs.multipleTable.clearSelection()
          } else {
            this.$message(response.data.error_info)
          }
          this.listLoading = false
        })
      })
    },
    deleteBatch() {
      if (window.confirm('确定要删除吗？')) {
        const selection = this.$refs.multipleTable.selection
        const selectUserIds = []
        for (let i = 0; i < selection.length; i++) {
          selectUserIds.push(selection[i].userId)
        }
        const param = {
          userIds: selectUserIds
        }
        this.listLoading = true
        param.curApplicationCode = this.curApplicationCode
        deleteBatchChildAdmin(param).then(response => {
          if (response.data.error_no === 0) {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.searchChildAdmin()
            this.$refs.multipleTable.clearSelection()
          } else {
            this.$message(response.data.error_info)
          }
          this.listLoading = false
        })
      }
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
    resetForm() {
      this.userInfoForm = {
        userName: '',
        phone: '',
        userAccount: '',
        passWord: ''
      }
      if (this.$refs['userInfoForm'] !== undefined) {
        this.$refs['userInfoForm'].resetFields()
      }
    },
    closeDialog() {
      this.dialogFormVisible = false
      this.resetForm()
    }
  }
}
</script>
