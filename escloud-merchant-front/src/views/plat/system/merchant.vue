<template>
  <div>
    <div class="filter-container" v-show="proSearch">
      <el-form :model="filterForm" ref="filterForm">
        <div v-if=proSearch>
          <el-row>
            <el-col :span="8">
              <el-form-item label="商户名称" :label-width="filterFormLabelWidth" prop="merchantName" class="form-bottom">
                <el-input @keyup.enter.native="searchMerchant" size="small" class="filter-item" placeholder="商户名称" v-model="filterForm.merchantName">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="商户描述" :label-width="filterFormLabelWidth" prop="description" class="form-bottom">
                <el-input @keyup.enter.native="searchMerchant" size="small" class="filter-item" placeholder="商户描述" v-model="filterForm.description">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="商户LOGO" :label-width="filterFormLabelWidth" prop="logo" class="form-bottom">
                <el-input @keyup.enter.native="searchMerchant" size="small" class="filter-item" placeholder="商户LOGO" v-model="filterForm.logo">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="创建人" :label-width="filterFormLabelWidth" prop="createBy" class="form-bottom">
                <el-input @keyup.enter.native="searchMerchant" size="small" class="filter-item" placeholder="创建人" v-model="filterForm.createBy">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="创建时间" :label-width="filterFormLabelWidth" prop="createDate" class="form-bottom">
                <el-date-picker v-model="filterForm.createDate" type="datetimerange" placeholder="创建时间" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" prop="createDate">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="修改人" :label-width="filterFormLabelWidth" prop="modifyBy" class="form-bottom">
                <el-input @keyup.enter.native="searchMerchant" size="small" class="filter-item" placeholder="修改人" v-model="filterForm.modifyBy">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="修改时间" :label-width="filterFormLabelWidth" prop="modifyDate" class="form-bottom">
                <el-date-picker v-model="filterForm.modifyDate" type="datetimerange" placeholder="修改时间" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" prop="modifyDate">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="button-group">
            <el-col :span="12" class="searchSimpleBtn">
              <el-form-item label=" " :label-width="filterFormLabelWidth" class="form-bottom">
                <el-button round type="primary" size="small" icon="el-icon-search" @click="searchMerchant" v-waves>搜索</el-button>
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
    <div class="simpleFilter"  v-show="!proSearch">
      <el-form>
        <el-row class="button-group">
            <span v-if=!proSearch>
            <el-col :span="3">
              <el-form-item label=" " :label-width="filterFormLabelWidth2" prop="queryType" class="simple-btn first">
                <el-select @keyup.enter.native="searchMerchant" size="small" class="filter-item" @change="searchName" clearable placeholder="请选择查询条件" v-model="queryType">
                  <el-option v-for="(item,index) in searchOptions" :key="index" :data-key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label=" " :label-width="filterFormLabelWidth2" prop="queryParams" class="simple-btn">
                <el-input @keyup.enter.native="searchMerchant" size="small" class="filter-item" :placeholder="selectDesc" v-model="queryParams">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" class="searchSimpleBtn">
              <el-button round type="primary" size="small" icon="el-icon-search" @click="searchMerchant" v-waves>搜索</el-button>
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
      <el-table ref="multipleTable" :data="list" :fit='true' highlight-current-row size='mini' :default-sort="{prop: 'id', order: 'aescending'}" @select="selectCheckBox" @select-all="selectAllCheckBox" v-loading="listLoading" element-loading-text="给我一点时间"
                style="width: 100%">
        <el-table-column show-overflow-tooltip type="selection" width="50"></el-table-column>
        <el-table-column show-overflow-tooltip type="index" width="62"></el-table-column>
        <el-table-column show-overflow-tooltip header-align="center" align="center" label="主键ID" prop='id' v-if=false sortable>
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip header-align="center" align="center" label="商户号" prop='merchantName' show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.merchantId}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip header-align="center" align="center" label="商户名称" prop='merchantName'>
          <template slot-scope="scope">
            <span>{{scope.row.merchantName}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip header-align="center" align="center" label="商户描述" prop='description'>
          <template slot-scope="scope">
            <span>{{scope.row.description}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip header-align="center" align="center" label="商户LOGO" prop='logo'>
          <template slot-scope="scope">
            <span>{{scope.row.logo}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip header-align="center" align="center" label="创建人" show-overflow-tooltip prop='createBy'>
          <template slot-scope="scope">
            <span>{{scope.row.createBy}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip header-align="center" align="center" label="创建时间" prop='createDate' v-if=false sortable>
          <template slot-scope="scope">
            <span>{{scope.row.createDate}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip header-align="center" align="center" label="修改人" prop='modifyBy'>
          <template slot-scope="scope">
            <span>{{scope.row.modifyBy}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip header-align="center" align="center" label="修改时间" prop='modifyDate'>
          <template slot-scope="scope">
            <span>{{scope.row.modifyDate}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center" label="操作" width="240" fixed='right'>
          <template slot-scope="scope">
            <el-button round size="small" type="text" @click="modifyMerchant(scope.row,'update')">
              修改
            </el-button>
            <el-button round size="small" type="text" @click="deleteMerchant(scope.row,'delete')">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-show="!listLoading" class="pagination-container">
        <el-row>
          <el-col :span="12">
            <el-button round type="info" plain size="small" icon="el-icon-edit" @click="addMerchant">添加</el-button>
            <el-button round type="info" plain size="small" :disabled="isBatch" icon="el-icon-delete" @click="deleteBatch">批量删除</el-button>
          </el-col>
          <el-col :span="12">
            <el-pagination @size-change="pageSizeChange" @current-change="currentPageChange" :current-page.sync="filterForm.current" :page-sizes="pageSize" :page-size="filterForm.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
          </el-col>
        </el-row>
      </div>

      <el-dialog class="create_dialog" center :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" size="small" :before-close="closeDialog">
        <el-form :model="merchantForm" :rules="merchantFormRules" ref="merchantForm" label-width="80px">
          <el-row>
            <el-col :span="11">
              <el-form-item v-if="dialogStatus=='update'" label="主键ID" :label-width="formLabelWidth" prop="id">
                <el-input size="small" v-model="merchantForm.id" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="商户名称" :label-width="formLabelWidth" prop="merchantName">
                <el-input size="small" v-model="merchantForm.merchantName" :maxlength="50"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="商户描述" :label-width="formLabelWidth" prop="description">
                <el-input size="small" v-model="merchantForm.description" :maxlength="100" resize='vertical' type="textarea" :autosize="{ minRows: 4, maxRows: 8}" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="商户LOGO" :label-width="formLabelWidth" prop="logo">
                <el-input size="small" v-model="merchantForm.logo" :maxlength="127" resize='vertical' type="textarea" :autosize="{ minRows: 5, maxRows: 10}" placeholder="请输入内容"></el-input>
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

      <image-cropper :width="300" :height="300" url="https://httpbin.org/post" @close='close' @crop-upload-success="cropSuccess" :key="imagecropperKey" v-show="imagecropperShow"></image-cropper>

    </div>
  </div>

</template>
<script>
import {
  getMerchantList,
  addMerchant,
  editMerchant,
  delMerchant,
  delBatchMerchant
} from '@/api/plat/merchant'
import {
  globalConfig
} from '@/globalConfig'
import waves from '@/directive/waves/index.js'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

export default {
  name: 'tableMerchant',
  directives: {
    waves
  },
  components: {
    ImageCropper,
    PanThumb
  },
  data() {
    return {
      list: [],
      searchOptions: [{
        value: 'merchantName',
        label: '商户名称'
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
      testData: 'testttt111',
      filterForm: {
        id: '',
        merchantId: '',
        merchantName: '',
        description: '',
        logo: '',
        createBy: '',
        createDate: [],
        modifyBy: '',
        modifyDate: [],
        current: globalConfig.startPage,
        pageSize: globalConfig.initPageSize
      },
      dialogStatus: '',
      tableKey: 0,
      dialogFormVisible: false,
      dialogEditFormVisible: false,
      formLabelWidth: '120px',
      merchantForm: {
        id: '',
        merchantId: '',
        merchantName: '',
        description: '',
        logo: '',
        createBy: '',
        createDate: '',
        modifyBy: '',
        modifyDate: ''
      },
      textMap: {
        update: '编辑',
        create: '创建'
      },
      // 表单校验规则
      merchantFormRules: {
        id: [{
          type: 'number',
          required: true,
          message: '请输入主键ID',
          trigger: 'blur'
        }, {
          type: 'number',
          message: '主键ID必须为数字值'
        }],
        merchantName: [{
          required: true,
          message: '请输入商户名称',
          trigger: 'blur'
        }]
      }
    }
  },
  computed: {},
  created() {
    this.getMerchantList()
  },

  methods: {
    getMerchantList() {
      this.listLoading = true
      getMerchantList(this.filterForm).then(response => {
        if (response.data.error_no === 0) {
          this.list = response.data.result.records
          this.total = response.data.result.total
        } else {
          this.$message(response.data.error_info)
        }
        this.listLoading = false
      })
    },
    searchMerchant() {
      if (!this.proSearch) {
        this.filterForm[this.queryType] = this.queryParams
      }
      this.filterForm.current = globalConfig.startPage
      this.getMerchantList()
    },
    addMerchant() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    modifyMerchant(row) {
      this.merchantForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    deleteMerchant(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {
          primaryKey: row.id
        }
        this.listLoading = true
        delMerchant(param).then(response => {
          if (response.data.error_no === 0) {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.searchMerchant()
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
        delBatchMerchant(param).then(response => {
          if (response.data.error_no === 0) {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.searchMerchant()
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
      this.getMerchantList()
    },
    currentPageChange(val) {
      this.filterForm.current = val
      this.getMerchantList()
    },
    addSubmit() {
      this.$refs['merchantForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          addMerchant(this.merchantForm).then(response => {
            if (response.data.error_no === 0) {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: response.data.error_info,
                type: 'success',
                duration: 2000
              })
              this.closeDialog()
              this.searchMerchant()
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
      this.$refs['merchantForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          editMerchant(this.merchantForm).then(response => {
            if (response.data.error_no === 0) {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: response.data.error_info,
                type: 'success',
                duration: 2000
              })
              this.closeDialog()
              this.searchMerchant()
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
        merchantName: '',
        description: '',
        logo: '',
        createBy: '',
        createDate: [],
        modifyBy: '',
        modifyDate: [],
        current: globalConfig.startPage,
        pageSize: globalConfig.initPageSize
      }
    },
    resetForm() {
      this.merchantForm = {
        id: '',
        merchantId: '',
        merchantName: '',
        description: '',
        logo: '',
        createBy: '',
        createDate: '',
        modifyBy: '',
        modifyDate: ''
      }
      if (this.$refs['merchantForm'] !== undefined) {
        this.$refs['merchantForm'].resetFields()
      }
    },
    handleDownload() {
      this.downloadLoading = true
      require.ensure([], () => {
        const {
          export_json_to_excel
        } = require('vendor/Export2Excel')
        const tHeader = [
          '主键ID',
          '商户号',
          '商户名称',
          '商户描述',
          '商户LOGO',
          '创建人',
          '创建时间',
          '修改人',
          '修改时间'
        ]
        const filterVal = [
          'id',
          'merchantId',
          'merchantName',
          'description',
          'logo',
          'createBy',
          'createDate',
          'modifyBy',
          'modifyDate'
        ]
        const list = this.list
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, '商户信息表')
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
