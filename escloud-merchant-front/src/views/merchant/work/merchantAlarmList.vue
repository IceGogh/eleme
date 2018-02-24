<template>
<div class="main-contain-new clearfix">
  <!-- 侧边菜单导航（按需加载，不需要就删除）-->
  <sidebar-menu></sidebar-menu>

  <!-- main-contain部分-->
  <div class="main-contain-new-inner" :class="{'main-contain-new-inner-all': !minimenu2ndStatus}">
    <template>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="item in activeTitle" :label="item.name" :key="item.name" :name="item.title">
          <keep-alive>
            <div v-if="item.name === '人员报警'">
              <template>
                <!-- 操作栏 （添加、搜索按钮 根据需要写入）-->
                <div class="option-bar">
                  <div class="searchBox">
                    <el-row>
                      <el-col :span="14">
                        <el-date-picker v-model="alarmDate" type="datetimerange" placeholder="报警时间" range-separator="至" start-placeholder="报警开始时间" end-placeholder="报警结束时间" prop="startDate" value-format="yyyy-MM-dd HH:mm:ss">
                        </el-date-picker>
                      </el-col>
                      <el-col :span="8">
                        <input type="text" class="search" placeholder="请输入关键词查询" v-model="filterPersonAlarmForm.searchWord" @keyup.enter="searchMerchantPersonAlarm"/>
                        <i class="el-icon-search" @click="searchMerchantPersonAlarm"></i>
                      </el-col>
                    </el-row>
                  </div>
                </div>
                <template>
                  <div>
                    <div class="app-container calendar-list-container">
                      <!-- 表格-->
                      <el-table ref="multipleTable" :data-key='tableKey' :data="list" fit highlight-current-row size='mini' :default-sort="{prop: 'id', order: 'aescending'}" @select="selectCheckBox" @select-all="selectAllCheckBox" v-loading="listLoading" element-loading-text="给我一点时间" style="width: 100%">
                        <el-table-column type="selection" width="50"></el-table-column>
                        <el-table-column header-align="center" align="center" label="报警类型" prop='alarmTypeName'>
                          <template slot-scope="scope">
                            <span>{{scope.row.alarmTypeName}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip header-align="center" align="center" label="报警内容" prop='alarmDesc' :show-overflow-tooltip='true'>
                          <template  slot-scope="scope">
                            <span>{{scope.row.alarmDesc}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column header-align="center" align="center" label="报警时间" prop='alarmDate'>
                          <template slot-scope="scope">
                            <span>{{scope.row.alarmDate}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip header-align="center" align="center" label="报警位置" prop='alarmAddress' :show-overflow-tooltip='true'>
                          <template  slot-scope="scope">
                            <span>{{scope.row.alarmAddress}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column header-align="center" align="center" label="所属网格" prop='gridId'>
                          <template slot-scope="scope">
                            <span>{{scope.row.gridName}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column header-align="center" align="center" label="报警持续时间" prop='alarmMinuteSum'>
                          <template slot-scope="scope">
                            <span>{{scope.row.alarmMinuteSum}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column header-align="center" align="center" label="人员" prop='alarmEmployeeName'>
                          <template slot-scope="scope">
                            <span>{{scope.row.employeeName}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column header-align="center" align="center" label="岗位" prop='alarmPostName'>
                          <template slot-scope="scope">
                            <span>{{scope.row.postName}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip header-align="center" align="center" label="设备IMEI" prop='alarmEquipmentImei'>
                          <template  slot-scope="scope">
                            <span>{{scope.row.alarmEquipmentImei}}</span>
                          </template>
                        </el-table-column>
                      </el-table>
                      <!-- 分页工具栏-->
                      <div v-show="!listLoading" class="pagination-container">
                        <el-row>
                          <el-col :span="24">
                            <el-pagination @size-change="personAlarmPageSizeChange" @current-change="personAlarmCurrentPageChange" :current-page.sync="filterPersonAlarmForm.current" :page-sizes="pageSize" :page-size="filterPersonAlarmForm.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                            </el-pagination>
                          </el-col>
                        </el-row>
                      </div>
                    </div>
                  </div>
                </template>
              </template>
            </div>
          </keep-alive>
          <keep-alive>
            <div v-if="item.name === '车辆报警'">
              <template>
                <div class="option-bar">
                  <div class="searchBox">
                    <el-row>
                      <el-col :span="14">
                        <el-date-picker v-model="alarmDate" type="datetimerange" placeholder="报警时间" range-separator="至" start-placeholder="报警开始时间" end-placeholder="报警结束时间" prop="startDate"  value-format="yyyy-MM-dd HH:mm:ss">
                        </el-date-picker>
                      </el-col>
                      <el-col :span="8">
                        <input type="text" class="search" placeholder="请输入关键词查询" v-model="filterVehicleAlarmForm.searchWord" @keyup.enter="searchMerchantVehicleAlarm"/>
                        <i class="el-icon-search" @click="searchMerchantVehicleAlarm"></i>
                      </el-col>
                    </el-row>
                  </div>
                </div>
                <template>
                  <div>
                    <div class="app-container calendar-list-container">
                      <!-- 表格-->
                      <el-table ref="multipleTable" :data-key='tableKey' :data="list" fit highlight-current-row size='mini' :default-sort="{prop: 'id', order: 'aescending'}" @select="selectCheckBox" @select-all="selectAllCheckBox" v-loading="vehicleListLoading" element-loading-text="给我一点时间" style="width: 100%">
                        <el-table-column type="selection" width="50"></el-table-column>
                        <el-table-column header-align="center" align="center" label="报警类型" prop='alarmTypeName'>
                          <template slot-scope="scope">
                            <span>{{scope.row.alarmTypeName}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip header-align="center" align="center" label="报警内容" prop='alarmDesc' :show-overflow-tooltip='true'>
                          <template  slot-scope="scope">
                            <span>{{scope.row.alarmDesc}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip header-align="center" align="center" label="报警位置" prop='alarmAddress'>
                          <template  slot-scope="scope">
                            <span>{{scope.row.alarmAddress}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column header-align="center" align="center" label="报警时间" prop='alarmDate'>
                          <template slot-scope="scope">
                            <span>{{scope.row.alarmDate}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column header-align="center" align="center" label="报警时长" prop='alarmMinuteSum'>
                          <template slot-scope="scope">
                            <span>{{scope.row.alarmMinuteSum}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column header-align="center" align="center" label="报警线路" prop='lineId'>
                          <template slot-scope="scope">
                            <span>{{scope.row.lineName}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column header-align="center" align="center" label="司机" prop='alarmEmployeeId'>
                          <template slot-scope="scope">
                            <span>{{scope.row.employeeName}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column header-align="center" align="center" label="报警车牌号" prop='alarmVehicleNo'>
                          <template slot-scope="scope">
                            <span>{{scope.row.licensePlateNo}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip header-align="center" align="center" label="设备IMEI" prop='alarmEquipmentImei'>
                          <template  slot-scope="scope">
                            <span>{{scope.row.alarmEquipmentImei}}</span>
                          </template>
                        </el-table-column>
                      </el-table>
                      <!-- 分页工具栏-->
                      <div v-show="!listLoading" class="pagination-container">
                        <el-row>
                          <el-col :span="24">
                            <el-pagination @size-change="vehicleAlarmPageSizeChange" @current-change="vehicleAlarmCurrentPageChange" :current-page.sync="filterVehicleAlarmForm.current" :page-sizes="pageSize" :page-size="filterVehicleAlarmForm.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                            </el-pagination>
                          </el-col>
                        </el-row>
                      </div>
                    </div>
                  </div>
                </template>
               </template>
            </div>
          </keep-alive>
          <keep-alive>
            <div v-if="item.name === '设备报警'">
              <template>
                <div class="option-bar">
                  <div class="searchBox">
                    <el-row>
                      <el-col :span="14">
                        <el-date-picker v-model="alarmDate" type="datetimerange" placeholder="报警时间" range-separator="至" start-placeholder="报警开始时间" end-placeholder="报警结束时间" prop="startDate"  value-format="yyyy-MM-dd HH:mm:ss">
                        </el-date-picker>
                      </el-col>
                      <el-col :span="8">
                        <input type="text" class="search" placeholder="请输入关键词查询" v-model="filterEquipmentAlarmForm.searchWord" @keyup.enter="searchMerchantEquipmentAlarm"/>
                        <i class="el-icon-search" @click="searchMerchantEquipmentAlarm"></i>
                      </el-col>
                    </el-row>
                  </div>
                </div>
                <template>
                  <div>
                    <div class="app-container calendar-list-container">
                      <!-- 表格-->
                      <el-table ref="multipleTable" :data-key='tableKey' :data="list" fit highlight-current-row size='mini' :default-sort="{prop: 'id', order: 'aescending'}" @select="selectCheckBox" @select-all="selectAllCheckBox" v-loading="equipmentListLoading" element-loading-text="给我一点时间" style="width: 100%">
                        <el-table-column type="selection" width="50"></el-table-column>
                        <el-table-column header-align="center" align="center" label="报警类型" prop='alarmTypeName'>
                          <template slot-scope="scope">
                            <span>{{scope.row.alarmTypeName}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip header-align="center" align="center" label="报警内容" prop='alarmDesc' :show-overflow-tooltip='true'>
                          <template  slot-scope="scope">
                            <span>{{scope.row.alarmDesc}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column header-align="center" align="center" label="报警时间" prop='alarmDate'>
                          <template slot-scope="scope">
                            <span>{{scope.row.alarmDate}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column header-align="center" align="center" label="报警时长" prop='alarmMinuteSum'>
                          <template slot-scope="scope">
                            <span>{{scope.row.alarmMinuteSum}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip header-align="center" align="center" label="设备类型" prop='alarmEquipmentImei'>
                          <template  slot-scope="scope">
                            <span>{{scope.row.modelName}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip header-align="center" align="center" label="设备IMEI" prop='alarmEquipmentImei'>
                          <template  slot-scope="scope">
                            <span>{{scope.row.alarmEquipmentImei}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column header-align="center" align="center" label="关联设施" prop='alarmEmployeeId'>
                          <template slot-scope="scope">
                            <span>{{scope.row.facilityName}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column header-align="center" align="center" label="责任人" prop='alarmEmployeeId'>
                          <template slot-scope="scope">
                            <span>{{scope.row.employeeName}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column header-align="center" align="center" label="岗位" prop='alarmEmployeeId'>
                          <template slot-scope="scope">
                            <span>{{scope.row.postName}}</span>
                          </template>
                        </el-table-column>
                      </el-table>
                      <!-- 分页工具栏-->
                      <div v-show="!listLoading" class="pagination-container">
                        <el-row>
                          <el-col :span="24">
                            <el-pagination @size-change="equipmentAlarmPageSizeChange" @current-change="equipmentAlarmCurrentPageChange" :current-page.sync="filterEquipmentAlarmForm.current" :page-sizes="pageSize" :page-size="filterEquipmentAlarmForm.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                            </el-pagination>
                          </el-col>
                        </el-row>
                      </div>
                    </div>
                  </div>
                </template>
              </template>
            </div>
          </keep-alive>
        </el-tab-pane>
      </el-tabs>
    </template>
  </div>
</div>
</template>
<script>
import { getMerchantPersonAlarmList, getMerchantVehicleAlarmList, getMerchantEquipmentAlarmList } from '@/api/merchant/work/merchantAlarm'
import { globalConfig } from '@/globalConfig'
import waves from '@/directive/waves/index.js'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
import { getApplicationCode, getCurProjectCode } from '@/api/common'
import SidebarMenu from '@/views/plat/layout/SidebarMenu'

export default {
  name: 'tableMerchantPersonAlarm',
  directives: {
    waves
  },
  components: { ImageCropper, PanThumb, 'sidebar-menu': SidebarMenu },
  data() {
    return {
      curProjectCode: getCurProjectCode(),
      curApplicationCode: '',
      list: [],
      total: 0,
      listLoading: true,
      vehicleListLoading: true,
      equipmentListLoading: true,
      isBatch: true,
      alarmDate: [],
      pageSize: globalConfig.pageSize,
      filterFormLabelWidth: '100px',
      filterFormLabelWidth2: '12px',
      filterPersonAlarmForm: {
        startDate: '',
        endDate: '',
        searchWord: '',
        current: globalConfig.startPage,
        pageSize: globalConfig.initPageSize
      },
      filterVehicleAlarmForm: {
        startDate: '',
        endDate: '',
        searchWord: '',
        current: globalConfig.startPage,
        pageSize: globalConfig.initPageSize
      },
      filterEquipmentAlarmForm: {
        startDate: '',
        endDate: '',
        searchWord: '',
        current: globalConfig.startPage,
        pageSize: globalConfig.initPageSize
      },
      dialogStatus: '',
      tableKey: 0,
      dialogFormVisible: false,
      dialogEditFormVisible: false,
      formLabelWidth: '120px',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      activeName: 'personAlarm',
      activeTitle: [
        {
          title: 'personAlarm',
          name: '人员报警'
        },
        {
          title: 'vehicleAlarm',
          name: '车辆报警'
        },
        {
          title: 'equipmentAlarm',
          name: '设备报警'
        }
      ]
    }
  },
  computed: {
    minimenu2ndStatus() {
      return this.$store.state.app.minimenu2ndStatus
    }
  },
  created() {
    this.curApplicationCode = getApplicationCode(this)
    this.getMerchantPersonAlarmList()
  },
  methods: {
    handleClick(tab, event) {
      if (tab.paneName === 'personAlarm') {
        this.list = []
        this.total = 0
        this.alarmDate = []
        this.filterPersonAlarmForm.startDate = ''
        this.filterPersonAlarmForm.endDate = ''
        this.filterPersonAlarmForm.searchWord = ''
        this.getMerchantPersonAlarmList()
      }
      if (tab.paneName === 'vehicleAlarm') {
        this.list = []
        this.total = 0
        this.alarmDate = []
        this.filterVehicleAlarmForm.startDate = ''
        this.filterVehicleAlarmForm.endDate = ''
        this.filterVehicleAlarmForm.searchWord = ''
        this.getMerchantVehicleAlarmList()
      }
      if (tab.paneName === 'equipmentAlarm') {
        this.list = []
        this.total = 0
        this.alarmDate = []
        this.filterEquipmentAlarmForm.startDate = ''
        this.filterEquipmentAlarmForm.endDate = ''
        this.filterEquipmentAlarmForm.searchWord = ''
        this.getMerchantEquipmentAlarmList()
      }
    },
    getMerchantPersonAlarmList() {
      this.listLoading = true
      this.filterPersonAlarmForm.curApplicationCode = this.curApplicationCode
      this.filterPersonAlarmForm.projectCode = this.curProjectCode
      getMerchantPersonAlarmList(this.filterPersonAlarmForm).then(response => {
        if (response.data.error_no === 0) {
          this.list = response.data.result.records
          this.total = response.data.result.total
        } else {
          this.$message(response.data.error_info)
        }
        this.listLoading = false
      })
    },
    getMerchantVehicleAlarmList() {
      this.vehicleListLoading = true
      this.filterVehicleAlarmForm.curApplicationCode = this.curApplicationCode
      this.filterVehicleAlarmForm.projectCode = this.curProjectCode
      getMerchantVehicleAlarmList(this.filterVehicleAlarmForm).then(response => {
        if (response.data.error_no === 0) {
          this.list = response.data.result.records
          this.total = response.data.result.total
        } else {
          this.$message(response.data.error_info)
        }
        this.vehicleListLoading = false
      })
    },
    getMerchantEquipmentAlarmList() {
      this.equipmentListLoading = true
      this.filterEquipmentAlarmForm.curApplicationCode = this.curApplicationCode
      this.filterEquipmentAlarmForm.projectCode = this.curProjectCode
      getMerchantEquipmentAlarmList(this.filterEquipmentAlarmForm).then(response => {
        if (response.data.error_no === 0) {
          this.list = response.data.result.records
          this.total = response.data.result.total
        } else {
          this.$message(response.data.error_info)
        }
        this.equipmentListLoading = false
      })
    },
    searchMerchantPersonAlarm() {
      if (this.alarmDate) {
        this.filterPersonAlarmForm.startDate = this.alarmDate[0]
        this.filterPersonAlarmForm.endDate = this.alarmDate[1]
      }
      this.filterPersonAlarmForm.current = globalConfig.startPage
      this.getMerchantPersonAlarmList()
    },
    searchMerchantVehicleAlarm() {
      if (this.alarmDate) {
        this.filterVehicleAlarmForm.startDate = this.alarmDate[0]
        this.filterVehicleAlarmForm.endDate = this.alarmDate[1]
      }
      this.filterVehicleAlarmForm.current = globalConfig.startPage
      this.getMerchantPersonAlarmList()
    },
    searchMerchantEquipmentAlarm() {
      if (this.alarmDate) {
        this.filterEquipmentAlarmForm.startDate = this.alarmDate[0]
        this.filterEquipmentAlarmForm.endDate = this.alarmDate[1]
      }
      this.filterEquipmentAlarmForm.current = globalConfig.startPage
      this.getMerchantPersonAlarmList()
    },
    equipmentAlarmPageSizeChange(val) {
      this.filterEquipmentAlarmForm.current = globalConfig.startPage
      this.filterEquipmentAlarmForm.pageSize = val
      this.getMerchantEquipmentAlarmList()
    },
    equipmentAlarmCurrentPageChange(val) {
      this.filterEquipmentAlarmForm.current = val
      this.getMerchantEquipmentAlarmList()
    },
    personAlarmPageSizeChange(val) {
      this.filterPersonAlarmForm.current = globalConfig.startPage
      this.filterPersonAlarmForm.pageSize = val
      this.getMerchantPersonAlarmList()
    },
    personAlarmCurrentPageChange(val) {
      this.filterPersonAlarmForm.current = val
      this.getMerchantPersonAlarmList()
    },
    vehicleAlarmPageSizeChange(val) {
      this.filterVehicleAlarmForm.current = globalConfig.startPage
      this.filterVehicleAlarmForm.pageSize = val
      this.getMerchantVehicleAlarmList()
    },
    vehicleAlarmCurrentPageChange(val) {
      this.filterVehicleAlarmForm.current = val
      this.getMerchantVehicleAlarmList()
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
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}
</script>
