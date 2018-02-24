<template>
<div class="app-container calendar-list-container">
<div class="filter-container">
<el-form :model="filterForm" ref="filterForm">
  <div v-if=proSearch>
   <el-row>
    <el-col :span="7">
      <el-form-item label="" :label-width="filterFormLabelWidth" prop="id" class="form-bottom">
	    <el-input @keyup.enter.native="searchMqExecuteInfo" size="small" class="filter-item" placeholder="" v-model="filterForm.id">
	    </el-input>
	  </el-form-item>
    </el-col>
    <el-col :span="7">
      <el-form-item label="指令id" :label-width="filterFormLabelWidth" prop="commandId" class="form-bottom">
	    <el-input @keyup.enter.native="searchMqExecuteInfo" size="small" class="filter-item" placeholder="指令id" v-model="filterForm.commandId">
	    </el-input>
	  </el-form-item>
    </el-col>
    <el-col :span="7">
      <el-form-item label="执行状态" :label-width="filterFormLabelWidth" prop="executeStatus" class="form-bottom">
	  	<el-select @keyup.enter.native="searchMqExecuteInfo" size="small" class="filter-item" clearable placeholder="请选择" v-model="filterForm.executeStatus">
          <el-option v-for="item in executeStatusMapArr" :key="item.enumValue" :label="item.enumName" :value="item.enumValue">
          </el-option>
        </el-select>
	  </el-form-item>
    </el-col>
	</el-row>
   <el-row>
    <el-col :span="7">
      <el-form-item label="申请执行时间" :label-width="filterFormLabelWidth" prop="applyExecuteDate" class="form-bottom">
		<el-date-picker v-model="filterForm.applyExecuteDate" type="datetimerange" placeholder="申请执行时间" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" prop="applyExecuteDate">
		</el-date-picker>
	  </el-form-item>
    </el-col>
    <el-col :span="7">
      <el-form-item label="执行结束时间" :label-width="filterFormLabelWidth" prop="overExecuteDate" class="form-bottom">
		<el-date-picker v-model="filterForm.overExecuteDate" type="datetimerange" placeholder="执行结束时间" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" prop="overExecuteDate">
		</el-date-picker>
	  </el-form-item>
    </el-col>
   </el-row>
	<el-row class="button-group">
      <el-col :span="12" class="searchSimpleBtn">
        <el-form-item label=" " :label-width="filterFormLabelWidth" class="form-bottom">
          <el-button type="primary" size="small" icon="el-icon-search" @click="searchMqExecuteInfo" v-waves>搜索</el-button>
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
            <el-select @keyup.enter.native="searchMqExecuteInfo" size="small" class="filter-item" @change="searchName" clearable placeholder="请选择查询条件" v-model="queryType">
              <el-option v-for="item in searchOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label=" " :label-width="filterFormLabelWidth2" prop="queryParams" class="simple-btn">
            <el-input @keyup.enter.native="searchMqExecuteInfo" size="small" class="filter-item" :placeholder="selectDesc" v-model="queryParams">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" class="searchSimpleBtn">
          <el-button type="primary" size="small" icon="el-icon-search" @click="searchMqExecuteInfo" v-waves>搜索</el-button>
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
	<el-table-column header-align="center" align="center" label="执行状态" prop='executeStatus' :show-overflow-tooltip='true'>
	<template slot-scope="scope">
        <span>{{executeStatusMapObj[scope.row.executeStatus]}}</span>
      </template>
    </el-table-column>
	<el-table-column header-align="center" align="center" label="申请执行时间" prop='applyExecuteDate' :show-overflow-tooltip='true'>
	<template slot-scope="scope">
        <span>{{scope.row.applyExecuteDate}}</span>
      </template>
    </el-table-column>
	<el-table-column header-align="center" align="center" label="执行结束时间" prop='overExecuteDate' :show-overflow-tooltip='true'>
	<template slot-scope="scope">
        <span>{{scope.row.overExecuteDate}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center" label="操作" width="150" fixed='right'>
      <template slot-scope="scope">
        <el-button size="small" type="text" @click="modifyMqExecuteInfo(scope.row,'update')">修改
        </el-button>
        <el-button size="small" type="text" @click="deleteMqExecuteInfo(scope.row,'delete')">删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <div v-show="!listLoading" class="pagination-container">
  	<el-row>
      <el-col :span="12">
        <el-button type="info" plain size="small" icon="el-icon-edit" @click="addMqExecuteInfo">添加</el-button>
        <el-button type="info" plain size="small" :disabled="isBatch" icon="el-icon-delete" @click="deleteBatch">批量删除</el-button>
      </el-col>
      <el-col :span="12">
	    <el-pagination @size-change="pageSizeChange" @current-change="currentPageChange" :current-page.sync="filterForm.page" :page-sizes="pageSize" :page-size="filterForm.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
	    </el-pagination>
      </el-col>
    </el-row>
  </div>

  <el-dialog class="create_dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" size="small">
    <el-form :model="mqExecuteInfoForm" :rules="mqExecuteInfoFormRules" ref="mqExecuteInfoForm" label-width="80px">
        	  <el-row>
	  	<el-col :span="11">
          <el-form-item v-if="dialogStatus=='update'" label="" :label-width="formLabelWidth" prop="id">
            <el-input size="small" v-model="mqExecuteInfoForm.id" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="指令id" :label-width="formLabelWidth" prop="commandId">
            <el-input size="small" v-model="mqExecuteInfoForm.commandId" :maxlength="11"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
	  <el-row>
        <el-col :span="11">
          <el-form-item label="执行状态" :label-width="formLabelWidth" prop="executeStatus">
            <el-select size="small" v-model="mqExecuteInfoForm.executeStatus" clearable placeholder="请选择">
              <el-option v-for="item in executeStatusMapArr" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="申请执行时间" :label-width="formLabelWidth" prop="applyExecuteDate">
        	<el-date-picker v-model="mqExecuteInfoForm.applyExecuteDate" type="datetime" placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
	  <el-row>
        <el-col :span="11">
          <el-form-item label="执行结束时间" :label-width="formLabelWidth" prop="overExecuteDate">
        	<el-date-picker v-model="mqExecuteInfoForm.overExecuteDate" type="datetime" placeholder="选择日期时间"></el-date-picker>
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
import { getMqExecuteInfoList, addMqExecuteInfo, editMqExecuteInfo, delMqExecuteInfo, delBatchMqExecuteInfo } from '@/api/plat/message/mqExecuteInfo'
import { globalConfig } from '@/globalConfig'
import waves from '@/directive/waves/index.js'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

export default {
  name: 'tableMqExecuteInfo',
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
          value: 'executeStatus',
          label: '执行状态'
        },
        {
          value: 'applyExecuteDate',
          label: '申请执行时间'
        },
        {
          value: 'overExecuteDate',
          label: '执行结束时间'
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
        executeStatus: '',
        applyExecuteDate: [],
        overExecuteDate: [],
        page: globalConfig.startPage,
        limit: globalConfig.initPageSize
      },
      dialogStatus: '',
      tableKey: 0,
      dialogFormVisible: false,
      dialogEditFormVisible: false,
      formLabelWidth: '120px',
      mqExecuteInfoForm: {
        id: '',
        commandId: '',
        executeStatus: '',
        applyExecuteDate: '',
        overExecuteDate: ''
      },
      textMap: {
        update: '编辑',
        create: '创建'
      },
      executeStatusMapArr: [],
      executeStatusMapObj: [],
      // 表单校验规则
      mqExecuteInfoFormRules: {
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
        executeStatus: [{
          required: true,
          message: '请选择执行状态',
          trigger: 'change'
        }],
        applyExecuteDate: [{
          required: true,
          message: '请输入申请执行时间',
          trigger: 'blur'
        }],
        overExecuteDate: [{
          required: true,
          message: '请输入执行结束时间',
          trigger: 'blur'
        }]
      }
    }
  },
  computed: {
  },
  created() {
    this.getMqExecuteInfoList()
  },
  methods: {
    getMqExecuteInfoList() {
      this.listLoading = true
      getMqExecuteInfoList(this.filterForm).then(response => {
        if (response.data.error_no === 0) {
          this.list = response.data.result.records
          this.total = response.data.result.total
        } else {
          this.$message(response.data.error_info)
        }
        this.listLoading = false
      })
    },
    searchMqExecuteInfo() {
      if (!this.proSearch) {
        this.filterForm[this.queryType] = this.queryParams
      }
      this.filterForm.page = globalConfig.startPage
      this.getMqExecuteInfoList()
    },
    addMqExecuteInfo() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    modifyMqExecuteInfo(row) {
      this.mqExecuteInfoForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    deleteMqExecuteInfo(row) {
      const index = this.list.indexOf(row)
      const param = {
        primaryKey: row.id
      }
      this.listLoading = true
      delMqExecuteInfo(param).then(response => {
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
      delBatchMqExecuteInfo(param).then(response => {
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
      this.getMqExecuteInfoList()
    },
    currentPageChange(val) {
      this.filterForm.page = val
      this.getMqExecuteInfoList()
    },
    addSubmit() {
      this.$refs['mqExecuteInfoForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          addMqExecuteInfo(this.mqExecuteInfoForm).then(response => {
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
      this.$refs['mqExecuteInfoForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          editMqExecuteInfo(this.mqExecuteInfoForm).then(response => {
            if (response.data.error_no === 0) {
              for (const v of this.list) {
                if (v.id === this.mqExecuteInfoForm.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.mqExecuteInfoForm)
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
        executeStatus: '',
        applyExecuteDate: [],
        overExecuteDate: [],
        page: globalConfig.startPage,
        limit: globalConfig.initPageSize
      }
    },
    resetForm() {
      this.mqExecuteInfoForm = {
        id: '',
        commandId: '',
        executeStatus: '',
        applyExecuteDate: '',
        overExecuteDate: ''
      }
      if (this.$refs['mqExecuteInfoForm'] !== undefined) {
        this.$refs['mqExecuteInfoForm'].resetFields()
      }
    },
    handleDownload() {
      this.downloadLoading = true
      require.ensure([], () => {
        const { export_json_to_excel } = require('vendor/Export2Excel')
        const tHeader = [
          '',
          '指令id',
          '执行状态',
          '申请执行时间',
          '执行结束时间'
        ]
        const filterVal = [
          'id',
          'commandId',
          'executeStatus',
          'applyExecuteDate',
          'overExecuteDate'
        ]
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
