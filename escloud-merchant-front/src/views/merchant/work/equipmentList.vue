<template>
  <div class="main-contain-new clearfix">
    <!-- 菜单导航-->
    <sidebar-menu></sidebar-menu>

    <!-- main-contain部分-->
    <div class="main-contain-new-inner" :class="{'main-contain-new-inner-all': !minimenu2ndStatus}">
      <!-- 操作栏 （添加、搜索按钮 根据需要写入）-->
      <div class="option-bar">
        <el-button type="edenep-blue-btn" icon="el-icon-circle-plus-outline" class="add-btn" @click="addEquipment">添加设备</el-button>
        <div class="searchBox">
          <input type="text" class="search" placeholder="请输入关键词查询" v-model="filterForm.searchWord" @keyup.enter="searchCotEquipment"/>
          <i class="el-icon-search" @click="searchCotEquipment"></i>
        </div>
      </div>

      <template>
        <div>
          <div class="app-container calendar-list-container">
            <el-table ref="multipleTable" :data-key='tableKey' :data="list" fit highlight-current-row size='mini' :default-sort="{prop: 'id', order: 'aescending'}"
                      @select="selectCheckBox" @select-all="selectAllCheckBox" v-loading="listLoading"
                      element-loading-text="给我一点时间" style="width: 100%">
              <el-table-column type="selection" width="50"></el-table-column>
              <el-table-column show-overflow-tooltip header-align="center" align="center" label="设备名称" prop='equipmentName'>
                <template slot-scope="scope">
                  <span>{{scope.row.equipmentName}}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip header-align="center" align="center" label="设备型号" prop='modelId'>
                <template slot-scope="scope">
                  <span>{{scope.row.modelId}}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip header-align="center" align="center" label="设备组" prop='groupId'>
                <template slot-scope="scope">
                  <span>{{scope.row.groupId}}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip header-align="center" align="center" label="IMEI" prop='imei'>
                <template slot-scope="scope">
                  <span>{{scope.row.imei}}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip header-align="center" align="center" label="通信类型" prop='connectType'>
                <template slot-scope="scope">
                  <span>{{connectTypeMapObj[scope.row.connectType]}}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip header-align="center" align="center" label="通信号码" prop='connectNo'>
                <template slot-scope="scope">
                  <span>{{scope.row.connectNo}}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip header-align="center" align="center" label="出厂日期" prop='leaveFactoryDate'>
                <template slot-scope="scope">
                  <span>{{scope.row.leaveFactoryDate}}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip header-align="center" align="center" label="软件版本" prop='softwareVersion'>
                <template slot-scope="scope">
                  <span>{{scope.row.softwareVersion}}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip header-align="center" align="center" label="硬件版本" prop='hardwareVersion'>
                <template slot-scope="scope">
                  <span>{{scope.row.hardwareVersion}}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip header-align="center" align="center" label="激活状态" prop='activeStatus'
                               :show-overflow-tooltip='true'>
                <template slot-scope="scope">
                  <span>{{activeStatusMapObj[scope.row.activeStatus]}}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip header-align="center" align="center" label="激活日期" prop='activeDate'>
                <template slot-scope="scope">
                  <span>{{scope.row.activeDate}}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip header-align="center" align="center" label="激活年限" prop='activeYears'>
                <template slot-scope="scope">
                  <span>{{scope.row.activeYears}}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip header-align="center" align="center" label="创建日期" prop='createDate'>
                <template slot-scope="scope">
                  <span>{{scope.row.createDate}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作" width="200">
                <template slot-scope="scope">
                  <el-button size="small" type="text" @click="modifyCotEquipment(scope.row,'update')">修改
                  </el-button>|
                  <el-button size="small" type="text" @click="deleteCotEquipment(scope.row,'delete')">删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <div v-show="!listLoading" class="pagination-container">
              <el-row>
                <el-col :span="7">
                  <el-button type="info" round plain size="small" :disabled="isBatch" icon="delete" @click="deleteBatch">批量删除</el-button>
                </el-col>
                <el-col :span="17">
                  <el-pagination @size-change="pageSizeChange" @current-change="currentPageChange" :current-page.sync="filterForm.current" :page-sizes="pageSize" :page-size="filterForm.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                  </el-pagination>
                </el-col>
              </el-row>
            </div>

            <el-dialog center class="create_dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" size="small" :before-close="closeDialog">
              <el-form :model="cotEquipmentForm" :rules="cotEquipmentFormRules" ref="cotEquipmentForm" label-width="80px">
                <el-row>
                  <el-col :span="11">
                    <el-form-item label="设备名称" :label-width="formLabelWidth" prop="equipmentName">
                      <el-input size="small" v-model="cotEquipmentForm.equipmentName" :maxlength="40"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="IMEI" :label-width="formLabelWidth" prop="imei">
                      <el-input size="small" v-model="cotEquipmentForm.imei" :maxlength="50"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="11">
                    <el-form-item label="设备型号" :label-width="formLabelWidth" prop="modelId">
                      <el-select size="small" v-model="cotEquipmentForm.modelId" clearable filterable remote placeholder="请搜索"
                                 :remote-method="searchEquipmentModels" :loading="searchEquipmentModelLoading">
                        <el-option v-for="item in equipmentModelList" :key="item.id" :label="item.modelName" :value="item.id"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="设备组" :label-width="formLabelWidth" prop="groupId">
                      <el-select size="small" v-model="cotEquipmentForm.groupId" clearable placeholder="请选择">
                        <el-option v-for="item in equipmentGroupList" :key="item.id" :label="item.groupName" :value="item.id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="11">
                    <el-form-item label="通信类型" :label-width="formLabelWidth" prop="connectType">
                      <el-select size="small" v-model="cotEquipmentForm.connectType" clearable placeholder="请选择">
                        <el-option v-for="item in connectTypeMapArr" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="通信号码" :label-width="formLabelWidth" prop="connectNo">
                      <el-input size="small" v-model="cotEquipmentForm.connectNo" :maxlength="20"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="11">
                    <el-form-item label="出厂日期" :label-width="formLabelWidth" prop="leaveFactoryDate">
                      <el-date-picker size="small" v-model="cotEquipmentForm.leaveFactoryDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                                      placeholder="选择日期时间"></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="软件版本" :label-width="formLabelWidth" prop="softwareVersion">
                      <el-input size="small" v-model="cotEquipmentForm.softwareVersion" :maxlength="10"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="11">
                    <el-form-item label="硬件版本" :label-width="formLabelWidth" prop="hardwareVersion">
                      <el-input size="small" v-model="cotEquipmentForm.hardwareVersion" :maxlength="10"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="激活状态" :label-width="formLabelWidth" prop="activeStatus">
                      <el-select size="small" v-model="cotEquipmentForm.activeStatus" clearable placeholder="请选择">
                        <el-option v-for="item in activeStatusMapArr" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="11">
                    <el-form-item label="激活日期" :label-width="formLabelWidth" prop="activeDate">
                      <el-date-picker size="small" v-model="cotEquipmentForm.activeDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                                      placeholder="选择日期时间"></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="激活年限" :label-width="formLabelWidth" prop="activeYears">
                      <el-input size="small" v-model.number="cotEquipmentForm.activeYears" :maxlength="11"></el-input>
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
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import { getEquipmentList, addEquipment, editEquipment, delEquipment, delBatchEquipment } from '@/api/merchant/work/equipment'
import { globalConfig } from '@/globalConfig'
import waves from '@/directive/waves/index.js'
import { getApplicationCode, getCurProjectCode } from '@/api/common'
import SidebarMenu from '@/views/plat/layout/SidebarMenu'

import {
  searchEquipmentModels
} from '@/api/manager/collect/equipmentModel'

export default {
  name: 'tableCotEquipment',
  directives: {
    waves
  },
  components: {
    'sidebar-menu': SidebarMenu
  },
  data() {
    return {
      curApplicationCode: getApplicationCode(this),
      curProjectCode: getCurProjectCode(),
      list: [],
      total: 0,
      listLoading: true,
      downloadLoading: false,
      isBatch: true,
      pageSize: globalConfig.pageSize,
      filterForm: {
        searchWord: '',
        current: globalConfig.startPage,
        pageSize: globalConfig.initPageSize
      },
      dialogStatus: '',
      tableKey: 0,
      dialogFormVisible: false,
      dialogEditFormVisible: false,
      searchEquipmentModelLoading: false,
      formLabelWidth: '120px',
      cotEquipmentForm: {
        id: '',
        modelId: '',
        groupId: '',
        equipmentName: '',
        merchantId: '',
        projectCode: '',
        imei: '',
        connectType: '',
        connectNo: '',
        leaveFactoryDate: '',
        softwareVersion: '',
        hardwareVersion: '',
        activeStatus: '',
        activeDate: '',
        activeYears: '',
        createDate: '',
        createBy: '',
        updateDate: '',
        updateBy: ''
      },
      textMap: {
        update: '编辑设备',
        create: '添加设备'
      },
      activeStatusMapArr: [
        { label: '未激活', value: '00' },
        { label: '已激活', value: '01' }
      ],
      activeStatusMapObj: {
        '00': '未激活',
        '01': '已激活'
      },
      connectTypeMapArr: [
        { label: '4G', value: '00' },
        { label: '光纤', value: '01' }
      ],
      connectTypeMapObj: {
        '00': '4G',
        '01': '光纤'
      },
      // 表单校验规则
      cotEquipmentFormRules: {
        modelId: [{
          type: 'number',
          required: true,
          message: '请选择设备型号',
          trigger: 'blur'
        }],
        equipmentName: [{
          required: true,
          message: '请输入设备名称',
          trigger: 'blur'
        }],
        imei: [{
          required: true,
          message: '请输入设备IMEI码',
          trigger: 'blur'
        }],
        connectType: [{
          required: true,
          message: '请选择通信类型',
          trigger: 'change'
        }],
        connectNo: [{
          required: false,
          message: '请输入通信号码',
          trigger: 'blur'
        }],
        leaveFactoryDate: [{
          required: true,
          message: '请输入出厂日期',
          trigger: 'blur'
        }],
        softwareVersion: [{
          required: true,
          message: '请输入软件版本',
          trigger: 'blur'
        }],
        hardwareVersion: [{
          required: true,
          message: '请输入硬件版本',
          trigger: 'blur'
        }],
        activeStatus: [{
          required: true,
          message: '请选择激活状态',
          trigger: 'change'
        }]
      },
      // 设备型号列表
      equipmentModelList: [],
      // 设备组列表
      equipmentGroupList: []
    }
  },
  computed: {
    minimenu2ndStatus() {
      return this.$store.state.app.minimenu2ndStatus
    }
  },
  created() {
    this.getEquipmentList()
  },
  methods: {
    searchEquipmentModels(keyword) {
      if (keyword !== '') {
        this.searchEquipmentModelLoading = true
        searchEquipmentModels({ modelName: keyword, curApplicationCode: this.curApplicationCode }).then(response => {
          if (response.data.error_no === 0) {
            this.equipmentModelList = response.data.result
          } else {
            this.$message(response.data.error_info)
          }
          this.searchEquipmentModelLoading = false
        })
      } else {
        this.equipmentModelList = []
      }
    },
    getEquipmentList() {
      this.listLoading = true
      this.filterForm.curApplicationCode = this.curApplicationCode
      this.filterForm.projectCode = this.curProjectCode
      getEquipmentList(this.filterForm).then(response => {
        if (response.data.error_no === 0) {
          this.list = response.data.result.records
          this.total = response.data.result.total
        } else {
          this.$message(response.data.error_info)
        }
        this.listLoading = false
      })
    },
    searchCotEquipment() {
      this.filterForm.current = globalConfig.startPage
      this.getEquipmentList()
    },
    addEquipment() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    modifyCotEquipment(row) {
      this.cotEquipmentForm = Object.assign({}, row)
      if (this.equipmentModelList.length === 0) {
        this.equipmentModelList.push({ id: row.modelId, modelName: row.modelName })
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    deleteCotEquipment(row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {
          primaryKey: row.id,
          curApplicationCode: this.curApplicationCode,
          curProjectCode: this.curProjectCode
        }
        this.listLoading = true
        delEquipment(param).then(response => {
          if (response.data.error_no === 0) {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.searchCotEquipment()
            this.$refs.multipleTable.clearSelection()
          } else {
            this.$message(response.data.error_info)
          }
          this.listLoading = false
        })
      })
    },
    deleteBatch() {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const selection = this.$refs.multipleTable.selection
        const selectIds = []
        for (let i = 0; i < selection.length; i++) {
          selectIds.push(selection[i].id)
        }
        const param = {
          primaryKeys: selectIds,
          curApplicationCode: this.curApplicationCode,
          curProjectCode: this.curProjectCode
        }
        this.listLoading = true
        delBatchEquipment(param).then(response => {
          if (response.data.error_no === 0) {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.searchCotEquipment()
            this.$refs.multipleTable.clearSelection()
          } else {
            this.$message(response.data.error_info)
          }
          this.listLoading = false
        })
      })
    },
    pageSizeChange(val) {
      this.filterForm.current = globalConfig.startPage
      this.filterForm.pageSize = val
      this.getEquipmentList()
    },
    currentPageChange(val) {
      this.filterForm.current = val
      this.getEquipmentList()
    },
    addSubmit() {
      this.$refs['cotEquipmentForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          this.cotEquipmentForm.curApplicationCode = this.curApplicationCode
          this.cotEquipmentForm.curProjectCode = this.curProjectCode
          this.cotEquipmentForm.projectCode = this.curProjectCode
          addEquipment(this.cotEquipmentForm).then(response => {
            if (response.data.error_no === 0) {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: response.data.error_info,
                type: 'success',
                duration: 2000
              })
              this.closeDialog()
              this.searchCotEquipment()
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
      this.cotEquipmentForm.curApplicationCode = this.curApplicationCode
      this.cotEquipmentForm.curProjectCode = this.curProjectCode
      this.$refs['cotEquipmentForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          editEquipment(this.cotEquipmentForm).then(response => {
            if (response.data.error_no === 0) {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: response.data.error_info,
                type: 'success',
                duration: 2000
              })
              this.closeDialog()
              this.searchCotEquipment()
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
    resetForm() {
      this.cotEquipmentForm = {
        id: '',
        modelId: '',
        groupId: '',
        equipmentName: '',
        merchantId: '',
        projectCode: '',
        imei: '',
        connectType: '',
        connectNo: '',
        leaveFactoryDate: '',
        softwareVersion: '',
        hardwareVersion: '',
        activeStatus: '',
        activeDate: '',
        activeYears: '',
        createDate: '',
        createBy: '',
        updateDate: '',
        updateBy: ''
      }
      if (this.$refs['cotEquipmentForm'] !== undefined) {
        this.$refs['cotEquipmentForm'].resetFields()
      }
    },
    handleDownload() {
      this.downloadLoading = true
      require.ensure([], () => {
        const { export_json_to_excel } = require('vendor/Export2Excel')
        const tHeader = [
          'id',
          '设备型号id',
          '设备组id',
          '设备名称',
          '商户id',
          '所属项目',
          '设备唯一标识',
          '通信类型',
          '通信号码',
          '出厂日期',
          '软件版本',
          '硬件版本',
          '激活状态',
          '激活日期',
          '激活年限',
          'createDate',
          'createBy',
          'updateDate',
          'updateBy'
        ]
        const filterVal = [
          'id',
          'modelId',
          'groupId',
          'equipmentName',
          'merchantId',
          'projectCode',
          'imei',
          'connectType',
          'connectNo',
          'leaveFactoryDate',
          'softwareVersion',
          'hardwareVersion',
          'activeStatus',
          'activeDate',
          'activeYears',
          'createDate',
          'createBy',
          'updateDate',
          'updateBy'
        ]
        const list = this.list
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, '设备')
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    closeDialog() {
      this.dialogFormVisible = false
      this.resetForm()
    }
  }
}
</script>

<style  rel="stylesheet/scss" lang="scss">
  .el-date-editor.el-input {
    width: 100%;
    min-width: inherit;
  }
</style>
