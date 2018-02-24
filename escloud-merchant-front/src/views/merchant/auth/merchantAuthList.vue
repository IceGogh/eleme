<template>
  <div class="main-contain-new clearfix">
    <sidebar-menu></sidebar-menu>
    <div class="main-contain-new-inner" :class="{'main-contain-new-inner-all': !minimenu2ndStatus}">
      <div class="option-bar">
        <div class="searchBox">
          <input type="text" class="search" placeholder="请输入关键词查询" v-model="filterForm.searchWord"/>
          <i class="el-icon-search" @click="searchmerchantAuth"></i>
        </div>
      </div>
      <template>
        <div class="app-container calendar-list-container">
          <el-table ref="multipleTable" :key='tableKey' :data="list" stripe fit highlight-current-row size='mini' :default-sort="{prop: 'id', order: 'aescending'}" @select="selectCheckBox" @select-all="selectAllCheckBox" v-loading="listLoading" element-loading-text="给我一点时间" style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-form label-position="left" inline class="multipleTable-expand">
                  <el-form-item label="商户号">
                    <span>{{ scope.row.merchantId }}</span>
                  </el-form-item>
                  <el-form-item label="商户名称">
                    <span>{{ scope.row.merchantName }}</span>
                  </el-form-item>
                  <el-form-item label="认证时间">
                    <span>{{ scope.row.authTime }}</span>
                  </el-form-item>
                  <el-form-item label="到期时间">
                    <span>{{ scope.row.expireTime }}</span>
                  </el-form-item>
                  <el-form-item label="联系人姓名">
                    <span>{{ scope.row.contactsName }}</span>
                  </el-form-item>
                  <el-form-item label="联系人电话">
                    <span>{{ scope.row.contactsMobile }}</span>
                  </el-form-item>
                  <el-form-item label="电子邮箱">
                    <span>{{ scope.row.eMail }}</span>
                  </el-form-item>
                  <el-form-item label="营业执照正面">
                    <span>{{ scope.row.businessLicenseFront }}</span>
                  </el-form-item>
                  <el-form-item label="营业执照反面">
                    <span>{{ scope.row.businessLicenseReverse }}</span>
                  </el-form-item>
                  <el-form-item label="商户状态">
                    <span>{{ scope.row.merchantState }}</span>
                  </el-form-item>
                  <el-form-item label="启用状态">
                    <span>{{ scope.row.enableState }}</span>
                  </el-form-item>
                  <el-form-item label="创建时间">
                    <span>{{ scope.row.createDate }}</span>
                  </el-form-item>
                  <el-form-item label="创建人">
                    <span>{{ scope.row.createBy }}</span>
                  </el-form-item>
                  <el-form-item label="修改时间">
                    <span>{{ scope.row.updateDate }}</span>
                  </el-form-item>
                  <el-form-item label="修改人">
                    <span>{{ scope.row.updateBy }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column type="index" width="62" label="序号"></el-table-column>
            <el-table-column header-align="center" align="center" label="主键ID" prop='id' v-if=false sortable>
              <template slot-scope="scope">
                <span>{{scope.row.id}}</span>
              </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" label="商户号" prop='merchantId' :show-overflow-tooltip='true'>
              <template slot-scope="scope">
                <span>{{scope.row.merchantId}}</span>
              </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" label="商户名称" prop='addressId'>
              <template slot-scope="scope">
                <span>{{scope.row.merchantName}}</span>
              </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" label="联系人姓名" prop='contactsName'>
              <template slot-scope="scope">
                <span>{{scope.row.contactsName}}</span>
              </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" label="联系人电话" prop='contactsMobile'>
              <template slot-scope="scope">
                <span>{{scope.row.contactsMobile}}</span>
              </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" label="电子邮箱" prop='eMail' :show-overflow-tooltip='true'>
              <template slot-scope="scope">
                <span>{{scope.row.eMail}}</span>
              </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" label="商户状态" prop='merchantState'>
              <template slot-scope="scope">
                <span>{{merchantStateMapObj[scope.row.merchantState]}}</span>
              </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" label="启用状态" prop='enableState'>
              <template slot-scope="scope">
                <span>{{enableStateMapObj[scope.row.enableState]}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="150">
              <template slot-scope="scope">
                <el-button size="small" type="text" @click="auth(scope.row,'update')">认证
                </el-button>|
                <el-button size="small" v-if="scope.row.enableState == 2" type="text" @click="implementEnableOrDisable(1,scope.row)">启用
                </el-button>
                <el-button size="small" v-if="scope.row.enableState == 1" type="text" @click="implementEnableOrDisable(2,scope.row)">禁用
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <div v-show="!listLoading" class="pagination-container">
            <el-row>
              <el-col :span="7">
                <el-button type="info" plain size="small" :disabled="isBatch" icon="edit" @click="batchEnabledDisuse(1)">批量启用</el-button>
                <el-button type="info" plain size="small" :disabled="isBatch" icon="edit" @click="batchEnabledDisuse(2)">批量禁用</el-button>
              </el-col>
              <el-col :span="17">
                <el-pagination @size-change="pageSizeChange" @current-change="currentPageChange" :current-page.sync="filterForm.current" :page-sizes="pageSize" :page-size="filterForm.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
              </el-col>
            </el-row>
          </div>

          <el-dialog class="create_dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="40%" :before-close="closeDialog">
            <el-form :model="merchantAuthForm" :rules="merchantAuthFormRules" ref="merchantAuthForm" label-width="40px">
              <el-row>
                <el-col :span="24">
                  <el-form-item label="商户名称" :label-width="formLabelWidth" prop="merchantName">
                    <span>{{merchantAuthForm.merchantName}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="地址" :label-width="formLabelWidth" prop="province">
                    <span>{{merchantAuthForm.province}}-{{merchantAuthForm.city}}-{{merchantAuthForm.district}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="详细地址" :label-width="formLabelWidth" prop="address">
                    <span>{{merchantAuthForm.address}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="商户号" :label-width="formLabelWidth" prop="merchantId">
                    <span>{{merchantAuthForm.merchantId}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="联系人姓名" :label-width="formLabelWidth" prop="contactsName">
                    <span>{{merchantAuthForm.contactsName}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="联系人电话" :label-width="formLabelWidth" prop="contactsMobile">
                    <span>{{merchantAuthForm.contactsMobile}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="电子邮箱" :label-width="formLabelWidth" prop="eMail">
                    <span>{{merchantAuthForm.eMail}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="营业执照" :label-width="formLabelWidth" prop="businessLicenseFront">
                    <span>{{merchantAuthForm.businessLicenseFront}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                    <span>{{merchantAuthForm.businessLicenseReverse}}</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item  v-if="merchantAuthForm.merchantState=='1'" label="审批意见" :label-width="formLabelWidth" prop="approvalOpinion">
                    <el-input size="small" v-model="merchantAuthForm.approvalOpinion" :maxlength="127" resize='vertical'
                              type="textarea" :autosize="{ minRows: 5, maxRows: 10}" placeholder="请输入内容" >
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="closeDialog">取 消</el-button>
              <el-button v-if="merchantAuthForm.merchantState=='1'" type="primary" @click="approval(1)">通 过</el-button>
              <el-button v-if="merchantAuthForm.merchantState=='1'" type="primary" @click="approval(2)">不通过</el-button>
            </div>
          </el-dialog>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import { queryMerchantAuthList, updateDisable, updateEnable, authApproval, enableDisableBatch, queryAddress } from '@/api/merchant/auth/merchantAuth'
import { globalConfig } from '@/globalConfig'
import waves from '@/directive/waves/index.js'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
import { getApplicationCode } from '@/api/common'
import menuList from '@/views/plat/layout/menuList'
import SidebarMenu from '@/views/plat/layout/SidebarMenu'
import { mapGetters } from 'vuex'

export default {
  name: 'tablemerchantAuth',
  directives: {
    waves
  },
  components: { ImageCropper, PanThumb, menuList, SidebarMenu },
  data() {
    return {
      Height: 0,
      hash: '',
      curApplicationCode: '',
      routesArray: [],
      menuTitleName: '',
      menuTitleIcon: '',
      list: [],
      checkList: [],
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
        searchWord: '',
        current: globalConfig.startPage,
        pageSize: globalConfig.initPageSize
      },
      dialogStatus: '',
      tableKey: 0,
      dialogFormVisible: false,
      dialogEditFormVisible: false,
      formLabelWidth: '120px',
      merchantAuthForm: {
        id: '',
        merchantId: '',
        addressId: '',
        authTime: '',
        expireTime: '',
        contactsName: '',
        contactsMobile: '',
        eMail: '',
        businessLicenseFront: '',
        businessLicenseReverse: '',
        merchantState: '',
        enableState: '',
        createBy: '',
        createDate: '',
        modifyBy: '',
        modifyDate: '',
        approvalOpinion: '',
        address: '',
        province: '',
        city: '',
        district: ''
      },
      textMap: {
        update: '认证',
        create: '创建'
      },
      merchantStateMapArr: [
        {
          label: '待通过',
          value: '1'
        }, {
          label: '正常',
          value: '2'
        }, {
          label: '未通过',
          value: '3'
        }, {
          label: '已过期',
          value: '4'
        }
      ],
      merchantStateMapObj: {
        '1': '待通过',
        '2': '正常',
        '3': '未通过',
        '4': '已过期'
      },
      enableStateMapArr: [
        {
          label: '启用',
          value: '1'
        }, {
          label: '禁用',
          value: '2'
        }
      ],
      enableStateMapObj: {
        '1': '启用',
        '2': '禁用'
      },
      // 表单校验规则
      merchantAuthFormRules: {
        approvalOpinion: [{
          required: true,
          message: '请输入审批信息',
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
    this.getMerchantAuthList()
  },
  methods: {
    getMerchantAuthList() {
      this.filterForm.curApplicationCode = this.curApplicationCode
      this.listLoading = true
      queryMerchantAuthList(this.filterForm).then(response => {
        if (response.data.error_no === 0) {
          this.list = response.data.result.records
          this.total = response.data.result.total
        } else {
          this.$message(response.data.error_info)
        }
        this.listLoading = false
      })
    },
    searchmerchantAuth() {
      if (!this.proSearch) {
        this.filterForm[this.queryType] = this.queryParams
      }
      this.filterForm.current = globalConfig.startPage
      this.getMerchantAuthList()
    },
    auth(row) {
      const param = {
        objCode: row.merchantId,
        curApplicationCode: this.curApplicationCode
      }
      queryAddress(param).then(response => {
        if (response.data.error_no === 0) {
          this.merchantAuthForm.address = response.data.result.records[0].address
          this.merchantAuthForm.province = response.data.result.records[0].province
          this.merchantAuthForm.city = response.data.result.records[0].city
          this.merchantAuthForm.district = response.data.result.records[0].district
        }
      })
      this.merchantAuthForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    implementEnableOrDisable(val, row) {
      const param = {
        merchantId: row.merchantId,
        curApplicationCode: this.curApplicationCode
      }
      if (val === 1) {
        this.$confirm('此操作将启用该商户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateEnable(param).then(response => {
            if (response.data.error_no === 0) {
              this.$notify({
                title: '成功',
                message: '启用成功',
                type: 'success',
                duration: 2000
              })
              this.searchmerchantAuth()
              this.$refs.multipleTable.clearSelection()
            } else {
              this.$message(response.data.error_info)
            }
            this.listLoading = false
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消启用'
          })
        })
      }
      if (val === 2) {
        this.$confirm('此操作将禁用该商户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateDisable(param).then(response => {
            if (response.data.error_no === 0) {
              this.$notify({
                title: '成功',
                message: '禁用成功',
                type: 'success',
                duration: 2000
              })
              this.searchmerchantAuth()
              this.$refs.multipleTable.clearSelection()
            } else {
              this.$message(response.data.error_info)
            }
            this.listLoading = false
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消禁用'
          })
        })
      }
    },
    batchEnabledDisuse(val) {
      const selection = this.$refs.multipleTable.selection
      const selectIds = []
      for (let i = 0; i < selection.length; i++) {
        if (selection[i].id) {
          selectIds.push(selection[i].id)
        }
      }
      const param = {
        primaryKeys: selectIds,
        approvalState: val,
        curApplicationCode: this.curApplicationCode
      }
      this.$confirm('是否执行此批量操作，请谨慎操作, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        enableDisableBatch(param).then(response => {
          if (response.data.error_no === 0) {
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 2000
            })
            this.searchmerchantAuth()
            this.$refs.multipleTable.clearSelection()
          } else {
            this.$message(response.data.error_info)
          }
          this.listLoading = false
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    pageSizeChange(val) {
      this.filterForm.current = globalConfig.startPage
      this.filterForm.pageSize = val
      this.getMerchantAuthList()
    },
    currentPageChange(val) {
      this.filterForm.current = val
      this.getMerchantAuthList()
    },
    approval(val) {
      const param = {
        approvalState: val,
        approvalOpinion: this.merchantAuthForm.approvalOpinion,
        merchantId: this.merchantAuthForm.merchantId,
        curApplicationCode: this.curApplicationCode
      }
      if (this.merchantAuthForm.approvalOpinion) {
        authApproval(param).then(response => {
          if (response.data.error_no === 0) {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: response.data.error_info,
              type: 'success',
              duration: 2000
            })
            this.closeDialog()
            this.searchmerchantAuth()
          } else {
            this.$message(response.data.error_info)
          }
          this.listLoading = false
        })
      } else {
        this.$message({
          message: '请录入审批意见',
          type: 'warning'
        })
      }
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
        addressId: '',
        authTime: '',
        expireTime: '',
        contactsName: '',
        contactsMobile: '',
        eMail: '',
        businessLicenseFront: '',
        businessLicenseReverse: '',
        merchantState: '',
        enableState: '',
        createBy: '',
        createDate: [],
        modifyBy: '',
        modifyDate: [],
        current: globalConfig.startPage,
        pageSize: globalConfig.initPageSize
      }
    },
    resetForm() {
      this.merchantAuthForm = {
        id: '',
        merchantId: '',
        addressId: '',
        authTime: '',
        expireTime: '',
        contactsName: '',
        contactsMobile: '',
        eMail: '',
        businessLicenseFront: '',
        businessLicenseReverse: '',
        merchantState: '',
        enableState: '',
        createBy: '',
        createDate: '',
        modifyBy: '',
        modifyDate: ''
      }
      if (this.$refs['merchantAuthForm'] !== undefined) {
        this.$refs['merchantAuthForm'].resetFields()
      }
    },
    handleDownload() {
      this.downloadLoading = true
      require.ensure([], () => {
        const { export_json_to_excel } = require('vendor/Export2Excel')
        const tHeader = [
          '主键ID',
          '商户号',
          '地址ID',
          '认证时间',
          '到期时间',
          '联系人姓名',
          '联系人电话',
          '电子邮箱',
          '营业执照正面地址',
          '营业执照反面地址',
          '商户状态(1待通过2正常3未通过4已过期)',
          '启用状态(1启用2禁用)',
          '创建人',
          '创建时间',
          '修改人',
          '修改时间'
        ]
        const filterVal = [
          'id',
          'merchantId',
          'addressId',
          'authTime',
          'expireTime',
          'contactsName',
          'contactsMobile',
          'eMail',
          'businessLicenseFront',
          'businessLicenseReverse',
          'merchantState',
          'enableState',
          'createBy',
          'createDate',
          'modifyBy',
          'modifyDate'
        ]
        const list = this.list
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, '商户认证表')
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
