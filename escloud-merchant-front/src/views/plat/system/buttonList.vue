<template>
<div class="app-container calendar-list-container">
  <div class="filter-container">
    <el-form :model="filterForm" ref="filterForm">
      <div v-if=proSearch>
        <el-row>
          <el-col :span="8">
            <el-form-item label="按钮编号" :label-width="filterFormLabelWidth" prop="btnNo" class="form-bottom">
              <el-input @keyup.enter.native="searchButton" size="small" class="filter-item" placeholder="按钮编号" v-model="filterForm.btnNo">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="名称" :label-width="filterFormLabelWidth" prop="btnName" class="form-bottom">
              <el-input @keyup.enter.native="searchButton" size="small" class="filter-item" placeholder="名称" v-model="filterForm.btnName">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="菜单编码" :label-width="filterFormLabelWidth" prop="menuNo" class="form-bottom">
              <el-input @keyup.enter.native="searchButton" size="small" class="filter-item" placeholder="菜单编码" v-model="filterForm.menuNo">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="请求地址" :label-width="filterFormLabelWidth" prop="btnUrl" class="form-bottom">
              <el-input @keyup.enter.native="searchButton" size="small" class="filter-item" placeholder="请求地址" v-model="filterForm.btnUrl">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="button-group">
          <el-col :span="12" class="searchSimpleBtn">
            <el-form-item label=" " :label-width="filterFormLabelWidth" class="form-bottom">
              <el-button type="primary" size="small" icon="el-icon-search" @click="searchButton" v-waves>搜索</el-button>
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
            <el-select @keyup.enter.native="searchButton" size="small" class="filter-item" @change="searchName" clearable placeholder="请选择查询条件" v-model="queryType">
              <el-option v-for="item in searchOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label=" " :label-width="filterFormLabelWidth2" prop="queryParams" class="simple-btn">
            <el-input @keyup.enter.native="searchButton" size="small" class="filter-item" :placeholder="selectDesc" v-model="queryParams">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" class="searchSimpleBtn">
          <el-button type="primary" size="small" icon="el-icon-search" @click="searchButton" v-waves>搜索</el-button>
        </el-col>
        </span>
        <el-col v-if=!proSearch :span="12" class="searchProBtn">
          <el-button type="primary" plain size="small" icon="el-icon-document" @click="handleDownload" :loading="downloadLoading">导出</el-button>
          <el-button type="primary" plain size="small" icon="el-icon-search" @click="changeProButton" v-waves>高级搜索</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
  <el-table ref="multipleTable" :key='tableKey' :data="list" stripe fit highlight-current-row size='mini' :default-sort="{prop: 'id', order: 'aescending'}" @select="selectCheckBox" @select-all="selectAllCheckBox" v-loading="listLoading" element-loading-text="给我一点时间"
    style="width: 100%">
    <el-table-column type="selection" width="50"></el-table-column>
    <el-table-column type="index" width="62"></el-table-column>
    <el-table-column header-align="center" align="center" label="主键ID" prop='id' v-if=false sortable>
      <template slot-scope="scope">
        <span>{{scope.row.id}}</span>
      </template>
    </el-table-column>
    <el-table-column header-align="center" align="center" label="按钮编号" prop='btnNo'>
      <template slot-scope="scope">
        <span>{{scope.row.btnNo}}</span>
      </template>
    </el-table-column>
    <el-table-column header-align="center" align="center" label="名称" prop='btnName'>
      <template slot-scope="scope">
        <span>{{scope.row.btnName}}</span>
      </template>
    </el-table-column>
    <el-table-column header-align="center" align="center" label="菜单编码" prop='menuNo'>
      <template slot-scope="scope">
        <span>{{scope.row.menuNo}}</span>
      </template>
    </el-table-column>
    <el-table-column header-align="center" align="center" label="请求地址" prop='btnUrl' :show-overflow-tooltip='true'>
      <template slot-scope="scope">
        <span>{{scope.row.btnUrl}}</span>
      </template>
    </el-table-column>
    <el-table-column header-align="center" align="center" label="创建人" prop='createBy'>
      <template slot-scope="scope">
        <span>{{scope.row.createBy}}</span>
      </template>
    </el-table-column>
    <el-table-column header-align="center" align="center" label="创建时间" prop='createDate' v-if=false sortable>
      <template slot-scope="scope">
        <span>{{scope.row.createDate}}</span>
      </template>
    </el-table-column>
    <el-table-column header-align="center" align="center" label="修改人" prop='modifyBy'>
      <template slot-scope="scope">
        <span>{{scope.row.modifyBy}}</span>
      </template>
    </el-table-column>
    <el-table-column header-align="center" align="center" label="修改时间" prop='modifyDate'>
      <template slot-scope="scope">
        <span>{{scope.row.modifyDate}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center" label="操作" width="150" fixed='right'>
      <template slot-scope="scope">
        <el-button size="small" type="text" @click="modifyButton(scope.row,'update')">修改
        </el-button>
        <el-button size="small" type="text" @click="deleteButton(scope.row,'delete')">删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <div v-show="!listLoading" class="pagination-container">
    <el-row>
      <el-col :span="12">
        <el-button type="info" plain size="small" icon="el-icon-edit" @click="addButton">添加</el-button>
        <el-button type="info" plain size="small" :disabled="isBatch" icon="el-icon-delete" @click="deleteAll">批量删除</el-button>
      </el-col>
      <el-col :span="12">
        <el-pagination @size-change="pageSizeChange" @current-change="currentPageChange" :current-page.sync="filterForm.current" :page-sizes="pageSize" :page-size="filterForm.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </el-col>
    </el-row>
  </div>

  <el-dialog class="create_dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" size="small" :before-close="closeDialog">
    <el-form :model="buttonForm" :rules="buttonFormRules" ref="buttonForm" label-width="80px">
      <el-row>
        <el-col :span="11">
          <el-form-item v-if="dialogStatus=='update'" label="主键ID" :label-width="formLabelWidth" prop="id">
            <el-input size="small" v-model="buttonForm.id" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="按钮编号" :label-width="formLabelWidth" prop="btnNo">
            <el-input size="small" v-model="buttonForm.btnNo" :maxlength="32"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="名称" :label-width="formLabelWidth" prop="btnName">
            <el-input size="small" v-model="buttonForm.btnName" :maxlength="20"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="菜单编码" :label-width="formLabelWidth" prop="menuNo">
            <el-input size="small" v-model="buttonForm.menuNo" :maxlength="32"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22">
          <el-form-item label="请求地址" :label-width="formLabelWidth" prop="btnUrl">
            <el-input size="small" v-model="buttonForm.btnUrl" :maxlength="127" resize='vertical' type="textarea" :autosize="{ minRows: 5, maxRows: 10}" placeholder="请输入内容"></el-input>
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
</template>
<script>
import {
  getButtonList,
  addButton,
  editButton,
  delButton,
  delAllButton
} from '@/api/plat/button'
import {
  globalConfig
} from '@/globalConfig'
import waves from '@/directive/waves/index.js'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

export default {
  name: 'tableButton',
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
        value: 'btnNo',
        label: '按钮编号'
      },
      {
        value: 'btnName',
        label: '名称'
      },
      {
        value: 'menuNo',
        label: '菜单编码'
      },
      {
        value: 'btnUrl',
        label: '请求地址'
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
        btnNo: '',
        btnName: '',
        menuNo: '',
        btnUrl: '',
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
      buttonForm: {
        id: '',
        btnNo: '',
        btnName: '',
        menuNo: '',
        btnUrl: '',
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
      buttonFormRules: {
        id: [{
          type: 'number',
          required: true,
          message: '请输入主键ID',
          trigger: 'blur'
        }, {
          type: 'number',
          message: '主键ID必须为数字值'
        }],
        btnNo: [{
          required: true,
          message: '请输入按钮编号',
          trigger: 'blur'
        }],
        btnName: [{
          required: true,
          message: '请输入名称',
          trigger: 'blur'
        }],
        menuNo: [{
          required: true,
          message: '请输入菜单编码',
          trigger: 'blur'
        }],
        btnUrl: [{
          required: true,
          message: '请输入请求地址',
          trigger: 'blur'
        }]
      }
    }
  },
  computed: {},
  created() {
    this.getButtonList()
  },
  methods: {
    getButtonList() {
      this.listLoading = true
      getButtonList(this.filterForm).then(response => {
        if (response.data.error_no === 0) {
          this.list = response.data.result.records
          this.total = response.data.result.total
        } else {
          this.$message(response.data.error_info)
        }
        this.listLoading = false
      })
    },
    searchButton() {
      if (!this.proSearch) {
        this.filterForm[this.queryType] = this.queryParams
      }
      this.filterForm.current = globalConfig.startPage
      this.getButtonList()
    },
    addButton() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    modifyButton(row) {
      this.buttonForm.id = row.id
      this.buttonForm.btnNo = row.btnNo
      this.buttonForm.btnName = row.btnName
      this.buttonForm.menuNo = row.menuNo
      this.buttonForm.btnUrl = row.btnUrl
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    deleteButton(row) {
      const param = {
        primaryKey: row.id
      }
      this.listLoading = true
      delButton(param).then(response => {
        if (response.data.error_no === 0) {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.searchButton()
          this.$refs.multipleTable.clearSelection()
        } else {
          this.$message(response.data.error_info)
        }
        this.listLoading = false
      })
    },
    deleteAll() {
      const selection = this.$refs.multipleTable.selection
      const selectIds = []
      for (var i = 0; i < selection.length; i++) {
        selectIds.push(selection[i].id)
      }
      const param = {
        primaryKeys: selectIds
      }
      this.listLoading = true
      delAllButton(param).then(response => {
        if (response.data.error_no === 0) {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.searchButton()
          this.$refs.multipleTable.clearSelection()
        } else {
          this.$message(response.data.error_info)
        }
        this.listLoading = false
      })
    },
    pageSizeChange(val) {
      this.filterForm.current = globalConfig.startPage
      this.filterForm.pageSize = val
      this.getButtonList()
    },
    currentPageChange(val) {
      this.filterForm.current = val
      this.getButtonList()
    },
    addSubmit() {
      this.$refs['buttonForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          addButton(this.buttonForm).then(response => {
            if (response.data.error_no === 0) {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: response.data.error_info,
                type: 'success',
                duration: 2000
              })
              this.closeDialog()
              this.searchButton()
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
      this.$refs['buttonForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          editButton(this.buttonForm).then(response => {
            if (response.data.error_no === 0) {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: response.data.error_info,
                type: 'success',
                duration: 2000
              })
              this.closeDialog()
              this.searchButton()
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
        btnNo: '',
        btnName: '',
        menuNo: '',
        btnUrl: '',
        createBy: '',
        createDate: [],
        modifyBy: '',
        modifyDate: [],
        current: globalConfig.startPage,
        pageSize: globalConfig.initPageSize
      }
    },
    resetForm() {
      this.buttonForm = {
        id: '',
        btnNo: '',
        btnName: '',
        menuNo: '',
        btnUrl: '',
        createBy: '',
        createDate: '',
        modifyBy: '',
        modifyDate: ''
      }
      if (this.$refs['buttonForm'] !== undefined) {
        this.$refs['buttonForm'].resetFields()
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
          '按钮编号',
          '名称',
          '菜单编码',
          '按钮样式',
          '按钮JS',
          '图标',
          '请求地址',
          '创建人',
          '创建时间',
          '修改人',
          '修改时间'
        ]
        const filterVal = [
          'id',
          'btnNo',
          'btnName',
          'menuNo',
          'btnUrl',
          'createBy',
          'createDate',
          'modifyBy',
          'modifyDate'
        ]
        const list = this.list
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, '平台按钮资源')
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
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
