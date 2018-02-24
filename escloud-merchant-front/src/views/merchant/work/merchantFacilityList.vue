<template>
  <div class="main-contain-new clearfix">
    <!-- 菜单导航-->
    <sidebar-menu></sidebar-menu>

    <!-- main-contain部分-->
    <div class="main-contain-new-inner" :class="{'main-contain-new-inner-all': !minimenu2ndStatus}">
      <!-- 操作栏 （添加、搜索按钮 根据需要写入）-->
      <div class="option-bar">
        <el-button type="edenep-blue-btn" icon="el-icon-circle-plus-outline" class="add-btn" @click="addMerchantFacility">添加设施</el-button>
        <div class="searchBox">
          <input type="text" class="search" placeholder="请输入关键词查询" v-model="filterForm.searchWord" @keyup.enter="searchMerchantFacility" />
          <i class="el-icon-search" @click="searchMerchantFacility"></i>
        </div>
      </div>

      <template>
        <div>
          <div class="app-container calendar-list-container">
            <el-table ref="multipleTable" :data-key='tableKey' :data="list" fit highlight-current-row size='mini'
                      :default-sort="{prop: 'id', order: 'aescending'}" @select="selectCheckBox" @select-all="selectAllCheckBox" v-loading="listLoading"
                      element-loading-text="给我一点时间" style="width: 100%">
              <el-table-column type="selection" width="50"></el-table-column>
              <el-table-column header-align="center" align="center" label="设施名称" prop='facilityName'>
                <template slot-scope="scope">
                  <span>{{scope.row.facilityName}}</span>
                </template>
              </el-table-column>
              <el-table-column header-align="center" align="center" label="设施类型" prop='facilityType'>
                <template slot-scope="scope">
                  <span v-if="facilityTypeList.length > 0">{{findBy(facilityTypeList, 'enumValue', scope.row.facilityType).enumName}}</span>
                </template>
              </el-table-column>
              <el-table-column header-align="center" align="center" label="责任人" prop='facilityType' :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <span v-for="(item, i) in scope.row.facilityManagerList">{{item.employeeName}}
                    <span v-if="i < scope.row.facilityManagerList.length -1">，</span>
                  </span>
                </template>
              </el-table-column>
              <el-table-column header-align="center" align="center" label="设施半径" prop='facilityRadii'>
                <template slot-scope="scope">
                  <span>{{scope.row.facilityRadii}}</span>
                </template>
              </el-table-column>
              <el-table-column header-align="center" align="center" label="描述" prop='facilityDesc' :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <span>{{scope.row.facilityDesc}}</span>
                </template>
              </el-table-column>
              <el-table-column header-align="center" align="center" label="创建时间" prop='createDate'>
                <template slot-scope="scope">
                  <span>{{scope.row.createDate}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作" width="200">
                <template slot-scope="scope">
                  <el-button size="small" type="text" @click="modifyMerchantFacility(scope.row,'update')">修改
                  </el-button>|
                  <el-button size="small" type="text" @click="deleteMerchantFacility(scope.row,'delete')">删除
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
                  <el-pagination @size-change="pageSizeChange" @current-change="currentPageChange" :current-page.sync="filterForm.current"
                                 :page-sizes="pageSize" :page-size="filterForm.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                  </el-pagination>
                </el-col>
              </el-row>
            </div>

            <el-dialog class="create_dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :before-close="closeDialog" :close-on-click-modal="false">
              <el-form :model="merchantFacilityForm" :rules="merchantFacilityFormRules" ref="merchantFacilityForm" label-width="80px">
                <el-row>
                  <el-col :span="11">
                    <el-form-item label="设施名称" :label-width="formLabelWidth" prop="facilityName">
                      <el-input size="small" v-model="merchantFacilityForm.facilityName" :maxlength="20"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="设施类型" :label-width="formLabelWidth" prop="facilityType">
                      <el-select size="small" v-model="merchantFacilityForm.facilityType" clearable placeholder="请选择">
                        <el-option v-for="item in facilityTypeList" :key="item.enumValue" :label="item.enumName" :value="item.enumValue">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="11">
                    <el-form-item label="设施半径" :label-width="formLabelWidth" prop="facilityRadii">
                      <el-input size="small" v-model.number="merchantFacilityForm.facilityRadii"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="责任人" :label-width="formLabelWidth">
                      <el-select size="small" v-model="merchantFacilityForm.facilityManagerIdList" :multiple="true" clearable filterable remote
                                 placeholder="请搜索"
                                 :remote-method="searchEmployee" :loading="searchEmployeeLoading">
                        <el-option v-for="item in employeeList" :key="item.employeeId" :label="item.employeeName" :value="item.employeeId">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="22">
                    <el-form-item label="地址" :label-width="formLabelWidth" prop="facilityAddress">
                      <el-input size="small" v-model="merchantFacilityForm.facilityAddress" readonly placeholder="请点击选择地点"
                                @focus="showMapDialog"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="22">
                    <el-form-item label="描述" :label-width="formLabelWidth" prop="facilityDesc">
                      <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5 }" v-model="merchantFacilityForm.facilityDesc"
                                :maxlength="30"></el-input>
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

            <el-dialog class="create_dialog" title="地图选点" :visible.sync="dialogMapVisible" :before-close="closeMapDialog"  :close-on-click-modal="false">
              <el-row :gutter="16">
                <el-col :span="8">
                  <el-input size="small" v-model="gotoCityName" :maxlength="10" placeholder="请输入城市的名称" @keyup.enter.native="gotoCity"></el-input>
                </el-col>
                <el-col :span="2">
                  <el-button size="small" @click="gotoCity">到指定的城市</el-button>
                </el-col>
              </el-row>
              <div id="mapContainer" style="width:100%; height:400px; margin-top: 10px"></div>
              <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitMap">确 定</el-button>
              </div>
            </el-dialog>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
  var map

  import {
    getMerchantFacilityList,
    addMerchantFacility,
    editMerchantFacility,
    delMerchantFacility,
    delBatchMerchantFacility,
    searchEmployee
  } from '@/api/merchant/work/merchantFacility'
  import { globalConfig } from '@/globalConfig'
  import waves from '@/directive/waves/index.js'
  import PanThumb from '@/components/PanThumb'
  import { getApplicationCode, getDicts, getCurProjectCode } from '@/api/common'
  import SidebarMenu from '@/views/plat/layout/SidebarMenu'

  export default {
    name: 'tableMerchantFacility',
    directives: {
      waves
    },
    components: { PanThumb, 'sidebar-menu': SidebarMenu },
    data() {
      return {
        curApplicationCode: getApplicationCode(this),
        curProjectCode: getCurProjectCode(),
        list: [],
        total: 0,
        listLoading: true,
        downloadLoading: false,
        searchEmployeeLoading: false,
        isBatch: true,
        pageSize: globalConfig.pageSize,
        filterFormLabelWidth: '100px',
        filterFormLabelWidth2: '12px',
        filterForm: {
          searchWord: '',
          current: globalConfig.startPage,
          pageSize: globalConfig.initPageSize
        },
        dialogStatus: '',
        tableKey: 0,
        dialogFormVisible: false,
        dialogEditFormVisible: false,
        dialogMapVisible: false,
        formLabelWidth: '120px',
        merchantFacilityForm: {
          facilityName: '',
          facilityType: '',
          facilityRadii: '',
          facilityDesc: '',
          facilityAddress: '',
          addressDTO: null,
          facilityManagerIdList: []
        },
        textMap: {
          update: '编辑',
          create: '创建'
        },
        stateMapArr: [],
        stateMapObj: {},
        // 表单校验规则
        merchantFacilityFormRules: {
          facilityName: [{
            required: true,
            message: '请输入设施名称',
            trigger: 'blur'
          }],
          facilityType: [{
            required: true,
            message: '请选择设施类型',
            trigger: 'change'
          }],
          facilityAddress: [{
            required: true,
            message: '请选择设施地点',
            trigger: 'change'
          }],
          facilityRadii: [{
            type: 'number',
            required: true,
            message: '请输入设施半径',
            trigger: 'blur'
          }, {
            type: 'number',
            message: '设施半径必须为数字值'
          }]
        },
        // 设施类型，将来源于数据字典
        facilityTypeList: [],
        // 员工搜索结果列表
        employeeList: [],
        mapResult: null,
        zoom: 16,
        gotoCityName: ''
      }
    },
    computed: {
      minimenu2ndStatus() {
        return this.$store.state.app.minimenu2ndStatus
      }
    },
    created() {
      this.getMerchantFacilityList()
      this.facilityTypeList = getDicts('PLAT_DICT_FACILITY_TYPE')
    },
    methods: {
      findBy(array, attrName, attrVal) {
        const result = array.filter((item) => {
          return item[attrName] === attrVal
        })
        if (result) {
          return result.length === 1 ? result[0] : result
        }

        return null
      },
      showMapDialog() {
        this.dialogMapVisible = true
        window.setTimeout(() => {
          this.initMap()
        }, 500)
      },
      closeMapDialogAndClearMapDatas() {
        this.gotoCityName = ''
        this.mapResult = null
        this.dialogMapVisible = false
      },
      closeMapDialog() {
        this.dialogMapVisible = false
      },
      initMap() {
        AMapUI.loadUI(['misc/PositionPicker'], (PositionPicker) => {
          map = new AMap.Map('mapContainer', {
            resizeEnable: true,
            zoom: this.zoom
          })

          map.plugin(['AMap.ToolBar'], function() {
            map.addControl(new AMap.ToolBar())
          })

          var positionPicker = new PositionPicker({
            mode: 'dragMap',
            map: map
          })

          positionPicker.on('success', (positionResult) => {
            this.mapResult = positionResult
          })

          if (this.merchantFacilityForm.addressDTO) {
            positionPicker.start([this.merchantFacilityForm.addressDTO.longitude, this.merchantFacilityForm.addressDTO.latitude])
          } else {
            positionPicker.start()
          }

          map.panBy(0, 1)
          map.addControl(new AMap.ToolBar({
            liteStyle: true
          }))
        })
      },
      gotoCity() {
        if (this.gotoCityName) {
          map.setCity(this.gotoCityName)
        }
      },
      submitMap() {
        if (this.mapResult && this.mapResult.info === 'OK') {
          this.merchantFacilityForm.facilityAddress = this.mapResult.address
          this.merchantFacilityForm.addressDTO = this.merchantFacilityForm.addressDTO || {}
          const addressComponent = this.mapResult.regeocode.addressComponent
          this.merchantFacilityForm.addressDTO.province = addressComponent.province
          this.merchantFacilityForm.addressDTO.city = addressComponent.city
          this.merchantFacilityForm.addressDTO.district = addressComponent.district
          this.merchantFacilityForm.addressDTO.address = this.mapResult.address
          this.merchantFacilityForm.addressDTO.longitude = this.mapResult.position.lng
          this.merchantFacilityForm.addressDTO.latitude = this.mapResult.position.lat
        }

        this.closeMapDialog()
      },
      getMerchantFacilityList() {
        this.listLoading = true
        this.filterForm.curApplicationCode = this.curApplicationCode
        this.filterForm.curProjectCode = this.curProjectCode
        this.filterForm.projectCode = this.curProjectCode
        getMerchantFacilityList(this.filterForm).then(response => {
          if (response.data.error_no === 0) {
            this.list = response.data.result.records
            this.total = response.data.result.total
          } else {
            this.$message(response.data.error_info)
          }
          this.listLoading = false
        })
      },
      searchMerchantFacility() {
        this.filterForm.current = globalConfig.startPage
        this.getMerchantFacilityList()
      },
      searchEmployee(keyword) {
        if (keyword) {
          this.searchEmployeeLoading = true
          searchEmployee({ projectCode: this.curProjectCode, keyword: keyword, curApplicationCode: this.curApplicationCode, curProjectCode: this.curProjectCode }).then(response => {
            if (response.data.error_no === 0) {
              this.employeeList = response.data.result
            } else {
              this.$message(response.data.error_info)
            }
            this.searchEmployeeLoading = false
          })
        } else {
          this.employeeList = []
        }
      },
      addMerchantFacility() {
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      modifyMerchantFacility(row) {
        row.facilityManagerIdList = []
        row.facilityAddress = ''
        this.employeeList = []
        this.merchantFacilityForm = Object.assign({}, row)
        for (let i = 0; i < row.facilityManagerList.length; i++) {
          this.merchantFacilityForm.facilityManagerIdList.push(row.facilityManagerList[i].employeeId)
          this.employeeList.push(row.facilityManagerList[i])
        }

        this.merchantFacilityForm.facilityAddress = row.addressDTO.address
        if (map) {
          map.setCity(row.addressDTO.city)
        }
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },
      deleteMerchantFacility(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
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
          delMerchantFacility(param).then(response => {
            if (response.data.error_no === 0) {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
              this.searchMerchantFacility()
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
          for (let i = 0; i < selection.length; i++) {
            selectIds.push(selection[i].id)
          }
          const param = {
            primaryKeys: selectIds,
            curApplicationCode: this.curApplicationCode,
            curProjectCode: this.curProjectCode
          }
          delBatchMerchantFacility(param).then(response => {
            if (response.data.error_no === 0) {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
              this.searchMerchantFacility()
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
        this.getMerchantFacilityList()
      },
      currentPageChange(val) {
        this.filterForm.current = val
        this.getMerchantFacilityList()
      },
      addSubmit() {
        this.$refs['merchantFacilityForm'].validate((valid) => {
          if (valid) {
            this.listLoading = true
            this.merchantFacilityForm.curApplicationCode = this.curApplicationCode
            this.merchantFacilityForm.curProjectCode = this.curProjectCode
            this.merchantFacilityForm.projectCode = this.curProjectCode
            if (this.merchantFacilityForm.facilityManagerIdList.length > 0) {
              this.merchantFacilityForm.facilityManagerIdListJson = JSON.stringify(this.merchantFacilityForm.facilityManagerIdList)
            }
            this.merchantFacilityForm.facilityAddressJson = JSON.stringify(this.merchantFacilityForm.addressDTO)
            delete this.merchantFacilityForm.addressDTO
            addMerchantFacility(this.merchantFacilityForm).then(response => {
              if (response.data.error_no === 0) {
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: response.data.error_info,
                  type: 'success',
                  duration: 2000
                })
                this.closeDialog()
                this.searchMerchantFacility()
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
        this.merchantFacilityForm.curApplicationCode = this.curApplicationCode
        this.merchantFacilityForm.curProjectCode = this.curProjectCode
        this.merchantFacilityForm.projectCode = this.curProjectCode
        if (this.merchantFacilityForm.facilityManagerIdList.length > 0) {
          this.merchantFacilityForm.facilityManagerIdListJson = JSON.stringify(this.merchantFacilityForm.facilityManagerIdList)
        }
        this.merchantFacilityForm.facilityAddressJson = JSON.stringify(this.merchantFacilityForm.addressDTO)
        delete this.merchantFacilityForm.addressDTO
        this.merchantFacilityForm.facilityManagerIdList = []
        delete this.merchantFacilityForm.facilityManagerList
        this.$refs['merchantFacilityForm'].validate((valid) => {
          if (valid) {
            this.listLoading = true
            editMerchantFacility(this.merchantFacilityForm).then(response => {
              if (response.data.error_no === 0) {
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: response.data.error_info,
                  type: 'success',
                  duration: 2000
                })
                this.closeDialog()
                this.searchMerchantFacility()
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
        this.merchantFacilityForm = {
          facilityName: '',
          facilityType: '',
          facilityRadii: '',
          facilityDesc: '',
          facilityAddress: '',
          addressDTO: null,
          facilityManagerIdList: []
        }
        if (this.$refs['merchantFacilityForm'] !== undefined) {
          this.$refs['merchantFacilityForm'].resetFields()
        }
      },
      handleDownload() {
        this.downloadLoading = true
        require.ensure([], () => {
          const { export_json_to_excel } = require('vendor/Export2Excel')
          const tHeader = [
            '主键ID',
            '项目内码',
            '设施内码',
            '设施名称',
            '设施类型',
            '设施半径',
            '描述',
            '状态',
            '创建者',
            '创建时间',
            '修改者',
            '修改时间'
          ]
          const filterVal = [
            'id',
            'projectCode',
            'facilityCode',
            'facilityName',
            'facilityType',
            'facilityRadii',
            'facilityDesc',
            'state',
            'createBy',
            'createDate',
            'updateBy',
            'updateDate'
          ]
          const list = this.list
          const data = this.formatJson(filterVal, list)
          export_json_to_excel(tHeader, data, '设施表')
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
