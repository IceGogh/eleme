<template>
<div class="app-container calendar-list-container">
<div class="filter-container">
<el-form :model="filterForm" ref="filterForm">
  <div v-if=proSearch>
   <el-row>
    <el-col :span="7">
      <el-form-item label="" :label-width="filterFormLabelWidth" prop="id" class="form-bottom">
	    <el-input @keyup.enter.native="searchMqError" size="small" class="filter-item" placeholder="" v-model="filterForm.id">
	    </el-input>
	  </el-form-item>
    </el-col>
    <el-col :span="7">
      <el-form-item label="指令id" :label-width="filterFormLabelWidth" prop="commandId" class="form-bottom">
	    <el-input @keyup.enter.native="searchMqError" size="small" class="filter-item" placeholder="指令id" v-model="filterForm.commandId">
	    </el-input>
	  </el-form-item>
    </el-col>
    <el-col :span="7">
      <el-form-item label="" :label-width="filterFormLabelWidth" prop="createDate" class="form-bottom">
		<el-date-picker v-model="filterForm.createDate" type="datetimerange" placeholder="" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" prop="createDate">
		</el-date-picker>
	  </el-form-item>
    </el-col>
	</el-row>
   <el-row>
    <el-col :span="7">
      <el-form-item label="异常信息" :label-width="filterFormLabelWidth" prop="exceptionInfo" class="form-bottom">
	    <el-input @keyup.enter.native="searchMqError" size="small" class="filter-item" placeholder="异常信息" v-model="filterForm.exceptionInfo">
	    </el-input>
	  </el-form-item>
    </el-col>
    <el-col :span="7">
      <el-form-item label="异常码" :label-width="filterFormLabelWidth" prop="exceptionNo" class="form-bottom">
	    <el-input @keyup.enter.native="searchMqError" size="small" class="filter-item" placeholder="异常码" v-model="filterForm.exceptionNo">
	    </el-input>
	  </el-form-item>
    </el-col>
   </el-row>
	<el-row class="button-group">
      <el-col :span="12" class="searchSimpleBtn">
        <el-form-item label=" " :label-width="filterFormLabelWidth" class="form-bottom">
          <el-button type="primary" size="small" icon="el-icon-search" @click="searchMqError" v-waves>搜索</el-button>
          <el-button type="primary" plain size="small" icon="el-icon-delete" @click="resetSearch" v-waves>清空</el-button>
        </el-form-item>
      </el-col>
      <el-col v-if=proSearch :span="12" class="searchProBtn">
        <el-button type="primary" plain size="small" icon="el-icon-document" @click="handleDownload" :loading="downloadLoading">导出</el-button>
        <el-button type="primary" plain size="small" icon="el-icon-search" @click="changeProButton" v-waves>简单搜索</el-button>
      </el-col>
  	</el-row>
  </div>
</el-form>
</div>
  <div class="simpleFilter">
	<el-form>
      <el-row class="button-group">
        <span v-if=!proSearch>
        <el-col :span="3">
          <el-form-item label=" " :label-width="filterFormLabelWidth2" prop="queryType" class="simple-btn first">
            <el-select @keyup.enter.native="searchMqError" size="small" class="filter-item" @change="searchName" clearable placeholder="请选择查询条件" v-model="queryType">
              <el-option v-for="item in searchOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label=" " :label-width="filterFormLabelWidth2" prop="queryParams" class="simple-btn">
            <el-input @keyup.enter.native="searchMqError" size="small" class="filter-item" :placeholder="selectDesc" v-model="queryParams">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" class="searchSimpleBtn">
          <el-button type="primary" size="small" icon="el-icon-search" @click="searchMqError" v-waves>搜索</el-button>
        </el-col>
        </span>
        <el-col v-if=!proSearch :span="12" class="searchProBtn">
          <el-button type="primary" plain size="small" icon="el-icon-document" @click="handleDownload" :loading="downloadLoading">导出</el-button>
          <el-button type="primary" plain size="small" icon="el-icon-search" @click="changeProButton" v-waves>高级搜索</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
  <el-table ref="multipleTable" :key='tableKey' :data="list" stripe fit highlight-current-row size='mini' :default-sort="{prop: 'id', order: 'aescending'}" @select="selectCheckBox" @select-all="selectAllCheckBox" v-loading="listLoading" element-loading-text="给我一点时间" style="width: 100%">
    <el-table-column type="selection" width="50"></el-table-column>
    <el-table-column type="index" width="62"></el-table-column>
	<el-table-column header-align="center" align="center" label="" prop='id' v-if=false sortable>
	  <template slot-scope="scope">
        <span>{{scope.row.id}}</span>
      </template>
    </el-table-column>
	<el-table-column header-align="center" align="center" label="指令id" prop='commandId'>
	<template slot-scope="scope">
        <span>{{scope.row.commandId}}</span>
      </template>
    </el-table-column>
	<el-table-column header-align="center" align="center" label="" prop='createDate' v-if=false sortable>
	  <template slot-scope="scope">
        <span>{{scope.row.createDate}}</span>
      </template>
    </el-table-column>
	<el-table-column header-align="center" align="center" label="异常信息" prop='exceptionInfo' :show-overflow-tooltip='true'>
	<template slot-scope="scope">
        <span>{{scope.row.exceptionInfo}}</span>
      </template>
    </el-table-column>
	<el-table-column header-align="center" align="center" label="异常码" prop='exceptionNo'>
	<template slot-scope="scope">
        <span>{{scope.row.exceptionNo}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center" label="操作" width="150" fixed='right'>
      <template slot-scope="scope">
        <el-button size="small" type="text" @click="modifyMqError(scope.row,'update')">修改
        </el-button>
        <el-button size="small" type="text" @click="deleteMqError(scope.row,'delete')">删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <div v-show="!listLoading" class="pagination-container">
  	<el-row>
      <el-col :span="12">
        <el-button type="info" plain size="small" icon="el-icon-edit" @click="addMqError">添加</el-button>
        <el-button type="info" plain size="small" :disabled="isBatch" icon="el-icon-delete" @click="deleteBatch">批量删除</el-button>
      </el-col>
      <el-col :span="12">
	    <el-pagination @size-change="pageSizeChange" @current-change="currentPageChange" :current-page.sync="filterForm.page" :page-sizes="pageSize" :page-size="filterForm.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
	    </el-pagination>
      </el-col>
    </el-row>
  </div>

  <el-dialog class="create_dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" size="small">
    <el-form :model="mqErrorForm" :rules="mqErrorFormRules" ref="mqErrorForm" label-width="80px">
        	  <el-row>
	  	<el-col :span="11">
          <el-form-item v-if="dialogStatus=='update'" label="" :label-width="formLabelWidth" prop="id">
            <el-input size="small" v-model="mqErrorForm.id" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="指令id" :label-width="formLabelWidth" prop="commandId">
            <el-input size="small" v-model="mqErrorForm.commandId" :maxlength="11"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
	  <el-row>
        <el-col :span="11">
          <el-form-item label="异常码" :label-width="formLabelWidth" prop="exceptionNo">
            <el-input size="small" v-model="mqErrorForm.exceptionNo" :maxlength="40"></el-input>
          </el-form-item>
        </el-col>
    </el-row>
      <el-row>
        <el-col :span="22">
          <el-form-item label="异常信息" :label-width="formLabelWidth" prop="exceptionInfo">
            <el-input size="small" v-model="mqErrorForm.exceptionInfo" :maxlength="127" resize='vertical' type="textarea" :autosize="{ minRows: 5, maxRows: 10}" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
	</el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button v-if="dialogStatus=='create'" type="primary" @click="addSubmit">确 定</el-button>
      <el-button v-else type="primary" @click="updateSubmit">确 定</el-button>
    </div>
  </el-dialog>

  <image-cropper :width="300" :height="300" url="https://httpbin.org/post" @close='close' @crop-upload-success="cropSuccess" :key="imagecropperKey" v-show="imagecropperShow"></image-cropper>

</div>
</template>
<script>
import { getMqErrorList, addMqError, editMqError, delMqError, delBatchMqError } from '@/api/plat/message/mqError'
import { globalConfig } from '@/globalConfig'
import waves from '@/directive/waves/index.js'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

export default {
  name: 'tableMqError',
  directives: {
    waves
  },
  components: { ImageCropper, PanThumb },
  data() {
    return {
      list: [],
      searchOptions: [
        {
          value: 'id',
          label: ''
        },
        {
          value: 'commandId',
          label: '指令id'
        },
        {
          value: 'createDate',
          label: ''
        },
        {
          value: 'exceptionInfo',
          label: '异常信息'
        },
        {
          value: 'exceptionNo',
          label: '异常码'
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
        commandId: '',
        createDate: [],
        exceptionInfo: '',
        exceptionNo: '',
        page: globalConfig.startPage,
        limit: globalConfig.initPageSize
      },
      dialogStatus: '',
      tableKey: 0,
      dialogFormVisible: false,
      dialogEditFormVisible: false,
      formLabelWidth: '120px',
      mqErrorForm: {
        id: '',
        commandId: '',
        createDate: '',
        exceptionInfo: '',
        exceptionNo: ''
      },
      textMap: {
        update: '编辑',
        create: '创建'
      },
      // 表单校验规则
      mqErrorFormRules: {
        id: [{
          type: 'number',
          required: true,
          message: '请输入',
          trigger: 'blur'
        }, {
          type: 'number',
          message: '必须为数字值'
        }],
        commandId: [{
          type: 'number',
          required: true,
          message: '请输入指令id',
          trigger: 'blur'
        }, {
          type: 'number',
          message: '指令id必须为数字值'
        }],
        exceptionInfo: [{
          required: true,
          message: '请输入异常信息',
          trigger: 'blur'
        }],
        exceptionNo: [{
          required: true,
          message: '请输入异常码',
          trigger: 'blur'
        }]
      }
    }
  },
  computed: {
  },
  created() { this.getMqErrorList() },
  methods: {
    getMqErrorList() {
      this.listLoading = true
      getMqErrorList(this.filterForm).then(response => {
        if (response.data.error_no === 0) {
          this.list = response.data.result.records
          this.total = response.data.result.total
        } else {
          this.$message(response.data.error_info)
        }
        this.listLoading = false
      })
    },
    searchMqError() {
      if (!this.proSearch) {
        this.filterForm[this.queryType] = this.queryParams
      }
      this.filterForm.page = globalConfig.startPage
      this.getMqErrorList()
    },
    addMqError() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    modifyMqError(row) {
      this.mqErrorForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    deleteMqError(row) {
      const index = this.list.indexOf(row)
      const param = {
        primaryKey: row.id
      }
      this.listLoading = true
      delMqError(param).then(response => {
        if (response.data.error_no === 0) {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.list.splice(index, 1)
        } else {
          this.$message(response.data.error_info)
        }
        this.listLoading = false
      })
    },
    deleteBatch() {
      const selection = this.$refs.multipleTable.selection
      const selectIds = []
      const indexs = []
      for (var i = 0; i < selection.length; i++) {
        selectIds.push(selection[i].id)
        indexs.push(this.list.indexOf(selection[i]))
      }
      const param = {
        primaryKeys: selectIds
      }
      this.listLoading = true
      delBatchMqError(param).then(response => {
        if (response.data.error_no === 0) {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          indexs.forEach(index => {
            this.list.splice(index, 1)
          })
        } else {
          this.$message(response.data.error_info)
        }
        this.listLoading = false
      })
    },
    pageSizeChange(val) {
      this.filterForm.limit = val
      this.getMqErrorList()
    },
    currentPageChange(val) {
      this.filterForm.page = val
      this.getMqErrorList()
    },
    addSubmit() {
      this.refs['mqErrorForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          addMqError(this.mqErrorForm).then(response => {
            if (response.data.error_no === 0) {
              this.list.unshift(this.resForm)
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: response.data.error_info,
                type: 'success',
                duration: 2000
              })
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
      this.$refs['mqErrorForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          editMqError(this.mqErrorForm).then(response => {
            if (response.data.error_no === 0) {
              for (const v of this.list) {
                if (v.id === this.mqErrorForm.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.mqErrorForm)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: response.data.error_info,
                type: 'success',
                duration: 2000
              })
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
        commandId: '',
        createDate: [],
        exceptionInfo: '',
        exceptionNo: '',
        page: globalConfig.startPage,
        limit: globalConfig.initPageSize
      }
    },
    resetForm() {
      this.mqErrorForm = {
        id: '',
        commandId: '',
        createDate: '',
        exceptionInfo: '',
        exceptionNo: ''
      }
      if (this.$refs['mqErrorForm'] !== undefined) {
        this.$refs['mqErrorForm'].resetFields()
      }
    },
    handleDownload() {
      this.downloadLoading = true
      require.ensure([], () => {
        const { export_json_to_excel } = require('vendor/Export2Excel')
        const tHeader = [
          '',
          '指令id',
          '',
          '异常信息',
          '异常码']
        const filterVal = [
          'id',
          'commandId',
          'createDate',
          'exceptionInfo',
          'exceptionNo']
        const list = this.list
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, '')
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
    }
  }
}
</script>
