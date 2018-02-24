<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form :model="filterForm" ref="filterForm">
        <div v-if=proSearch>
          <el-row>
            <el-col :span="8">
              <el-form-item label="id" :label-width="filterFormLabelWidth" prop="id" class="form-bottom">
                <el-input @keyup.enter.native="searchMerchantMsgUsermessage" size="small" class="filter-item" placeholder="id" v-model="filterForm.id">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="用户id(t_plat_user_info.user_id)" :label-width="filterFormLabelWidth" prop="msgReceiver" class="form-bottom">
                <el-input @keyup.enter.native="searchMerchantMsgUsermessage" size="small" class="filter-item" placeholder="用户id(t_plat_user_info.user_id)" v-model="filterForm.msgReceiver">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="消息发送记录表id(t_hwy_merchant_msg_sendrecord.id)" :label-width="filterFormLabelWidth" prop="msgSendrecordId" class="form-bottom">
                <el-input @keyup.enter.native="searchMerchantMsgUsermessage" size="small" class="filter-item" placeholder="消息发送记录表id(t_hwy_merchant_msg_sendrecord.id)" v-model="filterForm.msgSendrecordId">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="消息体" :label-width="filterFormLabelWidth" prop="msgSendDate" class="form-bottom">
                <el-date-picker v-model="filterForm.msgSendDate" type="datetimerange" placeholder="消息体" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" prop="msgSendDate">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="用户接收消息的时间" :label-width="filterFormLabelWidth" prop="msgReceivedDate" class="form-bottom">
                <el-date-picker v-model="filterForm.msgReceivedDate" type="datetimerange" placeholder="用户接收消息的时间" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" prop="msgReceivedDate">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="阅读时间" :label-width="filterFormLabelWidth" prop="msgReadTime" class="form-bottom">
                <el-input @keyup.enter.native="searchMerchantMsgUsermessage" size="small" class="filter-item" placeholder="阅读时间" v-model="filterForm.msgReadTime">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="是否阅读(0|否/1|是)" :label-width="filterFormLabelWidth" prop="msgIsread" class="form-bottom">
                <el-input @keyup.enter.native="searchMerchantMsgUsermessage" size="small" class="filter-item" placeholder="是否阅读(0|否/1|是)" v-model="filterForm.msgIsread">
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
              <el-form-item label="创建人(t_plat_user_info.USER_ID)" :label-width="filterFormLabelWidth" prop="createBy" class="form-bottom">
                <el-input @keyup.enter.native="searchMerchantMsgUsermessage" size="small" class="filter-item" placeholder="创建人(t_plat_user_info.USER_ID)" v-model="filterForm.createBy">
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
              <el-form-item label="更新人(t_plat_user_info.USER_ID)" :label-width="filterFormLabelWidth" prop="updateBy" class="form-bottom">
                <el-input @keyup.enter.native="searchMerchantMsgUsermessage" size="small" class="filter-item" placeholder="更新人(t_plat_user_info.USER_ID)" v-model="filterForm.updateBy">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="更新人1(t_plat_user_info.USER_ID)" :label-width="filterFormLabelWidth" prop="updateBy1" class="form-bottom">
                <el-input @keyup.enter.native="searchMerchantMsgUsermessage" size="small" class="filter-item" placeholder="更新人1(t_plat_user_info.USER_ID)" v-model="filterForm.updateBy1">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="button-group">
            <el-col :span="12" class="searchSimpleBtn">
              <el-form-item label=" " :label-width="filterFormLabelWidth" class="form-bottom">
                <el-button type="primary" size="small" icon="search" @click="searchMerchantMsgUsermessage" v-waves>搜索</el-button>
                <el-button type="primary" plain size="small" icon="delete" @click="resetSearch" v-waves>清空</el-button>
              </el-form-item>
            </el-col>
            <el-col v-if=proSearch :span="12" class="searchProBtn">
              <el-button type="primary" plain size="small" icon="document" @click="handleDownload" :loading="downloadLoading">导出</el-button>
              <el-button type="primary" plain size="small" icon="search" @click="changeProButton" v-waves>简单搜索</el-button>
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
            <el-select @keyup.enter.native="searchMerchantMsgUsermessage" size="small" class="filter-item" @change="searchName" clearable placeholder="请选择查询条件" v-model="queryType">
              <el-option v-for="item in searchOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label=" " :label-width="filterFormLabelWidth2" prop="queryParams" class="simple-btn">
            <el-input @keyup.enter.native="searchMerchantMsgUsermessage" size="small" class="filter-item" :placeholder="selectDesc" v-model="queryParams">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" class="searchSimpleBtn">
          <el-button type="primary" size="small" icon="search" @click="searchMerchantMsgUsermessage" v-waves>搜索</el-button>
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
      <el-table-column header-align="center" align="center" label="用户id(t_plat_user_info.user_id)" prop='msgReceiver'>
        <template slot-scope="scope">
          <span>{{scope.row.msgReceiver}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="消息发送记录表id(t_hwy_merchant_msg_sendrecord.id)" prop='msgSendrecordId'>
        <template slot-scope="scope">
          <span>{{scope.row.msgSendrecordId}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="消息体" prop='msgSendDate' :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <span>{{scope.row.msgSendDate}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="用户接收消息的时间" prop='msgReceivedDate'>
        <template slot-scope="scope">
          <span>{{scope.row.msgReceivedDate}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="阅读时间" prop='msgReadTime'>
        <template slot-scope="scope">
          <span>{{scope.row.msgReadTime}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="是否阅读(0|否/1|是)" prop='msgIsread'>
        <template slot-scope="scope">
          <span>{{scope.row.msgIsread}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="创建日期" prop='createDate' v-if=false sortable>
        <template slot-scope="scope">
          <span>{{scope.row.createDate}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="创建人(t_plat_user_info.USER_ID)" prop='createBy'>
        <template slot-scope="scope">
          <span>{{scope.row.createBy}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="更新日期" prop='updateDate'>
        <template slot-scope="scope">
          <span>{{scope.row.updateDate}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="更新人(t_plat_user_info.USER_ID)" prop='updateBy'>
        <template slot-scope="scope">
          <span>{{scope.row.updateBy}}</span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="更新人1(t_plat_user_info.USER_ID)" prop='updateBy1'>
        <template slot-scope="scope">
          <span>{{scope.row.updateBy1}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="150" fixed='right'>
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="modifyMerchantMsgUsermessage(scope.row,'update')">修改
          </el-button>
          <el-button size="small" type="text" @click="deleteMerchantMsgUsermessage(scope.row,'delete')">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-row>
        <el-col :span="7">
          <el-button type="info" plain size="small" icon="edit" @click="addMerchantMsgUsermessage">添加</el-button>
          <el-button type="info" plain size="small" :disabled="isBatch" icon="delete" @click="deleteBatch">批量删除</el-button>
        </el-col>
        <el-col :span="17">
          <el-pagination @size-change="pageSizeChange" @current-change="currentPageChange" :current-page.sync="filterForm.current" :page-sizes="pageSize" :page-size="filterForm.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </el-col>
      </el-row>
    </div>

    <el-dialog class="create_dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" size="small" :before-close="closeDialog">
      <el-form :model="merchantMsgUsermessageForm" :rules="merchantMsgUsermessageFormRules" ref="merchantMsgUsermessageForm" label-width="80px">
        <el-row>
          <el-col :span="11">
            <el-form-item v-if="dialogStatus=='update'" label="id" :label-width="formLabelWidth" prop="id">
              <el-input size="small" v-model="merchantMsgUsermessageForm.id" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="用户id(t_plat_user_info.user_id)" :label-width="formLabelWidth" prop="msgReceiver">
              <el-input size="small" v-model="merchantMsgUsermessageForm.msgReceiver" :maxlength="32"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="消息发送记录表id(t_hwy_merchant_msg_sendrecord.id)" :label-width="formLabelWidth" prop="msgSendrecordId">
              <el-input size="small" v-model="merchantMsgUsermessageForm.msgSendrecordId" :maxlength="11"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="用户接收消息的时间" :label-width="formLabelWidth" prop="msgReceivedDate">
              <el-date-picker v-model="merchantMsgUsermessageForm.msgReceivedDate" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="阅读时间" :label-width="formLabelWidth" prop="msgReadTime">
              <el-input size="small" v-model="merchantMsgUsermessageForm.msgReadTime" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="是否阅读(0|否/1|是)" :label-width="formLabelWidth" prop="msgIsread">
              <el-input size="small" v-model="merchantMsgUsermessageForm.msgIsread" :maxlength="4"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="更新日期" :label-width="formLabelWidth" prop="updateDate">
              <el-date-picker v-model="merchantMsgUsermessageForm.updateDate" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="更新人(t_plat_user_info.USER_ID)" :label-width="formLabelWidth" prop="updateBy">
              <el-input size="small" v-model="merchantMsgUsermessageForm.updateBy" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="更新人1(t_plat_user_info.USER_ID)" :label-width="formLabelWidth" prop="updateBy1">
              <el-input size="small" v-model="merchantMsgUsermessageForm.updateBy1" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-row>
            <el-col :span="22">
              <el-form-item label="消息体" :label-width="formLabelWidth" prop="msgSendDate">
                <el-input size="small" v-model="merchantMsgUsermessageForm.msgSendDate" :maxlength="500" resize='vertical' type="textarea" :autosize="{ minRows: 20, maxRows: 40}" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
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
  import { getMerchantMsgUsermessageList, addMerchantMsgUsermessage, editMerchantMsgUsermessage, delMerchantMsgUsermessage, delBatchMerchantMsgUsermessage } from '@/api/merchant/msg/merchantMsgUsermessage'
  import { globalConfig } from '@/globalConfig'
  import waves from '@/directive/waves/index.js'
  import ImageCropper from '@/components/ImageCropper'
  import PanThumb from '@/components/PanThumb'

  export default {
    name: 'tableMerchantMsgUsermessage',
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
            value: 'msgReceiver',
            label: '用户id(t_plat_user_info.user_id)'
          },
          {
            value: 'msgSendrecordId',
            label: '消息发送记录表id(t_hwy_merchant_msg_sendrecord.id)'
          },
          {
            value: 'msgSendDate',
            label: '消息体'
          },
          {
            value: 'msgReceivedDate',
            label: '用户接收消息的时间'
          },
          {
            value: 'msgReadTime',
            label: '阅读时间'
          },
          {
            value: 'msgIsread',
            label: '是否阅读(0|否/1|是)'
          },
          {
            value: 'createDate',
            label: '创建日期'
          },
          {
            value: 'createBy',
            label: '创建人(t_plat_user_info.USER_ID)'
          },
          {
            value: 'updateDate',
            label: '更新日期'
          },
          {
            value: 'updateBy',
            label: '更新人(t_plat_user_info.USER_ID)'
          },
          {
            value: 'updateBy1',
            label: '更新人1(t_plat_user_info.USER_ID)'
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
          msgReceiver: '',
          msgSendrecordId: '',
          msgSendDate: [],
          msgReceivedDate: [],
          msgReadTime: '',
          msgIsread: '',
          createDate: [],
          createBy: '',
          updateDate: [],
          updateBy: '',
          updateBy1: '',
          current: globalConfig.startPage,
          pageSize: globalConfig.initPageSize
        },
        dialogStatus: '',
        tableKey: 0,
        dialogFormVisible: false,
        dialogEditFormVisible: false,
        formLabelWidth: '120px',
        merchantMsgUsermessageForm: {
          id: '',
          msgReceiver: '',
          msgSendrecordId: '',
          msgSendDate: '',
          msgReceivedDate: '',
          msgReadTime: '',
          msgIsread: '',
          createDate: '',
          createBy: '',
          updateDate: '',
          updateBy: '',
          updateBy1: ''
        },
        textMap: {
          update: '编辑',
          create: '创建'
        },
        // 表单校验规则
        merchantMsgUsermessageFormRules: {
          id: [{
            type: 'number',
            required: true,
            message: '请输入id',
            trigger: 'blur'
          }, {
            type: 'number',
            message: 'id必须为数字值'
          }],
          msgReceiver: [{
            required: true,
            message: '请输入用户id(t_plat_user_info.user_id)',
            trigger: 'blur'
          }],
          msgSendrecordId: [{
            type: 'number',
            required: true,
            message: '请输入消息发送记录表id(t_hwy_merchant_msg_sendrecord.id)',
            trigger: 'blur'
          }, {
            type: 'number',
            message: '消息发送记录表id(t_hwy_merchant_msg_sendrecord.id)必须为数字值'
          }],
          msgSendDate: [{
            required: true,
            message: '请输入消息体',
            trigger: 'blur'
          }],
          msgReceivedDate: [{
            required: true,
            message: '请输入用户接收消息的时间',
            trigger: 'blur'
          }],
          msgReadTime: [{
            required: true,
            message: '请输入阅读时间',
            trigger: 'blur'
          }],
          msgIsread: [{
            type: 'number',
            required: true,
            message: '请输入是否阅读(0|否/1|是)',
            trigger: 'blur'
          }, {
            type: 'number',
            message: '是否阅读(0|否/1|是)必须为数字值'
          }],
          updateDate: [{
            required: true,
            message: '请输入更新日期',
            trigger: 'blur'
          }],
          updateBy: [{
            required: true,
            message: '请输入更新人(t_plat_user_info.USER_ID)',
            trigger: 'blur'
          }],
          updateBy1: [{
            required: true,
            message: '请输入更新人1(t_plat_user_info.USER_ID)',
            trigger: 'blur'
          }]
        }
      }
    },
    computed: {
    },
    created() {
      this.curApplicationCode = this.$store.state.app.applicationCode
      this.getMerchantMsgUsermessageList()
    },
    methods: {
      getMerchantMsgUsermessageList() {
        this.listLoading = true
        this.filterForm.curApplicationCode = this.curApplicationCode
        getMerchantMsgUsermessageList(this.filterForm).then(response => {
          if (response.data.error_no === 0) {
            this.list = response.data.result.records
            this.total = response.data.result.total
          } else {
            this.$message(response.data.error_info)
          }
          this.listLoading = false
        })
      },
      searchMerchantMsgUsermessage() {
        if (!this.proSearch) {
          this.filterForm[this.queryType] = this.queryParams
        }
        this.filterForm.current = globalConfig.startPage
        this.getMerchantMsgUsermessageList()
      },
      addMerchantMsgUsermessage() {
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      modifyMerchantMsgUsermessage(row) {
        this.merchantMsgUsermessageForm = Object.assign({}, row)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },
      deleteMerchantMsgUsermessage(row) {
        const param = {
          primaryKey: row.id,
          curApplicationCode: this.curApplicationCode
        }
        this.listLoading = true
        delMerchantMsgUsermessage(param).then(response => {
          if (response.data.error_no === 0) {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.searchMerchantMsgUsermessage()
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
        delBatchMerchantMsgUsermessage(param).then(response => {
          if (response.data.error_no === 0) {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.searchMerchantMsgUsermessage()
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
        this.getMerchantMsgUsermessageList()
      },
      currentPageChange(val) {
        this.filterForm.current = val
        this.getMerchantMsgUsermessageList()
      },
      addSubmit() {
        this.$refs['merchantMsgUsermessageForm'].validate((valid) => {
          if (valid) {
            this.listLoading = true
            this.merchantMsgTypeForm.curApplicationCode = this.curApplicationCode
            addMerchantMsgUsermessage(this.merchantMsgUsermessageForm).then(response => {
              if (response.data.error_no === 0) {
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: response.data.error_info,
                  type: 'success',
                  duration: 2000
                })
                this.closeDialog()
                this.searchMerchantMsgUsermessage()
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
        this.$refs['merchantMsgUsermessageForm'].validate((valid) => {
          if (valid) {
            this.listLoading = true
            this.merchantMsgTypeForm.curApplicationCode = this.curApplicationCode
            editMerchantMsgUsermessage(this.merchantMsgUsermessageForm).then(response => {
              if (response.data.error_no === 0) {
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: response.data.error_info,
                  type: 'success',
                  duration: 2000
                })
                this.closeDialog()
                this.searchMerchantMsgUsermessage()
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
          msgReceiver: '',
          msgSendrecordId: '',
          msgSendDate: [],
          msgReceivedDate: [],
          msgReadTime: '',
          msgIsread: '',
          createDate: [],
          createBy: '',
          updateDate: [],
          updateBy: '',
          updateBy1: '',
          current: globalConfig.startPage,
          pageSize: globalConfig.initPageSize,
          curApplicationCode: this.curApplicationCode
        }
      },
      resetForm() {
        this.merchantMsgUsermessageForm = {
          id: '',
          msgReceiver: '',
          msgSendrecordId: '',
          msgSendDate: '',
          msgReceivedDate: '',
          msgReadTime: '',
          msgIsread: '',
          createDate: '',
          createBy: '',
          updateDate: '',
          updateBy: '',
          curApplicationCode: this.curApplicationCode
        }
        if (this.$refs['merchantMsgUsermessageForm'] !== undefined) {
          this.$refs['merchantMsgUsermessageForm'].resetFields()
        }
      },
      handleDownload() {
        this.downloadLoading = true
        require.ensure([], () => {
          const { export_json_to_excel } = require('vendor/Export2Excel')
          const tHeader = [
            'id',
            '用户id(t_plat_user_info.user_id)',
            '消息发送记录表id(t_hwy_merchant_msg_sendrecord.id)',
            '消息体',
            '用户接收消息的时间',
            '阅读时间',
            '是否阅读(0|否/1|是)',
            '创建日期',
            '创建人(t_plat_user_info.USER_ID)',
            '更新日期',
            '更新人(t_plat_user_info.USER_ID)',
            '更新人1(t_plat_user_info.USER_ID)'
          ]
          const filterVal = [
            'id',
            'msgReceiver',
            'msgSendrecordId',
            'msgSendDate',
            'msgReceivedDate',
            'msgReadTime',
            'msgIsread',
            'createDate',
            'createBy',
            'updateDate',
            'updateBy',
            'updateBy1'
          ]
          const list = this.list
          const data = this.formatJson(filterVal, list)
          export_json_to_excel(tHeader, data, '用户消息表')
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
