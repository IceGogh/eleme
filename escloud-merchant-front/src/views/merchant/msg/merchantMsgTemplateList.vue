<template>
  <div class="app-container calendar-list-container">
    <div v-if=proSearch>
      <div class="filter-container">
        <el-form :model="filterForm" ref="filterForm">
          <el-row>
            <el-col :span="8">
              <el-form-item label="消息模板名称" :label-width="filterFormLabelWidth" prop="msgTemplateName" class="form-bottom">
                <el-input @keyup.enter.native="searchMerchantMsgTemplate" size="small" class="filter-item" placeholder="消息模板名称" v-model="filterForm.msgTemplateName">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="消息模板编号" :label-width="filterFormLabelWidth" prop="msgTemplateNo" class="form-bottom">
                <el-input @keyup.enter.native="searchMerchantMsgTemplate" size="small" class="filter-item" placeholder="消息模板编号" v-model="filterForm.msgTemplateNo">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="发送途径" :label-width="filterFormLabelWidth" prop="msgSendway" class="form-bottom">
                <el-input @keyup.enter.native="searchMerchantMsgTemplate" size="small" class="filter-item" placeholder="发送途径" v-model="filterForm.msgSendway">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="消息模板描述" :label-width="filterFormLabelWidth" prop="msgTemplateDesc" class="form-bottom">
                <el-input @keyup.enter.native="searchMerchantMsgTemplate" size="small" class="filter-item" placeholder="消息模板描述" v-model="filterForm.msgTemplateDesc">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="button-group">
            <el-col :span="12" class="searchSimpleBtn">
              <el-form-item label=" " :label-width="filterFormLabelWidth" class="form-bottom">
                <el-button type="primary" size="small" icon="search" @click="searchMerchantMsgTemplate" v-waves>搜索</el-button>
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
            <el-select @keyup.enter.native="searchMerchantMsgTemplate" size="small" class="filter-item" @change="searchName" clearable placeholder="请选择查询条件" v-model="queryType">
              <el-option v-for="item in searchOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label=" " :label-width="filterFormLabelWidth2" prop="queryParams" class="simple-btn">
            <el-input @keyup.enter.native="searchMerchantMsgTemplate" size="small" class="filter-item" :placeholder="selectDesc" v-model="queryParams">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" class="searchSimpleBtn">
          <el-button type="primary" size="small" icon="search" @click="searchMerchantMsgTemplate" v-waves>搜索</el-button>
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
      <el-table-column header-align="center" align="center" label="消息模板名称" prop='msgTemplateName' :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span>{{scope.row.msgTemplateName}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="消息模板编号" prop='msgTemplateNo' :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span>{{scope.row.msgTemplateNo}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="发送途径" prop='msgSendway'>
        <template slot-scope="scope">
          <span>{{scope.row.msgSendway}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="消息模板描述" prop='msgTemplateDesc' :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span>{{scope.row.msgTemplateDesc}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="240" fixed='right'>
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="modifyMerchantMsgTemplate(scope.row,'update')">修改
          </el-button>
          <el-button size="small" type="text" @click="deleteMerchantMsgTemplate(scope.row,'delete')">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-row>
        <el-col :span="7">
          <el-button type="info" plain size="small" icon="edit" @click="addMerchantMsgTemplate">添加</el-button>
          <el-button type="info" plain size="small" :disabled="isBatch" icon="delete" @click="deleteBatch">批量删除</el-button>
        </el-col>
        <el-col :span="17">
          <el-pagination @size-change="pageSizeChange" @current-change="currentPageChange" :current-page.sync="filterForm.current" :page-sizes="pageSize" :page-size="filterForm.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </el-col>
      </el-row>
    </div>

    <el-dialog class="create_dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" size="small" :before-close="closeDialog">
      <el-form :model="merchantMsgTemplateForm" :rules="merchantMsgTemplateFormRules" ref="merchantMsgTemplateForm" label-width="80px">
        <el-row>
          <el-col :span="11">
            <el-form-item label="消息模板名称" :label-width="formLabelWidth" prop="msgTemplateName">
              <el-input size="small" v-model="merchantMsgTemplateForm.msgTemplateName" :maxlength="2"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="发送途径" :label-width="formLabelWidth" prop="msgSendway">
              <el-input size="small" v-model="merchantMsgTemplateForm.msgSendway" :maxlength="2"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="消息模板描述" :label-width="formLabelWidth" prop="msgTemplateDesc">
              <el-input size="small" v-model="merchantMsgTemplateForm.msgTemplateDesc" :maxlength="2"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
            <el-col :span="22">
              <el-form-item label="消息模板内容" :label-width="formLabelWidth" prop="msgTemplateContent">
                <el-input size="small" v-model="merchantMsgTemplateForm.msgTemplateContent" :maxlength="10000" resize='vertical' type="textarea" :autosize="{ minRows: 3, maxRows: 6}" placeholder="请输入内容"></el-input>
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
    <!--<image-cropper :width="300" :height="300" url="https://httpbin.org/post" @close='close' @crop-upload-success="cropSuccess" :key="imagecropperKey" v-show="imagecropperShow"></image-cropper>-->
  </div>
</template>


<script>
  import { getMerchantMsgTemplateList, addMerchantMsgTemplate, editMerchantMsgTemplate, delMerchantMsgTemplate, delBatchMerchantMsgTemplate } from '@/api/merchant/msg/merchantMsgTemplate'
  import { globalConfig } from '@/globalConfig'
  import waves from '@/directive/waves/index.js'
  import ImageCropper from '@/components/ImageCropper'
  import PanThumb from '@/components/PanThumb'

  export default {
    name: 'tableMerchantMsgTemplate',
    directives: {
      waves
    },
    components: { ImageCropper, PanThumb },
    data() {
      return {
        config: {
          initialFrameWidth: null,
          initialFrameHeight: 320
        },
        curApplicationCode: '',
        list: [],
        searchOptions: [
          {
            value: 'msgTemplateName',
            label: '消息模板名称'
          },
          {
            value: 'msgTemplateNo',
            label: '消息模板编号'
          },
          {
            value: 'msgSendway',
            label: '发送途径'
          },
          {
            value: 'msgTemplateDesc',
            label: '消息模板描述'
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
          msgTemplateName: '',
          msgTemplateNo: '',
          msgTemplateContent: '',
          msgSendway: '',
          msgTemplateDesc: '',
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
        merchantMsgTemplateForm: {
          id: '',
          msgTemplateName: '',
          msgTemplateNo: '',
          msgTemplateContent: '',
          msgSendway: '',
          msgTemplateDesc: '',
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
        merchantMsgTemplateFormRules: {
          id: [{
            type: 'number',
            required: true,
            message: '请输入id',
            trigger: 'blur'
          }, {
            type: 'number',
            message: 'id必须为数字值'
          }],
          msgTemplateName: [{
            required: true,
            message: '请输入消息模板编号',
            trigger: 'blur'
          }],
          msgTemplateNo: [{
            required: true,
            message: '请输入消息模板编号',
            trigger: 'blur'
          }],
          msgTemplateContent: [{
            required: true,
            message: '请输入消息模板内容',
            trigger: 'blur'
          }],
          msgSendway: [{
            required: true,
            message: '请输入发送途径',
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
      this.getMerchantMsgTemplateList()
    },
    methods: {
      getMerchantMsgTemplateList() {
        this.listLoading = true
        this.filterForm.curApplicationCode = this.curApplicationCode
        getMerchantMsgTemplateList(this.filterForm).then(response => {
          if (response.data.error_no === 0) {
            this.list = response.data.result.records
            this.total = response.data.result.total
          } else {
            this.$message(response.data.error_info)
          }
          this.listLoading = false
        })
      },
      searchMerchantMsgTemplate() {
        if (!this.proSearch) {
          this.filterForm[this.queryType] = this.queryParams
        }
        this.filterForm.current = globalConfig.startPage
        this.getMerchantMsgTemplateList()
      },
      addMerchantMsgTemplate() {
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      modifyMerchantMsgTemplate(row) {
        this.merchantMsgTemplateForm = Object.assign({}, row)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },
      deleteMerchantMsgTemplate(row) {
        const param = {
          primaryKey: row.id,
          curApplicationCode: this.curApplicationCode
        }
        this.listLoading = true
        delMerchantMsgTemplate(param).then(response => {
          if (response.data.error_no === 0) {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.searchMerchantMsgTemplate()
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
        delBatchMerchantMsgTemplate(param).then(response => {
          if (response.data.error_no === 0) {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.searchMerchantMsgTemplate()
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
        this.getMerchantMsgTemplateList()
      },
      currentPageChange(val) {
        this.filterForm.current = val
        this.getMerchantMsgTemplateList()
      },
      addSubmit() {
        this.$refs['merchantMsgTemplateForm'].validate((valid) => {
          if (valid) {
            this.listLoading = true
            this.merchantMsgTemplateForm.curApplicationCode = this.curApplicationCode
            addMerchantMsgTemplate(this.merchantMsgTemplateForm).then(response => {
              if (response.data.error_no === 0) {
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: response.data.error_info,
                  type: 'success',
                  duration: 2000
                })
                this.closeDialog()
                this.searchMerchantMsgTemplate()
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
        this.merchantMsgTemplateForm.curApplicationCode = this.curApplicationCode
        this.$refs['merchantMsgTemplateForm'].validate((valid) => {
          if (valid) {
            this.listLoading = true
            editMerchantMsgTemplate(this.merchantMsgTemplateForm).then(response => {
              if (response.data.error_no === 0) {
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: response.data.error_info,
                  type: 'success',
                  duration: 2000
                })
                this.closeDialog()
                this.searchMerchantMsgTemplate()
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
          msgTemplateName: '',
          msgTemplateNo: '',
          msgTemplateContent: '',
          msgSendway: '',
          msgTemplateDesc: '',
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
        this.merchantMsgTemplateForm = {
          id: '',
          msgTemplateName: '',
          msgTemplateNo: '',
          msgTemplateContent: '',
          msgSendway: '',
          msgTemplateDesc: '',
          createDate: '',
          createBy: '',
          updateDate: '',
          updateBy: '',
          curApplicationCode: this.curApplicationCode
        }
        if (this.$refs['merchantMsgTemplateForm'] !== undefined) {
          this.$refs['merchantMsgTemplateForm'].resetFields()
        }
      },
      handleDownload() {
        this.downloadLoading = true
        require.ensure([], () => {
          const { export_json_to_excel } = require('vendor/Export2Excel')
          const tHeader = [
            'id',
            '消息类型表id',
            '消息模板编号',
            '消息模板内容',
            '发送途径',
            '创建日期',
            '创建人',
            '更新日期',
            '更新人'
          ]
          const filterVal = [
            'id',
            'msgTemplateName',
            'msgTemplateNo',
            'msgTemplateContent',
            'msgSendway',
            'msgTemplateDesc',
            'createDate',
            'createBy',
            'updateDate',
            'updateBy'
          ]
          const list = this.list
          const data = this.formatJson(filterVal, list)
          export_json_to_excel(tHeader, data, '消息模板表')
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
