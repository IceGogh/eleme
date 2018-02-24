<template>
  <div class="main-contain-new clearfix">
    <sidebar-menu></sidebar-menu>
    <div class="main-contain-new-inner" :class="{'main-contain-new-inner-all': !minimenu2ndStatus}">
      <div class="option-bar">
        <el-button type="edenep-blue-btn" icon="el-icon-circle-plus-outline" class="add-btn" @click="addUserInfo">添加</el-button>
        <div class="searchBox">
          <input type="text" class="search" placeholder="请输入关键词查询" v-model="filterForm.searchWord"/>
          <i class="el-icon-search" @click="searchUserInfo(filterForm.searchWord)"></i>
        </div>
      </div>
      <template>
        <div class="app-container calendar-list-container">
          <el-table ref="multipleTable" :key='tableKey' :data="list" stripe fit highlight-current-row size='mini' :default-sort="{prop: 'id', order: 'aescending'}" @select="selectCheckBox" @select-all="selectAllCheckBox" v-loading="listLoading" element-loading-text="给我一点时间"
                    style="width: 100%">
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column type="index" width="62" label="序号"></el-table-column>
            <el-table-column header-align="center" align="center" label="" prop='id' v-if=false sortable>
              <template slot-scope="scope">
                <span>{{scope.row.id}}</span>
              </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" label="用户ID" prop='userId' :show-overflow-tooltip='true'>
              <template slot-scope="scope">
                <span>{{scope.row.userId}}</span>
              </template>
            </el-table-column>
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
            <el-table-column header-align="center" align="center" label="联系方式" prop='phone'>
              <template slot-scope="scope">
                <span>{{scope.row.phone}}</span>
              </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" label="创建人" prop='createBy'>
              <template slot-scope="scope">
                <span>{{scope.row.createBy}}</span>
              </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" label="创建时间" prop='createDate'>
              <template slot-scope="scope">
                <span>{{scope.row.createDate}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="240">
              <template slot-scope="scope">
                <el-button round size="small" type="text" @click="modifyUserInfo(scope.row,'update')">修改
                </el-button>|
                <el-button round size="small" type="text" @click="resetPassWord(scope.row,'update')">重置密码
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <div v-show="!listLoading" class="pagination-container">
            <el-row>
              <el-col :span="7">
                <el-button type="info" plain size="small" :disabled="isBatch"></el-button>
              </el-col>
              <el-col :span="17">
                <el-pagination @size-change="pageSizeChange" @current-change="currentPageChange" :current-page.sync="filterForm.current" :page-sizes="pageSize" :page-size="filterForm.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
              </el-col>
            </el-row>
          </div>

          <el-dialog class="create_dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" size="small" :before-close="closeDialog">
            <el-form :model="userInfoForm" :rules="userInfoFormRules" ref="userInfoForm" label-width="80px">
              <el-row>
                <el-col :span="11">
                  <el-form-item v-show="dialogStatus!='resetPassWord'" label="姓名" :label-width="formLabelWidth" prop="userName">
                    <el-input size="small" v-model="userInfoForm.userName" :maxlength="50"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item v-show="dialogStatus!='resetPassWord'" label="用户账号" :label-width="formLabelWidth" prop="userAccount">
                    <el-input size="small" v-model="userInfoForm.userAccount" :maxlength="11" :disabled="dialogStatus=='update'"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="11">
                  <el-form-item v-show="dialogStatus!='resetPassWord'" label="用户密码" :label-width="formLabelWidth" prop="passWord">
                    <el-input size="small" type="password"   v-model="userInfoForm.passWord" :maxlength="11" :disabled="dialogStatus=='update'"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item v-show="dialogStatus!='resetPassWord'" label="联系方式" :label-width="formLabelWidth" prop="phone">
                    <el-input size="small" v-model="userInfoForm.phone" :maxlength="11"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="11">
                  <el-form-item v-show="dialogStatus=='resetPassWord'" label="用户密码" :label-width="formLabelWidth" prop="newPassWord">
                    <el-input size="small" type="password" v-model="userInfoForm.newPassWord" :maxlength="11"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="11">
                  <el-form-item v-show="dialogStatus=='resetPassWord'" label="请重复密码" :label-width="formLabelWidth" prop="newPassWord2">
                    <el-input size="small" type="password" v-model="userInfoForm.newPassWord2" :maxlength="11"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="closeDialog">取 消</el-button>
              <el-button v-if="dialogStatus=='create'" type="primary" @click="addSubmit">确 定</el-button>
              <el-button v-if="dialogStatus=='update'" type="primary" @click="updateSubmit">确 定</el-button>
              <el-button v-if="dialogStatus=='resetPassWord'" type="primary" @click="updateSubmit">确 定</el-button>
            </div>
          </el-dialog>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import {
  addUserInfo,
  editUserInfo,
  getUserInfoList,
  delUserInfo
} from '@/api/merchant/auth/merchantUserInfo'
import {
  globalConfig
} from '@/globalConfig'
import { getApplicationCode, getCurProjectCode } from '@/api/common'
import waves from '@/directive/waves/index.js'
import PanThumb from '@/components/PanThumb'
import { mapGetters } from 'vuex'
import menuList from '@/views/plat/layout/menuList'
import SidebarMenu from '@/views/plat/layout/SidebarMenu'
export default {
  name: 'tableUserInfo',
  directives: {
    waves
  },
  components: {
    PanThumb,
    menuList,
    SidebarMenu
  },
  data() {
    return {
      // 暂定测试值
      curProjectCode: getCurProjectCode(),
      Height: 0,
      hash: '',
      curApplicationCode: '',
      routesArray: [],
      menuTitleName: '',
      menuTitleIcon: '',
      list: [],
      checkList: [],
      merchantIdMap: {},
      merchantIdArr: [],
      searchOptions: [{
        value: 'userId',
        label: '用户ID'
      },
      {
        value: 'userName',
        label: '姓名'
      },
      {
        value: 'userAccount',
        label: '登录账号'
      },
      {
        value: 'phone',
        label: '联系方式'
      }],
      total: 0,
      selectDesc: '',
      listLoading: true,
      proSearch: false,
      downloadLoading: false,
      isBatch: true,
      pageSize: globalConfig.pageSize,
      filterFormLabelWidth: '100px',
      filterFormLabelWidth2: '12px',
      queryType: '',
      queryParams: '',
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
        puiId: '',
        merchantId: '',
        userId: '',
        userName: '',
        userAccount: '',
        passWord: '',
        phone: '',
        createBy: '',
        createDate: '',
        newPassWord: '',
        newPassWord2: ''
      },
      textMap: {
        update: '编辑',
        create: '创建'
      },
      // 表单校验规则
      userInfoFormRules: {
        id: [{
          type: 'number',
          required: true,
          message: '请输入',
          trigger: 'blur'
        }, {
          type: 'number',
          message: '必须为数字值'
        }],
        merchantId: [{
          type: 'number',
          required: true,
          message: '请输入商户ID',
          trigger: 'blur'
        }, {
          type: 'number',
          message: '商户ID必须为数字值'
        }],
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
    ...mapGetters([
      'permission_routers',
      'sidebar'
    ]),
    TableHeight() {
      return (this.Height - 50)
    },
    minimenu2ndStatus() {
      return this.$store.state.app.minimenu2ndStatus
    }
  },
  created() {
    const Height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    this.Height = Height
    this.curApplicationCode = getApplicationCode(this)
    this.permission_routers.forEach((item, index) => {
      if (item.code === this.curApplicationCode) {
        this.routesArray.push(item)
        this.menuTitleName = item.name
        this.menuTitleIcon = item.icon
      }
    })
    this.getUserInfoList()
  },
  methods: {
    getUserInfoList() {
      this.listLoading = true
      this.filterForm.curApplicationCode = this.curApplicationCode
      this.filterForm.projectCode = this.curProjectCode
      getUserInfoList(this.filterForm).then(response => {
        if (response.data.error_no === 0) {
          this.list = response.data.result.records
          this.total = response.data.result.total
        } else {
          this.$message(response.data.error_info)
        }
        this.listLoading = false
      })
    },
    searchUserInfo() {
      this.filterForm.current = globalConfig.startPage
      this.getUserInfoList()
    },
    addUserInfo() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    modifyUserInfo(row) {
      this.userInfoForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    resetPassWord(row) {
      this.userInfoForm = Object.assign({}, row)
      this.dialogStatus = 'resetPassWord'
      this.dialogFormVisible = true
    },
    pageSizeChange(val) {
      this.filterForm.current = globalConfig.startPage
      this.filterForm.pageSize = val
      this.getUserInfoList()
    },
    currentPageChange(val) {
      this.filterForm.current = val
      this.getUserInfoList()
    },
    addSubmit() {
      this.$refs['userInfoForm'].validate((valid) => {
        if (valid) {
          this.userInfoForm.curApplicationCode = this.curApplicationCode
          this.listLoading = true
          addUserInfo(this.userInfoForm).then(response => {
            if (response.data.error_no === 0) {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: response.data.error_info,
                type: 'success',
                duration: 2000
              })
              this.closeDialog()
              this.searchUserInfo()
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
          this.userInfoForm.curApplicationCode = this.curApplicationCode
          editUserInfo(this.userInfoForm).then(response => {
            if (response.data.error_no === 0) {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: response.data.error_info,
                type: 'success',
                duration: 2000
              })
              this.closeDialog()
              this.searchUserInfo()
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
    deleteUserInfo(row) {
      const param = {
        primaryKey: row.puiId,
        curApplicationCode: this.curApplicationCode
      }
      this.listLoading = true
      delUserInfo(param).then(response => {
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
    },
    searchName(val) {
      this.resetSearch()
      if (val !== '') {
        let obj = {}
        obj = this.searchOptions.find((item) => {
          return item.value === val
        })
        this.selectDesc = '请输入' + obj.label
        if (obj.value === 'merchantId') {
          this.$refs.queryParamsRef.type = 'number'
          this.selectDesc = '请输入' + obj.label + '（只能输入数字）'
        }

        if (obj.value === 'userId') {
          this.$refs.queryParamsRef.type = 'number'
          this.selectDesc = '请输入' + obj.label + '（只能输入数字）'
        }
      } else {
        this.selectDesc = ''
      }
      this.queryParams = ''
    },
    changeProButton() {
      this.resetSearch()
      this.proSearch = !this.proSearch
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
    resetSearch() {
      this.filterForm = {
        id: '',
        merchantId: '',
        userId: '',
        userName: '',
        phone: '',
        createBy: '',
        createDate: [],
        current: globalConfig.startPage,
        pageSize: globalConfig.initPageSize
      }
    },
    resetForm() {
      this.userInfoForm = {
        id: '',
        merchantId: '',
        userId: '',
        userName: '',
        phone: '',
        createBy: '',
        createDate: ''
      }
      if (this.$refs['userInfoForm'] !== undefined) {
        this.$refs['userInfoForm'].resetFields()
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
    cropSuccess(resData) {
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
      this.buttonForm.btnIcon = resData.files.avatar
    },
    close() {
      this.imagecropperShow = false
    },
    closeDialog() {
      this.dialogFormVisible = false
      this.resetForm()
    }
  }
}
</script>
<style  src="@/styles/merchant.scss" rel="stylesheet/scss" lang="scss"></style>
