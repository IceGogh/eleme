<template>
  <div>
    <div class="filter-container" v-show="proSearch">
      <el-form :model="filterForm" ref="filterForm">
        <div v-if=proSearch>
          <el-row>
            <el-col :span="8">
              <el-form-item label="用户ID" :label-width="filterFormLabelWidth" prop="userId" class="form-bottom">
                <el-input @keyup.enter.native="searchUserInfo"  size="small" class="filter-item" placeholder="用户ID" v-model="filterForm.userId">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="商户" :label-width="filterFormLabelWidth" prop="merchantId" class="form-bottom">
                <el-select @keyup.enter.native="searchRole" size="small" class="filter-item" clearable placeholder="商户" v-model="filterForm.merchantId">
                  <el-option v-for="item in merchantIdArr" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="账号" :label-width="filterFormLabelWidth" prop="userAccount" class="form-bottom">
                <el-input @keyup.enter.native="searchUserInfo" size="small" class="filter-item" placeholder="姓名" v-model="filterForm.userAccount">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="姓名" :label-width="filterFormLabelWidth" prop="userName" class="form-bottom">
                <el-input @keyup.enter.native="searchUserInfo" size="small" class="filter-item" placeholder="姓名" v-model="filterForm.userName">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
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
            <el-col v-if=proSearch :span="12" class="searchProBtn">
              <el-button round type="primary" plain size="small" icon="el-icon-document" @click="handleDownload" :loading="downloadLoading">导出</el-button>
              <el-button round type="primary" plain size="small" icon="el-icon-search" @click="changeProButton" v-waves>简单搜索</el-button>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>
    <div class="simpleFilter" v-show="!proSearch">
      <el-form>
        <el-row class="button-group">
          <span v-if=!proSearch>
          <el-col :span="3">
            <el-form-item label=" " :label-width="filterFormLabelWidth2" prop="queryType" class="simple-btn first">
              <el-select @keyup.enter.native="searchUserInfo" size="small" class="filter-item" @change="searchName" clearable placeholder="请选择查询条件" v-model="queryType">
                <el-option v-for="item in searchOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label=" " :label-width="filterFormLabelWidth2" prop="queryParams" class="simple-btn">
              <el-input @keyup.enter.native="searchUserInfo" size="small" class="filter-item" :placeholder="selectDesc" ref="queryParamsRef" v-model="queryParams">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" class="searchSimpleBtn">
            <el-button round type="primary" size="small" icon="el-icon-search" @click="searchUserInfo" v-waves>搜索</el-button>
          </el-col>
          </span>
          <el-col v-if=!proSearch :span="12" class="searchProBtn">
            <el-button round type="primary" plain size="small" icon="el-icon-document" @click="handleDownload" :loading="downloadLoading">导出</el-button>
            <el-button round type="primary" plain size="small" icon="el-icon-search" @click="changeProButton" v-waves>高级搜索</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="app-container calendar-list-container">

      <el-table ref="multipleTable" :data-key='tableKey' :data="list" fit highlight-current-row size='mini' :default-sort="{prop: 'id', order: 'aescending'}" @select="selectCheckBox" @select-all="selectAllCheckBox" v-loading="listLoading" element-loading-text="给我一点时间"
        style="width: 100%">
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
        <el-table-column show-overflow-tooltip header-align="center" align="center" label="用户账号" prop='userAccount'>
          <template slot-scope="scope">
            <span>{{scope.row.userAccount}}</span>
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
        <el-table-column show-overflow-tooltip header-align="center" align="center" label="创建人" prop='createBy'>
          <template slot-scope="scope">
            <span>{{scope.row.createBy}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip header-align="center" align="center" label="创建时间" prop='createDate' v-if=false sortable>
          <template slot-scope="scope">
            <span>{{scope.row.createDate}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center" label="操作" width="240" fixed='right'>
          <template slot-scope="scope">
            <el-button round size="small" type="text" @click="modifyUserInfo(scope.row,'update')">修改
            </el-button>
            <el-button round size="small" type="text" @click="deleteUserInfo(scope.row,'delete')">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-show="!listLoading" class="pagination-container">
        <el-row>
          <el-col :span="12">
            <el-button round type="info" plain size="small" icon="el-icon-edit" @click="addUserInfo">添加</el-button>
            <el-button round type="info" plain size="small" :disabled="isBatch" icon="el-icon-delete" @click="deleteBatch">批量删除</el-button>
          </el-col>
          <el-col :span="12">
            <el-pagination @size-change="pageSizeChange" @current-change="currentPageChange" :current-page.sync="filterForm.current" :page-sizes="pageSize" :page-size="filterForm.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
          </el-col>
        </el-row>
      </div>

      <el-dialog center class="create_dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" size="small" :before-close="closeDialog">
        <el-form :model="userInfoForm" :rules="userInfoFormRules" ref="userInfoForm" label-width="80px">
          <el-row>
            <el-col :span="11">
              <el-form-item v-if="dialogStatus=='update'" label="主键ID" :label-width="formLabelWidth" prop="id">
                <el-input size="small" v-model="userInfoForm.id" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="商户" :label-width="formLabelWidth" prop="merchantId">
                <el-select @keyup.enter.native="searchRole" size="small" class="filter-item" clearable placeholder="商户" v-model="userInfoForm.merchantId">
                  <el-option v-for="item in merchantIdArr" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>


            </el-col>
            <el-col :span="11">
              <el-form-item label="姓名" :label-width="formLabelWidth" prop="userName">
                <el-input size="small" v-model="userInfoForm.userName" :maxlength="50"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="用户账号" :label-width="formLabelWidth" prop="userAccount">
                <el-input size="small" v-model="userInfoForm.userAccount" :maxlength="11"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="用户密码" :label-width="formLabelWidth" prop="passWord">
                <el-input size="small" type="password"   v-model="userInfoForm.passWord" :maxlength="11"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="联系方式" :label-width="formLabelWidth" prop="phone">
                <el-input size="small" v-model="userInfoForm.phone" :maxlength="20"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button round @click="closeDialog">取 消</el-button>
          <el-button round v-if="dialogStatus=='create'" type="primary" @click="addSubmit">确 定</el-button>
          <el-button round v-else type="primary" @click="updateSubmit">确 定</el-button>
        </div>
      </el-dialog>

      <image-cropper :width="300" :height="300" url="https://httpbin.org/post" @close='close' @crop-upload-success="cropSuccess" :data-key="imagecropperKey" v-show="imagecropperShow"></image-cropper>

    </div>
  </div>
</template>
<script>
import {
  getUserInfoList,
  addUserInfo,
  editUserInfo,
  delUserInfo,
  delBatchUserInfo
} from '@/api/plat/userInfo'
import {
  queryNameIdDic
} from '@/api/plat/merchant'
import {
  globalConfig
} from '@/globalConfig'
import waves from '@/directive/waves/index.js'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

export default {
  name: 'tableUserInfo',
  directives: {
    waves
  },
  components: {
    ImageCropper,
    PanThumb
  },
  data() {
    return {
      merchantIdMap: {},
      merchantIdArr: [],
      list: [],
      searchOptions: [{
        value: 'merchantId',
        label: '商户ID'
      },
      {
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
      imagecropperShow: false,
      imagecropperKey: 0,
      pageSize: globalConfig.pageSize,
      filterFormLabelWidth: '100px',
      filterFormLabelWidth2: '12px',
      queryType: '',
      queryParams: '',
      filterForm: {
        id: '',
        merchantId: '',
        userId: '',
        userName: '',
        userAccount: '',
        phone: '',
        createBy: '',
        createDate: [],
        current: globalConfig.startPage,
        pageSize: globalConfig.initPageSize
      },
      dialogStatus: '',
      tableKey: 0,
      dialogFormVisible: false,
      dialogEditFormVisible: false,
      formLabelWidth: '120px',
      userInfoForm: {
        id: '',
        merchantId: '',
        userId: '',
        userName: '',
        userAccount: '',
        passWord: '',
        phone: '',
        createBy: '',
        createDate: ''
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
          required: true,
          message: '请输入商户ID',
          trigger: 'blur'
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
  computed: {},
  created() {
    this.getUserInfoList()
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
    getUserInfoList() {
      this.listLoading = true
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
      if (!this.proSearch) {
        this.filterForm[this.queryType] = this.queryParams
      }
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
    deleteUserInfo(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {
          primaryKey: row.id
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
        const selection = this.$refs.multipleTable.selection
        const selectIds = []
        for (var i = 0; i < selection.length; i++) {
          selectIds.push(selection[i].id)
        }
        const param = {
          primaryKeys: selectIds
        }
        this.listLoading = true
        delBatchUserInfo(param).then(response => {
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
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
