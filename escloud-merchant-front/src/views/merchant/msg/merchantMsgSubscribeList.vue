<template>
<div class="app-container calendar-list-container">
<div class="filter-container">
<el-form :model="filterForm" ref="filterForm">
  <div v-if=proSearch>
   <el-row>
    <el-col :span="8">
      <el-form-item label="id" :label-width="filterFormLabelWidth" prop="id" class="form-bottom">
        <el-input @keyup.enter.native="searchMerchantMsgSubscribe" size="small" class="filter-item" placeholder="id" v-model="filterForm.id">
        </el-input>
      </el-form-item>
    </el-col>
    <el-col :span="8">
      <el-form-item label="商户id" :label-width="filterFormLabelWidth" prop="merchantId" class="form-bottom">
        <el-input @keyup.enter.native="searchMerchantMsgSubscribe" size="small" class="filter-item" placeholder="商户id" v-model="filterForm.merchantId">
        </el-input>
      </el-form-item>
    </el-col>
    <el-col :span="8">
      <el-form-item label="消息类型表id" :label-width="filterFormLabelWidth" prop="msgTypeId" class="form-bottom">
        <el-input @keyup.enter.native="searchMerchantMsgSubscribe" size="small" class="filter-item" placeholder="消息类型表id" v-model="filterForm.msgTypeId">
        </el-input>
      </el-form-item>
    </el-col>
    </el-row>
   <el-row>
    <el-col :span="8">
      <el-form-item label="发送途径" :label-width="filterFormLabelWidth" prop="msgSendway" class="form-bottom">
        <el-input @keyup.enter.native="searchMerchantMsgSubscribe" size="small" class="filter-item" placeholder="发送途径" v-model="filterForm.msgSendway">
        </el-input>
      </el-form-item>
    </el-col>
    <el-col :span="8">
      <el-form-item label="是否订阅" :label-width="filterFormLabelWidth" prop="msgIssubscribe" class="form-bottom">
        <el-input @keyup.enter.native="searchMerchantMsgSubscribe" size="small" class="filter-item" placeholder="是否订阅" v-model="filterForm.msgIssubscribe">
        </el-input>
      </el-form-item>
    </el-col>
    <el-col :span="8">
      <el-form-item label="是否可以取消订阅" :label-width="filterFormLabelWidth" prop="msgIscancelsubscribe" class="form-bottom">
        <el-input @keyup.enter.native="searchMerchantMsgSubscribe" size="small" class="filter-item" placeholder="是否可以取消订阅" v-model="filterForm.msgIscancelsubscribe">
        </el-input>
      </el-form-item>
    </el-col>
    </el-row>
   <el-row>
    <el-col :span="8">
      <el-form-item label="接收人id" :label-width="filterFormLabelWidth" prop="msgReceiver" class="form-bottom">
        <el-input @keyup.enter.native="searchMerchantMsgSubscribe" size="small" class="filter-item" placeholder="接收人id" v-model="filterForm.msgReceiver">
        </el-input>
      </el-form-item>
    </el-col>
    <el-col :span="8">
      <el-form-item label="创建日期" :label-width="filterFormLabelWidth" prop="createDate" class="form-bottom">
        <el-date-picker v-model="filterForm.createDate" type="datetimerange" placeholder="创建日期" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" prop="createDate">
        </el-date-picker>
      </el-form-item>
    </el-col>
    <el-col :span="8">
      <el-form-item label="创建人" :label-width="filterFormLabelWidth" prop="createBy" class="form-bottom">
        <el-input @keyup.enter.native="searchMerchantMsgSubscribe" size="small" class="filter-item" placeholder="创建人" v-model="filterForm.createBy">
        </el-input>
      </el-form-item>
    </el-col>
    </el-row>
   <el-row>
    <el-col :span="8">
      <el-form-item label="更新日期" :label-width="filterFormLabelWidth" prop="updateDate" class="form-bottom">
        <el-date-picker v-model="filterForm.updateDate" type="datetimerange" placeholder="更新日期" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" prop="updateDate">
        </el-date-picker>
      </el-form-item>
    </el-col>
    <el-col :span="8">
      <el-form-item label="更新人" :label-width="filterFormLabelWidth" prop="updateBy" class="form-bottom">
        <el-input @keyup.enter.native="searchMerchantMsgSubscribe" size="small" class="filter-item" placeholder="更新人" v-model="filterForm.updateBy">
        </el-input>
      </el-form-item>
    </el-col>
    <el-row class="button-group">
      <el-col :span="12" class="searchSimpleBtn">
        <el-form-item label=" " :label-width="filterFormLabelWidth" class="form-bottom">
          <el-button type="primary" size="small" icon="search" @click="searchMerchantMsgSubscribe" v-waves>搜索</el-button>
          <el-button type="primary" plain size="small" icon="delete" @click="resetSearch" v-waves>清空</el-button>
        </el-form-item>
      </el-col>
      <el-col v-if=proSearch :span="12" class="searchProBtn">
        <el-button type="primary" plain size="small" icon="document" @click="handleDownload" :loading="downloadLoading">导出</el-button>
        <el-button type="primary" plain size="small" icon="search" @click="changeProButton" v-waves>简单搜索</el-button>
      </el-col>
    </el-row>
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
            <el-select @keyup.enter.native="searchMerchantMsgSubscribe" size="small" class="filter-item" @change="searchName" clearable placeholder="请选择查询条件" v-model="queryType">
              <el-option v-for="item in searchOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label=" " :label-width="filterFormLabelWidth2" prop="queryParams" class="simple-btn">
            <el-input @keyup.enter.native="searchMerchantMsgSubscribe" size="small" class="filter-item" :placeholder="selectDesc" v-model="queryParams">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" class="searchSimpleBtn">
          <el-button type="primary" size="small" icon="search" @click="searchMerchantMsgSubscribe" v-waves>搜索</el-button>
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
    <el-table-column header-align="center" align="center" label="商户id" prop='merchantId'>
    <template slot-scope="scope">
        <span>{{scope.row.merchantId}}</span>
      </template>
    </el-table-column>
    <el-table-column header-align="center" align="center" label="消息类型表id" prop='msgTypeId'>
    <template slot-scope="scope">
        <span>{{scope.row.msgTypeId}}</span>
      </template>
    </el-table-column>
    <el-table-column header-align="center" align="center" label="发送途径" prop='msgSendway'>
    <template slot-scope="scope">
        <span>{{scope.row.msgSendway}}</span>
      </template>
    </el-table-column>
    <el-table-column header-align="center" align="center" label="是否订阅" prop='msgIssubscribe'>
    <template slot-scope="scope">
        <span>{{scope.row.msgIssubscribe}}</span>
      </template>
    </el-table-column>
    <el-table-column header-align="center" align="center" label="是否可以取消订阅" prop='msgIscancelsubscribe'>
    <template slot-scope="scope">
        <span>{{scope.row.msgIscancelsubscribe}}</span>
      </template>
    </el-table-column>
    <el-table-column header-align="center" align="center" label="接收人id" prop='msgReceiver' :show-overflow-tooltip='true'>
    <template slot-scope="scope">
        <span>{{scope.row.msgReceiver}}</span>
      </template>
    </el-table-column>
    <el-table-column header-align="center" align="center" label="创建日期" prop='createDate' v-if=false sortable>
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
        <el-button size="small" type="text" @click="modifyMerchantMsgSubscribe(scope.row,'update')">修改
        </el-button>
        <el-button size="small" type="text" @click="deleteMerchantMsgSubscribe(scope.row,'delete')">删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <div v-show="!listLoading" class="pagination-container">
    <el-row>
      <el-col :span="7">
        <el-button type="info" plain size="small" icon="edit" @click="addMerchantMsgSubscribe">添加</el-button>
        <el-button type="info" plain size="small" :disabled="isBatch" icon="delete" @click="deleteBatch">批量删除</el-button>
      </el-col>
      <el-col :span="17">
        <el-pagination @size-change="pageSizeChange" @current-change="currentPageChange" :current-page.sync="filterForm.current" :page-sizes="pageSize" :page-size="filterForm.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </el-col>
    </el-row>
  </div>

  <el-dialog class="create_dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" size="small" :before-close="closeDialog">
    <el-form :model="merchantMsgSubscribeForm" :rules="merchantMsgSubscribeFormRules" ref="merchantMsgSubscribeForm" label-width="80px">
              <el-row>
        <el-col :span="11">
          <el-form-item v-if="dialogStatus=='update'" label="id" :label-width="formLabelWidth" prop="id">
            <el-input size="small" v-model="merchantMsgSubscribeForm.id" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="商户id" :label-width="formLabelWidth" prop="merchantId">
            <el-input size="small" v-model="merchantMsgSubscribeForm.merchantId" :maxlength="32"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="消息类型表id" :label-width="formLabelWidth" prop="msgTypeId">
            <el-input size="small" v-model="merchantMsgSubscribeForm.msgTypeId" :maxlength="11"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="发送途径" :label-width="formLabelWidth" prop="msgSendway">
            <el-input size="small" v-model="merchantMsgSubscribeForm.msgSendway" :maxlength="2"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="是否订阅" :label-width="formLabelWidth" prop="msgIssubscribe">
            <el-input size="small" v-model="merchantMsgSubscribeForm.msgIssubscribe" :maxlength="4"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="是否可以取消订阅" :label-width="formLabelWidth" prop="msgIscancelsubscribe">
            <el-input size="small" v-model="merchantMsgSubscribeForm.msgIscancelsubscribe" :maxlength="4"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="更新日期" :label-width="formLabelWidth" prop="updateDate">
            <el-date-picker v-model="merchantMsgSubscribeForm.updateDate" type="datetime" placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="更新人" :label-width="formLabelWidth" prop="updateBy">
            <el-input size="small" v-model="merchantMsgSubscribeForm.updateBy" :maxlength="20"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
              <el-row>
        <el-col :span="22">
          <el-form-item label="接收人id" :label-width="formLabelWidth" prop="msgReceiver">
            <el-input size="small" v-model="merchantMsgSubscribeForm.msgReceiver" :maxlength="500" resize='vertical' type="textarea" :autosize="{ minRows: 20, maxRows: 40}" placeholder="请输入内容"></el-input>
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
import { getMerchantMsgSubscribeList, addMerchantMsgSubscribe, editMerchantMsgSubscribe, delMerchantMsgSubscribe, delBatchMerchantMsgSubscribe } from '@/api/merchant/msg/merchantMsgSubscribe'
import { globalConfig } from '@/globalConfig'
import waves from '@/directive/waves/index.js'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

export default {
  name: 'tableMerchantMsgSubscribe',
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
          value: 'merchantId',
          label: '商户id'
        },
        {
          value: 'msgTypeId',
          label: '消息类型表id'
        },
        {
          value: 'msgSendway',
          label: '发送途径'
        },
        {
          value: 'msgIssubscribe',
          label: '是否订阅'
        },
        {
          value: 'msgIscancelsubscribe',
          label: '是否可以取消订阅'
        },
        {
          value: 'msgReceiver',
          label: '接收人id'
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
        merchantId: '',
        msgTypeId: '',
        msgSendway: '',
        msgIssubscribe: '',
        msgIscancelsubscribe: '',
        msgReceiver: '',
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
      merchantMsgSubscribeForm: {
        id: '',
        merchantId: '',
        msgTypeId: '',
        msgSendway: '',
        msgIssubscribe: '',
        msgIscancelsubscribe: '',
        msgReceiver: '',
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
      merchantMsgSubscribeFormRules: {
        id: [{
          type: 'number',
          required: true,
          message: '请输入id',
          trigger: 'blur'
        }, {
          type: 'number',
          message: 'id必须为数字值'
        }],
        merchantId: [{
          required: true,
          message: '请输入商户id',
          trigger: 'blur'
        }],
        msgTypeId: [{
          type: 'number',
          required: true,
          message: '请输入消息类型表id',
          trigger: 'blur'
        }, {
          type: 'number',
          message: '消息类型表id必须为数字值'
        }],
        msgSendway: [{
          required: true,
          message: '请输入发送途径',
          trigger: 'blur'
        }],
        msgIssubscribe: [{
          type: 'number',
          required: true,
          message: '请输入是否订阅',
          trigger: 'blur'
        }, {
          type: 'number',
          message: '是否订阅必须为数字值'
        }],
        msgIscancelsubscribe: [{
          type: 'number',
          required: true,
          message: '请输入是否可以取消订阅',
          trigger: 'blur'
        }, {
          type: 'number',
          message: '是否可以取消订阅必须为数字值'
        }],
        msgReceiver: [{
          required: true,
          message: '请输入接收人id',
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
    this.getMerchantMsgSubscribeList()
  },
  methods: {
    getMerchantMsgSubscribeList() {
      this.listLoading = true
      this.filterForm.curApplicationCode = this.curApplicationCode
      getMerchantMsgSubscribeList(this.filterForm).then(response => {
        if (response.data.error_no === 0) {
          this.list = response.data.result.records
          this.total = response.data.result.total
        } else {
          this.$message(response.data.error_info)
        }
        this.listLoading = false
      })
    },
    searchMerchantMsgSubscribe() {
      if (!this.proSearch) {
        this.filterForm[this.queryType] = this.queryParams
      }
      this.filterForm.current = globalConfig.startPage
      this.getMerchantMsgSubscribeList()
    },
    addMerchantMsgSubscribe() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    modifyMerchantMsgSubscribe(row) {
      this.merchantMsgSubscribeForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    deleteMerchantMsgSubscribe(row) {
      const param = {
        primaryKey: row.id,
        curApplicationCode: this.curApplicationCode
      }
      this.listLoading = true
      delMerchantMsgSubscribe(param).then(response => {
        if (response.data.error_no === 0) {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.searchMerchantMsgSubscribe()
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
      delBatchMerchantMsgSubscribe(param).then(response => {
        if (response.data.error_no === 0) {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.searchMerchantMsgSubscribe()
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
      this.getMerchantMsgSubscribeList()
    },
    currentPageChange(val) {
      this.filterForm.current = val
      this.getMerchantMsgSubscribeList()
    },
    addSubmit() {
      this.$refs['merchantMsgSubscribeForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          this.merchantMsgTypeForm.curApplicationCode = this.curApplicationCode
          addMerchantMsgSubscribe(this.merchantMsgSubscribeForm).then(response => {
            if (response.data.error_no === 0) {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: response.data.error_info,
                type: 'success',
                duration: 2000
              })
              this.closeDialog()
              this.searchMerchantMsgSubscribe()
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
      this.$refs['merchantMsgSubscribeForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          editMerchantMsgSubscribe(this.merchantMsgSubscribeForm).then(response => {
            if (response.data.error_no === 0) {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: response.data.error_info,
                type: 'success',
                duration: 2000
              })
              this.closeDialog()
              this.searchMerchantMsgSubscribe()
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
        msgTypeId: '',
        msgSendway: '',
        msgIssubscribe: '',
        msgIscancelsubscribe: '',
        msgReceiver: '',
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
      this.merchantMsgSubscribeForm = {
        id: '',
        merchantId: '',
        msgTypeId: '',
        msgSendway: '',
        msgIssubscribe: '',
        msgIscancelsubscribe: '',
        msgReceiver: '',
        createDate: '',
        createBy: '',
        updateDate: '',
        updateBy: '',
        curApplicationCode: this.curApplicationCode
      }
      if (this.$refs['merchantMsgSubscribeForm'] !== undefined) {
        this.$refs['merchantMsgSubscribeForm'].resetFields()
      }
    },
    handleDownload() {
      this.downloadLoading = true
      require.ensure([], () => {
        const { export_json_to_excel } = require('vendor/Export2Excel')
        const tHeader = [
          'id',
          '商户id',
          '消息类型表id',
          '发送途径',
          '是否订阅',
          '是否可以取消订阅',
          '接收人id',
          '创建日期',
          '创建人',
          '更新日期',
          '更新人'
        ]
        const filterVal = [
          'id',
          'merchantId',
          'msgTypeId',
          'msgSendway',
          'msgIssubscribe',
          'msgIscancelsubscribe',
          'msgReceiver',
          'createDate',
          'createBy',
          'updateDate',
          'updateBy'
        ]
        const list = this.list
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, '消息订阅表')
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
