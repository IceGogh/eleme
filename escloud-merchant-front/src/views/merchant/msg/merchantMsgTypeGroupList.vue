<template>
  <div class="app-container calendar-list-container">
    <div v-if=proSearch>
      <div class="filter-container">
        <el-form :model="filterForm" ref="filterForm">
          <el-row>
            <el-col :span="8">
              <el-form-item label="组名称" :label-width="filterFormLabelWidth" prop="msgGroupName" class="form-bottom">
                <el-input @keyup.enter.native="searchMerchantMsgTypeGroup" size="small" class="filter-item" placeholder="组名称" v-model="filterForm.msgGroupName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="组描述" :label-width="filterFormLabelWidth" prop="msgGroupDesc" class="form-bottom">
                <el-input @keyup.enter.native="searchMerchantMsgTypeGroup" size="small" class="filter-item" placeholder="组描述" v-model="filterForm.msgGroupDesc"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="创建人" :label-width="filterFormLabelWidth" prop="createBy" class="form-bottom">
                <el-input @keyup.enter.native="searchMerchantMsgTypeGroup" size="small" class="filter-item" placeholder="创建人" v-model="filterForm.createBy"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="更新人" :label-width="filterFormLabelWidth" prop="updateBy" class="form-bottom">
                <el-input @keyup.enter.native="searchMerchantMsgTypeGroup" size="small" class="filter-item" placeholder="更新人" v-model="filterForm.updateBy"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="button-group">
            <el-col :span="12" class="searchSimpleBtn">
              <el-form-item label=" " :label-width="filterFormLabelWidth" class="form-bottom">
                <el-button type="primary" size="small" icon="search" @click="searchMerchantMsgTypeGroup" v-waves>搜索</el-button>
                <el-button type="primary" plain size="small" icon="delete" @click="resetSearch" v-waves>清空</el-button>
              </el-form-item>
            </el-col>
            <el-col v-if=proSearch :span="12" class="searchProBtn">
              <el-button type="primary" plain size="small" icon="document" @click="handleDownload" :loading="downloadLoading">导出</el-button>
              <el-button type="primary" plain size="small" icon="search" @click="changeProButton" v-waves>简单搜索</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div v-else class="simpleFilter">
      <el-form>
        <el-row class="button-group">
        <span v-if=!proSearch>
        <el-col :span="3">
          <el-form-item label=" " :label-width="filterFormLabelWidth2" prop="queryType" class="simple-btn first">
           <el-select @keyup.enter.native="searchMerchantMsgTypeGroup" size="small" class="filter-item" @change="searchName" clearable placeholder="请选择查询条件" v-model="queryType">
             <el-option v-for="item in searchOptions" :key="item.value" :label="item.label" :value="item.value">
             </el-option>
           </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label=" " :label-width="filterFormLabelWidth2" prop="queryParams" class="simple-btn">
           <el-input @keyup.enter.native="searchMerchantMsgTypeGroup" size="small" class="filter-item" :placeholder="selectDesc" v-model="queryParams">
           </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" class="searchSimpleBtn">
          <el-button type="primary" size="small" icon="search" @click="searchMerchantMsgTypeGroup" v-waves>搜索</el-button>
        </el-col>
        </span>
          <el-col v-if=!proSearch :span="12" class="searchProBtn">
            <el-button type="primary" plain size="small" icon="document" @click="handleDownload" :loading="downloadLoading">导出</el-button>
            <el-button type="primary" plain size="small" icon="search" @click="changeProButton" v-waves>高级搜索</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table ref="multipleTable" :key='tableKey' :data="list" stripe fit highlight-current-row size='mini' :default-sort="{prop: 'id', order: 'aescending'}" @select="selectCheckBox" @select-all="selectAllCheckBox" v-loading="listLoading" element-loading-text="给我一点时间" style="width: 100%">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column type="index" width="62"></el-table-column>
      <el-table-column header-align="center" align="center" label="id" prop='id' v-if=false sortable>
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="组名称" prop='msgGroupName'>
        <template slot-scope="scope">
          <span>{{scope.row.msgGroupName}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="组描述" prop='msgGroupDesc' :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span>{{scope.row.msgGroupDesc}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="创建日期" prop='createDate'>
        <template slot-scope="scope">
          <span>{{scope.row.createDate}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="创建人" prop='createBy'>
        <template slot-scope="scope">
          <span>{{scope.row.createBy}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="更新日期" prop='updateDate'>
        <template slot-scope="scope">
          <span>{{scope.row.updateDate}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="更新人" prop='updateBy'>
        <template slot-scope="scope">
          <span>{{scope.row.updateBy}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="240" fixed='right'>
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="modifyMerchantMsgTypeGroup(scope.row,'update')">修改
          </el-button>
          <el-button size="small" type="text" @click="deleteMerchantMsgTypeGroup(scope.row,'delete')">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-row>
        <el-col :span="7">
          <el-button type="info" plain size="small" icon="edit" @click="addMerchantMsgTypeGroup">添加</el-button>
          <el-button type="info" plain size="small" :disabled="isBatch" icon="delete" @click="deleteBatch">批量删除</el-button>
        </el-col>
        <el-col :span="17">
          <el-pagination @size-change="pageSizeChange" @current-change="currentPageChange" :current-page.sync="filterForm.current" :page-sizes="pageSize" :page-size="filterForm.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </el-col>
      </el-row>
    </div>

    <el-dialog class="create_dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" size="small" :before-close="closeDialog">
      <el-form :model="merchantMsgTypeGroupForm" :rules="merchantMsgTypeGroupFormRules" ref="merchantMsgTypeGroupForm" label-width="80px">
        <el-row>
          <el-col :span="11">
            <el-form-item v-if="dialogStatus=='update'" label="id" :label-width="formLabelWidth" prop="id">
              <el-input size="small" v-model="merchantMsgTypeGroupForm.id" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="组名称" :label-width="formLabelWidth" prop="msgGroupName">
              <el-input size="small" v-model="merchantMsgTypeGroupForm.msgGroupName" :maxlength="50"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="组描述" :label-width="formLabelWidth" prop="msgGroupDesc">
              <el-input size="small" v-model="merchantMsgTypeGroupForm.msgGroupDesc" :maxlength="100"></el-input>
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

    <image-cropper :width="300" :height="300" url="https://httpbin.org/post" @close='close' @crop-upload-success="cropSuccess" :key="imagecropperKey" v-show="imagecropperShow"></image-cropper>

  </div>
</template>
<script>
  import { getMerchantMsgTypeGroupList, addMerchantMsgTypeGroup, editMerchantMsgTypeGroup, delMerchantMsgTypeGroup, delBatchMerchantMsgTypeGroup } from '@/api/merchant/msg/merchantMsgTypeGroup'
  import { globalConfig } from '@/globalConfig'
  import waves from '@/directive/waves/index.js'
  import ImageCropper from '@/components/ImageCropper'
  import PanThumb from '@/components/PanThumb'

  export default {
    name: 'tableMerchantMsgTypeGroup',
    directives: {
      waves
    },
    components: { ImageCropper, PanThumb },
    data() {
      return {
        curApplicationCode: '',
        list: [],
        searchOptions: [
          {
            value: 'id',
            label: 'id'
          },
          {
            value: 'msgGroupName',
            label: '组名称'
          },
          {
            value: 'msgGroupDesc',
            label: '组描述'
          },
          {
            value: 'createDate',
            label: '创建日期'
          },
          {
            value: 'createBy',
            label: '创建人'
          },
          {
            value: 'updateDate',
            label: '更新日期'
          },
          {
            value: 'updateBy',
            label: '更新人'
          }
        ],
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
          msgGroupName: '',
          msgGroupDesc: '',
          createDate: [],
          createBy: '',
          updateDate: [],
          updateBy: '',
          current: globalConfig.startPage,
          pageSize: globalConfig.initPageSize
        },
        dialogStatus: '',
        tableKey: 0,
        dialogFormVisible: false,
        dialogEditFormVisible: false,
        formLabelWidth: '120px',
        merchantMsgTypeGroupForm: {
          id: '',
          msgGroupName: '',
          msgGroupDesc: '',
          createDate: '',
          createBy: '',
          updateDate: '',
          updateBy: ''
        },
        textMap: {
          update: '编辑',
          create: '创建'
        },
        // 表单校验规则
        merchantMsgTypeGroupFormRules: {
          id: [{
            type: 'number',
            required: true,
            message: '请输入id',
            trigger: 'blur'
          }, {
            type: 'number',
            message: 'id必须为数字值'
          }],
          msgGroupName: [{
            required: true,
            message: '请输入组名称',
            trigger: 'blur'
          }],
          msgGroupDesc: [{
            required: true,
            message: '请输入组描述',
            trigger: 'blur'
          }],
          updateDate: [{
            required: true,
            message: '请输入更新日期',
            trigger: 'blur'
          }],
          updateBy: [{
            required: true,
            message: '请输入更新人',
            trigger: 'blur'
          }]
        }
      }
    },
    computed: {
    },
    created() {
      this.curApplicationCode = this.$store.state.app.applicationCode
      this.getMerchantMsgTypeGroupList()
    },
    methods: {
      getMerchantMsgTypeGroupList() {
        this.listLoading = true
        this.filterForm.curApplicationCode = this.curApplicationCode
        getMerchantMsgTypeGroupList(this.filterForm).then(response => {
          if (response.data.error_no === 0) {
            this.list = response.data.result.records
            this.total = response.data.result.total
          } else {
            this.$message(response.data.error_info)
          }
          this.listLoading = false
        })
      },
      searchMerchantMsgTypeGroup() {
        if (!this.proSearch) {
          this.filterForm[this.queryType] = this.queryParams
        }
        this.filterForm.current = globalConfig.startPage
        this.getMerchantMsgTypeGroupList()
      },
      addMerchantMsgTypeGroup() {
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      modifyMerchantMsgTypeGroup(row) {
        this.merchantMsgTypeGroupForm = Object.assign({}, row)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },
      deleteMerchantMsgTypeGroup(row) {
        const param = {
          primaryKey: row.id,
          curApplicationCode: this.curApplicationCode
        }
        this.listLoading = true
        if (!window.confirm('是否确认删除')) {
          this.listLoading = false
          return
        }
        delMerchantMsgTypeGroup(param).then(response => {
          if (response.data.error_no === 0) {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.searchMerchantMsgTypeGroup()
            this.$refs.multipleTable.clearSelection()
          } else {
            this.$message(response.data.error_info)
          }
          this.listLoading = false
        })
      },
      deleteBatch() {
        const selection = this.$refs.multipleTable.selection
        const selectIds = []
        for (let i = 0; i < selection.length; i++) {
          selectIds.push(selection[i].id)
        }
        const param = {
          primaryKeys: selectIds,
          curApplicationCode: this.curApplicationCode
        }
        this.listLoading = true
        if (!window.confirm('是否确认删除')) {
          this.listLoading = false
          return
        }
        delBatchMerchantMsgTypeGroup(param).then(response => {
          if (response.data.error_no === 0) {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.searchMerchantMsgTypeGroup()
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
        this.getMerchantMsgTypeGroupList()
      },
      currentPageChange(val) {
        this.filterForm.current = val
        this.getMerchantMsgTypeGroupList()
      },
      addSubmit() {
        this.$refs['merchantMsgTypeGroupForm'].validate((valid) => {
          if (valid) {
            this.listLoading = true
            this.merchantMsgTypeForm.curApplicationCode = this.curApplicationCode
            addMerchantMsgTypeGroup(this.merchantMsgTypeGroupForm).then(response => {
              if (response.data.error_no === 0) {
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: response.data.error_info,
                  type: 'success',
                  duration: 2000
                })
                this.closeDialog()
                this.searchMerchantMsgTypeGroup()
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
        this.merchantMsgTypeForm.curApplicationCode = this.curApplicationCode
        this.$refs['merchantMsgTypeGroupForm'].validate((valid) => {
          if (valid) {
            this.listLoading = true
            editMerchantMsgTypeGroup(this.merchantMsgTypeGroupForm).then(response => {
              if (response.data.error_no === 0) {
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功', message: response.data.error_info, type: 'success', duration: 2000
                })
                this.closeDialog()
                this.searchMerchantMsgTypeGroup()
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
          msgGroupName: '',
          msgGroupDesc: '',
          createDate: [],
          createBy: '',
          updateDate: [],
          updateBy: '',
          current: globalConfig.startPage,
          pageSize: globalConfig.initPageSize,
          curApplicationCode: this.curApplicationCode
        }
      },
      resetForm() {
        this.merchantMsgTypeGroupForm = {
          id: '',
          msgGroupName: '',
          msgGroupDesc: '',
          createDate: '',
          createBy: '',
          updateDate: '',
          updateBy: '',
          curApplicationCode: this.curApplicationCode
        }
        if (this.$refs['merchantMsgTypeGroupForm'] !== undefined) {
          this.$refs['merchantMsgTypeGroupForm'].resetFields()
        }
      },
      handleDownload() {
        this.downloadLoading = true
        require.ensure([], () => {
          const { export_json_to_excel } = require('vendor/Export2Excel')
          const tHeader = [
            'id', '组名称', '组描述', '创建日期', '创建人', '更新日期', '更新人'
          ]
          const filterVal = [
            'id', 'msgGroupName', 'msgGroupDesc', 'createDate', 'createBy', 'updateDate', 'updateBy'
          ]
          const list = this.list
          const data = this.formatJson(filterVal, list)
          export_json_to_excel(tHeader, data, '消息类型组表')
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
