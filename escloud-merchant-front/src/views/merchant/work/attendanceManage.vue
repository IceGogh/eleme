<template>
  <div>
    <!-- 操作栏 （添加、搜索按钮 根据需要写入）-->
    <div class="option-bar">
      <el-button type="edenep-blue-btn" icon="el-icon-circle-plus-outline" class="add-btn" @click="addMerchantAttendanceGroup">添加考勤组</el-button>
      <div class="searchBox">
        <input type="text" class="search" placeholder="请输入关键词查询" v-model="filterForm.searchWord" @keyup.enter="searchMerchantAttendanceGroup"/>
        <i class="el-icon-search" @click="searchMerchantAttendanceGroup"></i>
      </div>
    </div>

    <div class="app-container calendar-list-container">
      <!-- 表格-->
      <el-table ref="multipleTable" :data-key='tableKey' :data="list" size='mini' border @select="selectCheckBox" @select-all="selectAllCheckBox" v-loading="listLoading"
                element-loading-text="给我一点时间" style="width: 100%">
        <el-table-column width="80" header-align="center" align="center" label="序号" prop='id'>
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column width="200" header-align="center" show-overflow-tooltip align="center" label="考勤组名称" prop='attendanceGroupName'>
          <template slot-scope="scope">
            <span>{{scope.row.attendanceGroupName}}</span>
          </template>
        </el-table-column>
        <el-table-column width="100" header-align="center" align="center" label="人数">
          <template slot-scope="scope">
            <span>{{scope.row.employeeCount}}</span>
          </template>
        </el-table-column>
        <el-table-column width="150" header-align="center" align="center" label="考勤类型" prop='attendanceType'>
          <template slot-scope="scope">
            <span>{{attendanceTypeMap[scope.row.attendanceType]}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="center" label="考勤时间" show-overflow-tooltip prop='createBy'>
          <template slot-scope="scope">
            <span v-html="renderAttendanceGroupTimes(scope.row)"></span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="250">
          <template slot-scope="scope">
            <el-button :disabled="scope.row.attendanceType == attendanceTypeEnum.CONSTANT"
                       :class="{'disabled-text' : scope.row.attendanceType == attendanceTypeEnum.CONSTANT}" size="small" type="text"
                       @click="editEmployeeSchedule(scope.row)">编辑排班
            </el-button>
            |
            <el-button size="small" type="text" @click="modifyMerchantAttendanceGroup(scope.row,'update')">修改规则
            </el-button>
            |
            <el-button size="small" type="text" @click="deleteMerchantAttendanceGroup(scope.row,'delete')">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页工具栏-->
      <div v-show="!listLoading" class="pagination-container">
        <el-row>
          <el-col :span="24">
            <el-pagination @size-change="pageSizeChange" @current-change="currentPageChange" :current-page.sync="filterForm.current"
                           :page-sizes="pageSize" :page-size="filterForm.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
          </el-col>
        </el-row>
      </div>

      <!-- 新增/编辑模态框-->
      <el-dialog class="create_dialog" top="5vh" :title="textMap[dialogStatus]" width="70%" :visible.sync="dialogFormVisible"
                 :close-on-click-modal="false" :before-close="closeDialog">
        <el-form :model="merchantAttendanceGroupForm" class="merchantAttendanceGroupForm" ref="merchantAttendanceGroupForm" label-width="80px">
          <section>
            <el-row>
              <el-col :span="24">
                <el-form-item label="考勤组名称：" :label-width="formLabelWidth" prop="attendanceGroupName">
                  <el-input size="small" v-model="merchantAttendanceGroupForm.attendanceGroupName" :maxlength="50" style="width: 200px"></el-input>
                  <span class="tip-text">最多50个字符（中英文或者数字）</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="考勤人员：" :label-width="formLabelWidth" prop="attendanceType">
                  <el-select multiple size="small" v-model="employeeIdList" filterable remote style="width: 200px"
                             placeholder="请搜索（姓名/部门）" :remote-method="searchEmployee" :loading="searchEmployeeIdLoading">
                    <el-option v-for="item in employeeList" :key="'employeeId-'+item.employeeId" :label="item.employeeName" :value="item.employeeId">
                    </el-option>
                  </el-select>
                  <span class="tip-text">已排班的人员将会被过滤</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="考勤类型：" :label-width="formLabelWidth" prop="attendanceType">
                  <el-radio-group size="small" v-model="merchantAttendanceGroupForm.attendanceType">
                    <el-radio :label="1">固定班<span class="tip-text">(每周上班时间一样)</span></el-radio>
                    <el-radio :label="2">排班制<span class="tip-text">(自定义设置考勤周期)</span></el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </section>

          <section v-show="merchantAttendanceGroupForm.attendanceType == attendanceTypeEnum.CONSTANT">
            <el-row style="margin-top: 20px">
              <el-col :span="24">
                <el-form-item label="工作日设置：" :label-width="formLabelWidth">
                  <span>快捷设置：<el-button type="text" :disabled="isBatchWorkDay" @click="setBatchRest">休息</el-button></span>
                  <el-button size="small" style="margin-left: 20px" :disabled="isBatchWorkDay" @click="setBatchShift">指定班次</el-button>
                  <el-table ref="multipleWorkDayTable" data-key='1' :data="workDayList" fit size='mini'
                            @select="selectWorkDayCheckBox" @select-all="selectAllWorkDayCheckBox" style="width: 100%">
                    <el-table-column type="selection" width="50"></el-table-column>
                    <el-table-column width="80" header-align="center" align="center" label="工作日" prop='week'>
                      <template slot-scope="scope">
                        <span>{{scope.row.weekName}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip header-align="center" align="center" label="班次时间段" prop='shiftTimes'>
                      <template slot-scope="scope">
                        <span v-html="scope.row.shiftTimes"></span>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作" width="100">
                      <template slot-scope="scope">
                        <el-button size="small" type="text" @click="setShift(scope.row)">指定班次
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="margin-top: 20px">
              <el-col :span="24">
                <el-form-item label="特殊日期：" :label-width="formLabelWidth">
                  <el-button size="small" @click="setEspecialDate(null)">新增特殊日期</el-button>
                  <el-table data-key='2' :data="especialDateList" fit size='mini' style="width: 100%">
                    <el-table-column width="100" header-align="center" align="center" label="日期" prop='date'>
                      <template slot-scope="scope">
                        <span>{{scope.row.date}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip header-align="center" align="center" label="考勤时间" prop='shiftTimes'>
                      <template slot-scope="scope">
                        <span v-html="scope.row.shiftTimes"></span>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作" width="150">
                      <template slot-scope="scope">
                        <el-button size="small" type="text" @click="setEspecialDate(scope.row, scope.$index)">编辑
                        </el-button>|
                        <el-button size="small" type="text" @click="deleteEspecialDate(scope.row, scope.$index)">删除
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-item>
              </el-col>
            </el-row>
          </section>

          <section v-show="merchantAttendanceGroupForm.attendanceType == attendanceTypeEnum.SCHEDULE">
            <el-row style="margin-top: 20px">
              <el-col :span="24">
                <el-form-item label="班次选择：" :label-width="formLabelWidth">
                  <el-button size="mini" @click="selectShiftBySchedule">选择</el-button>
                  <el-row class="tip-text" v-if="scheduleCycle.shiftList.length > 0" v-for="item in scheduleCycle.shiftList" :key="'adsf-'+item.id+new Date().getTime()" style="line-height: 25px!important;">
                    <el-col :span="3">{{item.shiftName}}：</el-col>
                    <el-col :span="21"><span v-html="renderShiftTimes(item, false)"></span></el-col>
                  </el-row>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="margin-top: 20px">
              <el-col :span="24">
                <el-form-item label="排班周期：" :label-width="formLabelWidth">
                  <el-table v-if="checkScheduleCycleData()" :data="[scheduleCycle]" size='mini'>
                    <el-table-column header-align="center" width="150" align="center" show-overflow-tooltip label="周期名称" prop='shiftName'>
                      <template slot-scope="scope">
                        <span>{{scope.row.cycleName}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column header-align="center" width="100" align="center" show-overflow-tooltip label="周期天数">
                      <template slot-scope="scope">
                        <span>{{scope.row.cycleDayCount}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column header-align="center" align="center" show-overflow-tooltip label="周期班次">
                      <template slot-scope="scope">
                        <span v-for="(item, i) in scope.row.everdayAttendanceList">{{item == 0 ? '休息' : findBy(scheduleCycle.shiftList, 'id', item).shiftName}} <span v-if="i < scope.row.everdayAttendanceList.length -1"> - </span></span>
                      </template>
                    </el-table-column>
                    <el-table-column header-align="center" width="100" align="center" show-overflow-tooltip label="开始日期">
                      <template slot-scope="scope">
                        <span>{{scope.row.cycleStartDate}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column header-align="center" width="100" align="center" show-overflow-tooltip label="操作">
                      <template slot-scope="scope">
                        <el-button type="text" @click="setScheduleCycle">设置</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-button v-else size="mini" @click="setScheduleCycle">设置</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </section>
        </el-form>

        <el-dialog
          width="30%"
          title="选择班次"
          :close-on-click-modal="false"
          :readonly="true"
          :visible.sync="shiftListConstantDialogVisible"
          append-to-body>
          <select-shift :ref='selectShiftComponentRefNameForConstant' :cur-application-code="curApplicationCode" :cur-project-code="curProjectCode" @callback="callbackSeletedShiftBySetWorkDay"></select-shift>
          <div slot="footer" class="dialog-footer">
            <el-button style="float: left" @click="submitSeletedShiftBySetWorkDay(false)">休息</el-button>
            <el-button @click="shiftListConstantDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitSeletedShiftBySetWorkDay(true)">确 定</el-button>
          </div>
        </el-dialog>

        <el-dialog
          width="30%"
          title="新增特殊日期"
          :close-on-click-modal="false"
          :visible.sync="setEspecialDateDialogVisible"
          append-to-body>
          <el-date-picker
            v-model="curCtrlEspecialDateObj.date"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
          <select-shift :ref="selectShiftComponentRefNameForConstantEspecialDate" :cur-application-code="curApplicationCode" :cur-project-code="curProjectCode" @callback="callbackSeletedShiftBySetEspecialDate"></select-shift>
          <div slot="footer" class="dialog-footer">
            <el-button style="float: left" @click="submitSeletedShiftBySetEspecialDate(false)">休息</el-button>
            <el-button @click="setEspecialDateDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitSeletedShiftBySetEspecialDate(true)">确 定</el-button>
          </div>
        </el-dialog>

        <el-dialog
          width="30%"
          title="选择班次"
          :close-on-click-modal="false"
          :readonly="true"
          :visible.sync="shiftListScheduleDialogVisible"
          append-to-body>
          <select-shift :ref='selectShiftComponentRefNameForSchedule' :cur-application-code="curApplicationCode" :cur-project-code="curProjectCode" :multiple="true" @callback="callbackSeletedShiftBySchedule"></select-shift>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancelSeletedShiftBySchedule">取 消</el-button>
            <el-button type="primary" @click="submitSeletedShiftBySchedule">确 定</el-button>
          </div>
        </el-dialog>

        <el-dialog
          width="30%"
          title="设置排班周期"
          :close-on-click-modal="false"
          :readonly="true"
          :visible.sync="setScheduleCycleDialogVisible"
          append-to-body>
          <el-form class="scheduleCycleForm">
            <section>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="周期名称：" :label-width="scheduleCycleFormLabelWidth" prop="cycleName">
                    <el-input size="small" v-model="scheduleCycle.cycleName" :maxlength="50" style="width: 178px"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="周期起始日：" :label-width="scheduleCycleFormLabelWidth" prop="cycleStartDate">
                    <el-date-picker value-format="yyyy-MM-dd" v-model="scheduleCycle.cycleStartDate" type="date" placeholder="选择日期" style="width: 178px">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="周期天数：" :label-width="scheduleCycleFormLabelWidth" prop="cycleDayCount">
                    <el-input-number size="small" v-model="scheduleCycle.cycleDayCount" controls-position="right" :min="2" :max="31" style="width: 100px"></el-input-number>
                    <span class="tip-text">最大周期天数为31天</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <section>
                <el-row v-for="(day, i) in scheduleCycle.cycleDayCount" :key="'dsdfay-' + i">
                  <el-col :span="24">
                    <el-form-item :label="'第'+day+'天：'" :label-width="scheduleCycleFormLabelWidth">
                      <el-select size="small" v-model="scheduleCycle.everdayAttendanceList[i]" placeholder="请选择">
                        <el-option label="休息" :value="0"></el-option>
                        <el-option v-for="shift in scheduleCycle.shiftList"
                          :key="'scheduleCycleShift-'+shift.id"
                          :label="shift.shiftName"
                          :value="shift.id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </section>
            </section>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancelScheduleCycle">取 消</el-button>
            <el-button type="primary" @click="submitScheduleCycle">确 定</el-button>
          </div>
        </el-dialog>


        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDialog">取 消</el-button>
          <el-button v-if="dialogStatus=='create'" type="primary" @click="addSubmit">确 定</el-button>
          <el-button v-else type="primary" @click="updateSubmit">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 编辑排班模态框-->
      <el-dialog
        width="90%"
        title="编辑排班"
        :close-on-click-modal="false"
        :readonly="true"
        :visible.sync="editEmployeeScheduleDialogVisible">
        <section>
          <el-row :gutter="24">
            <el-col :span="3">
              <el-date-picker v-model="employeeScheduleFilterForm.date" @change="getAttendanceGroupEmployeeScheduleList" type="month" :clearable="false" :editable="false"></el-date-picker>
            </el-col>
            <el-col :span="21">
              <el-row>
                <el-col :span="2">
                  班次说明：
                </el-col>
                <el-col :span="22">
                  <el-tag v-for="(item, i) in scheduleCycle.shiftList" :key="i" style="margin-right: 15px;">
                    <span v-html="renderShiftTimes(item, true)"></span>
                  </el-tag>
                </el-col>
              </el-row>
              <el-row style="margin-top: 10px">
                <el-col :span="2">
                  排班周期：
                </el-col>
                <el-col :span="22">
                  <el-tag>
                    <span v-html="renderAttendanceGroupTimes2(findBy(list, 'id', curCtrlAttendanceGroupId))"></span>
                  </el-tag>
                  <el-button size="mini" @click="fromEditEmployeeScheduleDialogToSetScheduleCycleDialog" style="margin-left: 10px">设置</el-button>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </section>
        <section style="margin-top: 20px">
          <el-row>
            <el-col :span="24">
              <table style="width: 100%" class="border-table">
                <thead>
                  <tr>
                    <th class="name-colmn-width">
                      姓名
                    </th>
                    <th v-for="(item, i) in daysForMonth">
                      <span :class="{colorRed: (item.week === '六' || item.week === '日')}">{{item.day}}<br>{{item.week}}</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="employeeScheduleList.length == 0"><td :colspan="daysForMonth.length + 1" class="disabled-text">暂无数据</td></tr>
                  <tr v-for="(employeeSchedule, employeeScheduleIndex) in employeeScheduleList">
                    <td style="max-width: 45px;word-break: break-all;">
                      <span v-if="employeeList.length > 0">{{findBy(employeeList, 'employeeId', employeeSchedule.employeeId).employeeName}}</span>
                    </td>
                    <td v-for="(daySchedule, i) in JSON.parse(employeeSchedule.everdaySchedule)"
                        :class="checkDisabledShedule(i + 1, daySchedule) ? 'disabled-color cursor-disabled' : 'cursor-pointer'">
                      <span v-if="checkDisabledShedule(i + 1, daySchedule)">
                        <span v-if="daySchedule && shiftList.length > 0">{{findBy(shiftList, 'id', daySchedule).shiftName}}</span>
                        <span v-else-if="daySchedule === 0">休息</span>
                      </span>
                      <el-dropdown  v-else trigger="click" @command="handleChangeEmployeeSchedule">
                        <span class="el-dropdown-link">
                          {{daySchedule && shiftList.length > 0 ? findBy(shiftList, 'id', daySchedule).shiftName : '休息'}}&nbsp;<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item v-for="(shift, j) in scheduleCycle.shiftList" :key="j" :disabled="shift.id == daySchedule"
                                            :command="{ employeeScheduleId: employeeSchedule.id, employeeId: employeeSchedule.employeeId, day: i+1, shiftId: shift.id, employeeScheduleIndex: employeeScheduleIndex }">{{shift.shiftName}}</el-dropdown-item>
                          <el-dropdown-item :command="{ employeeScheduleId: employeeSchedule.id, employeeId: employeeSchedule.employeeId, day: i+1, shiftId: 0, employeeScheduleIndex: employeeScheduleIndex }">休息</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </td>
                  </tr>
                </tbody>
              </table>
            </el-col>
          </el-row>
          <!-- 分页工具栏-->
          <el-row>
            <el-col :span="24" style="text-align: right">
              <el-pagination v-show="!listLoading" @current-change="currentPageChangeByEmployeeSchedule" :current-page.sync="employeeScheduleFilterForm.current"
                             :page-size="employeeScheduleFilterForm.pageSize"
                             layout="total, prev, next"
                             :total="employeeScheduleTotal">
              </el-pagination>
            </el-col>
          </el-row>
        </section>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import { getMerchantAttendanceGroupList, addMerchantAttendanceGroup, editMerchantAttendanceGroup, delMerchantAttendanceGroup, getWorkDayConfig,
    getEspecialDateConfigList, searchForUnscheduledEmployees, getAttendanceEmployeeList, getScheduleCycleConfig, getAttendanceGroupEmployeeScheduleList, changeEmployeeSchedule } from '@/api/merchant/work/merchantAttendanceGroup'
  import { globalConfig } from '@/globalConfig'
  import util from '@/utils/util.js'
  import waves from '@/directive/waves/index.js'
  import { getApplicationCode, getCurProjectCode } from '@/api/common'
  import SelectShift from '@/components/select-shift/index'

  export default {
    name: 'tableMerchantAttendanceGroup',
    directives: {
      waves
    },
    components: {
      'select-shift': SelectShift
    },
    data() {
      return {
        curDate: new Date(),
        curApplicationCode: getApplicationCode(this),
        curProjectCode: getCurProjectCode(),
        // 工作日列表，shiftId 为 null 为未设置，0 为休息
        workDayList: [
          { weekCName: 'monday', weekName: '周一', shiftTimes: '', shiftId: null },
          { weekCName: 'tuesday', weekName: '周二', shiftTimes: '', shiftId: null },
          { weekCName: 'wednesday', weekName: '周三', shiftTimes: '', shiftId: null },
          { weekCName: 'thursday', weekName: '周四', shiftTimes: '', shiftId: null },
          { weekCName: 'friday', weekName: '周五', shiftTimes: '', shiftId: null },
          { weekCName: 'saturday', weekName: '周六', shiftTimes: '', shiftId: null },
          { weekCName: 'sunday', weekName: '周日', shiftTimes: '', shiftId: null }
        ],
        workDayNames: [
          'monday',
          'tuesday',
          'wednesday',
          'thursday',
          'friday',
          'saturday',
          'sunday'
        ],
        list: [],
        total: 0,
        listLoading: true,
        downloadLoading: false,
        isBatch: true,
        isBatchWorkDay: true,
        searchEmployeeIdLoading: false,
        shiftListConstantDialogVisible: false,
        shiftListScheduleDialogVisible: false,
        setEspecialDateDialogVisible: false,
        editEmployeeScheduleDialogVisible: false,
        selectShiftComponentRefNameForConstant: 'selectShiftForConstant',
        selectShiftComponentRefNameForConstantEspecialDate: 'selectShiftForConstantEspecialDate',
        selectShiftComponentRefNameForSchedule: 'selectShiftForSchedule',
        pageSize: globalConfig.pageSize,
        filterFormLabelWidth: '100px',
        filterFormLabelWidth2: '12px',
        filterForm: {
          searchWord: '',
          current: globalConfig.startPage,
          pageSize: globalConfig.initPageSize
        },
        employeeScheduleFilterForm: {
          date: new Date(),
          current: globalConfig.startPage,
          pageSize: 5
        },
        dialogStatus: '',
        tableKey: 0,
        dialogFormVisible: false,
        dialogEditFormVisible: false,
        formLabelWidth: '120px',
        merchantAttendanceGroupForm: {
          id: '',
          merchantId: '',
          projectCode: '',
          attendanceGroupName: '',
          attendanceType: 1
        },
        textMap: {
          update: '编辑',
          create: '创建'
        },
        attendanceTypeEnum: {
          CONSTANT: 1, // 固定班
          SCHEDULE: 2 // 排班制
        },
        attendanceTypeMap: {
          1: '固定班',
          2: '排班制'
        },
        employeeList: [],
        employeeIdList: [],
        shiftList: [],
        curActionWeeks: [],
        timeTypeEnum: {
          COMMONLY: 0, // 通用
          DST: 1, // 夏令时
          WT: 2 // 冬令时
        },
        curSeletedShiftBySetWorkDay: null,
        curSeletedShiftBySetEspecialDate: null,
        especialDateList: [],
        // 当前操作的特殊日期对象
        curCtrlEspecialDateObj: {
          date: '',
          index: -1,
          shift: null
        },
        setScheduleCycleDialogVisible: false,
        // 排班周期信息
        scheduleCycle: {
          cycleName: '',
          cycleDayCount: 2,
          cycleStartDate: new Date(),
          everdayAttendance: '',
          everdayAttendanceList: [],
          shiftList: []
        },
        scheduleCycleFormLabelWidth: '100px',
        employeeScheduleList: [],
        employeeScheduleTotal: 0,
        curCtrlAttendanceGroupId: 0,
        daysForMonth: []
      }
    },
    computed: {
      minimenu2ndStatus() {
        return this.$store.state.app.minimenu2ndStatus
      }
    },
    created() {
      this.getMerchantAttendanceGroupList()
    },
    methods: {
      checkDisabledShedule(day, shiftId) {
        // 当天及之前的日子 || shiftId 为 null 未排班的不可调班
        return (day <= this.curDate.getDate()) || (!shiftId && shiftId !== 0)
      },
      // 通知子组件那边默认选择哪些
      informSelectShiftComponentSetDefaultSelected(componentName, val) {
        this.$refs[componentName].$emit('setDefaultSelected', val)
      },
      formatDate(date, format) {
        return util.formatDate(date, format)
      },
      findBy(array, attrName, attrVal) {
        for (let i = 0; i < array.length; i++) {
          if (array[i][attrName] === attrVal) {
            return array[i]
          }
        }

        return null
      },
      renderAttendanceGroupTimes(attendanceGroup) {
        const attendanceType = attendanceGroup.attendanceType
        if (attendanceType === this.attendanceTypeEnum.CONSTANT) {
          const workDayConfig = attendanceGroup.workDayConfig
          const especialDateConfigList = attendanceGroup.especialDateConfigList
          const obj = { 0: { name: '休息', weeks: [] }}
          for (const i in this.workDayNames) {
            const name = this.workDayNames[i]
            const shiftId = workDayConfig[name]
            if (obj[shiftId] === undefined) {
              obj[shiftId] = { name: shiftId === 0 ? '休息' : this.renderShiftTimes(workDayConfig[name + 'Shift'], true), weeks: [] }
            }
            obj[shiftId].weeks.push(this.findBy(this.workDayList, 'weekCName', name).weekName)
          }
          const arr = []
          for (const p in obj) {
            arr.push(obj[p].weeks.join('，'))
            arr.push('：')
            arr.push(obj[p].name)
            arr.push('<br>')
          }

          if (especialDateConfigList && especialDateConfigList.length > 0) {
            arr.push('特殊日期：<br>')
            for (const i in especialDateConfigList) {
              const especialDate = especialDateConfigList[i]
              arr.push(this.formatDate(new Date(especialDate.especialDate), 'yyyy-MM-dd'))
              arr.push('&nbsp;&nbsp;&nbsp;&nbsp;')
              arr.push(especialDate.shiftId === 0 ? '休息' : this.renderShiftTimes(especialDate.shift, true))
              arr.push('<br>')
            }
          }

          return arr.join('')
        } else {
          const scheduleCycleConfig = attendanceGroup.scheduleCycleConfig
          const everdayAttendance = JSON.parse(scheduleCycleConfig.everdayAttendance)
          const arr = []
          for (let i = 0; i < everdayAttendance.length; i++) {
            arr.push(`第${i + 1}天：`)
            arr.push(everdayAttendance[i] === 0 ? '休息' : this.renderShiftTimes(this.findBy(scheduleCycleConfig.shiftList, 'id', everdayAttendance[i]), true))
            arr.push('<br>')
          }
          return arr.join('')
        }
      },
      renderAttendanceGroupTimes2(attendanceGroup) {
        if (attendanceGroup) {
          const scheduleCycleConfig = attendanceGroup.scheduleCycleConfig
          const everdayAttendance = JSON.parse(scheduleCycleConfig.everdayAttendance)
          const arr = []
          for (let i = 0; i < everdayAttendance.length; i++) {
            arr.push(everdayAttendance[i] === 0 ? '休息' : this.findBy(scheduleCycleConfig.shiftList, 'id', everdayAttendance[i]).shiftName)
            arr.push(i < everdayAttendance.length - 1 ? ' -- ' : '')
          }
          return arr.join('')
        }
      },
      renderShiftTimes(row, shiftNameVisible) {
        const merchantShiftTimeList = row.merchantShiftTimeList
        const shiftTimeData = {
          commonlyTimeList: [],
          dstTimeList: [],
          wtTimeList: []
        }
        shiftTimeData.commonlyTimeList = merchantShiftTimeList.filter((item) => {
          return item.timeType === this.timeTypeEnum.COMMONLY
        })

        shiftTimeData.dstTimeList = merchantShiftTimeList.filter((item) => {
          return item.timeType === this.timeTypeEnum.DST
        })

        shiftTimeData.wtTimeList = merchantShiftTimeList.filter((item) => {
          return item.timeType === this.timeTypeEnum.WT
        })

        const htmlStrArray = []
        if (shiftNameVisible) {
          htmlStrArray.push(`${row.shiftName}：`)
        }
        let i = 0
        if (shiftTimeData.commonlyTimeList.length > 0) {
          shiftTimeData.commonlyTimeList.map(time => {
            htmlStrArray.push(`${time.inWorkTime.substr(0, 5)} - ${time.offWorkTime.substr(0, 5)}`)
            if (i < shiftTimeData.commonlyTimeList.length - 1) {
              htmlStrArray.push('&nbsp;&nbsp;')
            }
            i += 1
          })
        } else {
          htmlStrArray.push('夏令时')
          shiftTimeData.dstTimeList.map(time => {
            htmlStrArray.push(`${time.inWorkTime.substr(0, 5)} - ${time.offWorkTime.substr(0, 5)}`)
            if (i < shiftTimeData.dstTimeList.length - 1) {
              htmlStrArray.push('&nbsp;&nbsp;')
            }
            i += 1
          })
          htmlStrArray.push('&nbsp;&nbsp;&nbsp;&nbsp;')
          htmlStrArray.push('冬令时')
          i = 0
          shiftTimeData.wtTimeList.map(time => {
            htmlStrArray.push(`${time.inWorkTime.substr(0, 5)} - ${time.offWorkTime.substr(0, 5)}`)
            if (i < shiftTimeData.wtTimeList.length - 1) {
              htmlStrArray.push('&nbsp;&nbsp;')
            }
            i += 1
          })
        }

        return htmlStrArray.join('')
      },
      searchEmployee(keyword) {
        if (keyword) {
          this.searchEmployeeIdLoading = true
          searchForUnscheduledEmployees({ projectCode: this.curProjectCode, keyword: keyword, curApplicationCode: this.curApplicationCode }).then(response => {
            if (response.data.error_no === 0) {
              for (let i = 0; i < response.data.result.length; i++) {
                this.employeeList.push(response.data.result[i])
              }
            } else {
              this.$message(response.data.error_info)
            }
            this.searchEmployeeIdLoading = false
          })
        } else {
          this.employeeList = []
        }
      },
      getMerchantAttendanceGroupList() {
        this.listLoading = true
        this.filterForm.curApplicationCode = this.curApplicationCode
        this.filterForm.curProjectCode = this.curProjectCode
        getMerchantAttendanceGroupList(this.filterForm).then(response => {
          if (response.data.error_no === 0) {
            this.list = response.data.result.records
            this.total = response.data.result.total
          } else {
            this.$message(response.data.error_info)
          }
          this.listLoading = false
        })
      },
      getWorkDayConfig(attendanceGroupId, cb) {
        const param = {
          curApplicationCode: this.curApplicationCode,
          curProjectCode: this.curProjectCode,
          attendanceGroupId: attendanceGroupId
        }
        getWorkDayConfig(param).then(response => {
          if (response.data.error_no === 0) {
            const obj = response.data.result
            cb(obj)
          } else {
            this.$message(response.data.error_info)
          }
        })
      },
      getScheduleCycleConfig(attendanceGroupId, cb) {
        const param = {
          curApplicationCode: this.curApplicationCode,
          curProjectCode: this.curProjectCode,
          attendanceGroupId: attendanceGroupId
        }
        getScheduleCycleConfig(param).then(response => {
          if (response.data.error_no === 0) {
            const obj = response.data.result
            cb(obj)
          } else {
            this.$message(response.data.error_info)
          }
        })
      },
      getEspecialDateConfigList(attendanceGroupId, cb) {
        const param = {
          curApplicationCode: this.curApplicationCode,
          curProjectCode: this.curProjectCode,
          attendanceGroupId: attendanceGroupId
        }
        getEspecialDateConfigList(param).then(response => {
          if (response.data.error_no === 0) {
            const obj = response.data.result
            cb(obj)
          } else {
            this.$message(response.data.error_info)
          }
        })
      },
      getAttendanceEmployeeList(attendanceGroupId, cb) {
        const param = {
          curApplicationCode: this.curApplicationCode,
          curProjectCode: this.curProjectCode,
          attendanceGroupId: attendanceGroupId
        }
        getAttendanceEmployeeList(param).then(response => {
          if (response.data.error_no === 0) {
            const list = response.data.result
            cb(list)
          } else {
            this.$message(response.data.error_info)
          }
        })
      },
      searchMerchantAttendanceGroup() {
        this.filterForm.curProjectCode = this.curProjectCode
        this.filterForm.current = globalConfig.startPage
        this.getMerchantAttendanceGroupList()
      },
      addMerchantAttendanceGroup() {
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      modifyMerchantAttendanceGroup(row) {
        const temp = Object.assign({}, row)
        for (const p in this.merchantAttendanceGroupForm) {
          this.merchantAttendanceGroupForm[p] = temp[p]
        }

        this.employeeIdList = []
        this.getAttendanceEmployeeList(row.id, (list) => {
          this.employeeList = list
          list.map(item => {
            this.employeeIdList.push(item.employeeId)
          })
        })

        if (temp.attendanceType === this.attendanceTypeEnum.CONSTANT) {
          this.getWorkDayConfig(row.id, (workDayConfig) => {
            this.workDayList.map(item => {
              item.shiftId = workDayConfig[item.weekCName]
              if (item.shiftId) {
                item.shiftTimes = this.renderShiftTimes(workDayConfig[item.weekCName + 'Shift'], true)
              } else {
                item.shiftTimes = '休息'
              }
            })
          })

          this.especialDateList = []
          this.getEspecialDateConfigList(row.id, (especialDateConfigList) => {
            especialDateConfigList.map((item) => {
              this.especialDateList.push({ id: item.id, date: this.formatDate(new Date(item.especialDate), 'yyyy-MM-dd'), shift: item.shift, shiftTimes: item.shift ? this.renderShiftTimes(item.shift, true) : '休息' })
            })
          })
        } else {
          this.getScheduleCycleConfig(row.id, (scheduleCycleConfig) => {
            this.scheduleCycle = {
              id: scheduleCycleConfig.id,
              cycleName: scheduleCycleConfig.cycleName,
              cycleDayCount: scheduleCycleConfig.cycleDayCount,
              cycleStartDate: this.formatDate(new Date(scheduleCycleConfig.cycleStartDate), 'yyyy-MM-dd'),
              everdayAttendance: scheduleCycleConfig.everdayAttendance,
              everdayAttendanceList: JSON.parse(scheduleCycleConfig.everdayAttendance),
              shiftList: scheduleCycleConfig.shiftList
            }
          })
        }
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },
      deleteMerchantAttendanceGroup(row) {
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
          delMerchantAttendanceGroup(param).then(response => {
            if (response.data.error_no === 0) {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
              this.searchMerchantAttendanceGroup()
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
        this.getMerchantAttendanceGroupList()
      },
      currentPageChange(val) {
        this.filterForm.current = val
        this.getMerchantAttendanceGroupList()
      },
      restWorkDaySelection() {
        const selection = this.$refs.multipleWorkDayTable.selection
        this.$refs.multipleWorkDayTable.clearSelection(selection)
        this.isBatchWorkDay = true
      },
      setBatchRest() {
        const selection = this.$refs.multipleWorkDayTable.selection
        for (let i = 0; i < selection.length; i++) {
          selection[i].shiftId = 0
          selection[i].shiftTimes = '休息'
        }

        this.restWorkDaySelection()
      },
      setBatchShift() {
        const selection = this.$refs.multipleWorkDayTable.selection
        this.curActionWeeks = []
        for (let i = 0; i < selection.length; i++) {
          this.curActionWeeks.push(selection[i])
        }

        this.shiftListConstantDialogVisible = true

        if (this.$refs[this.selectShiftComponentRefNameForConstant]) {
          this.informSelectShiftComponentSetDefaultSelected(this.selectShiftComponentRefNameForConstant, this.curActionWeeks[0].shiftId)
        } else {
          window.setTimeout(() => {
            this.informSelectShiftComponentSetDefaultSelected(this.selectShiftComponentRefNameForConstant, this.curActionWeeks[0].shiftId)
          }, 500)
        }
      },
      setShift(row) {
        this.curActionWeeks = [row]
        this.shiftListConstantDialogVisible = true
        if (this.$refs[this.selectShiftComponentRefNameForConstant]) {
          this.informSelectShiftComponentSetDefaultSelected(this.selectShiftComponentRefNameForConstant, row.shiftId)
        } else {
          window.setTimeout(() => {
            this.informSelectShiftComponentSetDefaultSelected(this.selectShiftComponentRefNameForConstant, row.shiftId)
          }, 500)
        }
      },
      checkConstantData() {
        let workDay
        for (let i = 0; i < this.workDayList.length; i++) {
          workDay = this.workDayList[i]
          if (workDay.shiftId === null && !workDay.shiftTimes) {
            this.$message.error('请完善工作日设置。')
            return false
          }
        }

        const dateArray = []
        let especialDate
        for (let i = 0; i < this.especialDateList.length; i++) {
          especialDate = this.especialDateList[i]
          if (dateArray.indexOf(especialDate.date) !== -1) {
            this.$message.error('特殊日期不能存在重复。')
            return false
          } else {
            dateArray.push(especialDate.date)
          }
        }
        return true
      },
      checkData() {
        const name = this.merchantAttendanceGroupForm.attendanceGroupName.trim()
        if (!name) {
          this.$message.error('请输入考勤组名称。')
          return false
        }

        if (this.employeeIdList.length === 0) {
          this.$message.error('请选择考勤人员。')
          return false
        }
        const attendanceType = this.merchantAttendanceGroupForm.attendanceType
        if (!attendanceType) {
          this.$message.error('请选择考勤类型。')
          return false
        }
        if (attendanceType === this.attendanceTypeEnum.CONSTANT) {
          return this.checkConstantData()
        } else {
          return this.checkScheduleCycleData(true)
        }
      },
      initSubmitSomeData() {
        this.merchantAttendanceGroupForm.curApplicationCode = this.curApplicationCode
        this.merchantAttendanceGroupForm.curProjectCode = this.curProjectCode
        // 考勤人员
        this.merchantAttendanceGroupForm.employeeIdListJson = JSON.stringify(this.employeeIdList)

        if (this.merchantAttendanceGroupForm.attendanceType === this.attendanceTypeEnum.CONSTANT) {
          // 固定班
          const workDayObj = {
            monday: 0,
            tuesday: 0,
            wednesday: 0,
            thursday: 0,
            friday: 0,
            saturday: 0,
            sunday: 0
          }
          let week
          for (const p in workDayObj) {
            week = this.findBy(this.workDayList, 'weekCName', p)
            workDayObj[p] = week.shiftId
          }
          this.merchantAttendanceGroupForm.workDayJson = JSON.stringify(workDayObj)
          if (this.especialDateList.length > 0) {
            const tempArray = []
            this.especialDateList.map((item) => {
              tempArray.push({ especialDate: item.date, shiftId: item.shift ? item.shift.id : 0 })
            })

            this.merchantAttendanceGroupForm.especialDateListJson = JSON.stringify(tempArray)
          }
        } else {
          // 排班制
          const temp = Object.assign({}, this.scheduleCycle)
          temp.everdayAttendance = temp.everdayAttendanceList
          delete temp.everdayAttendanceList
          delete temp.shiftList
          this.merchantAttendanceGroupForm.scheduleCycleJson = JSON.stringify(temp)
        }
      },
      addSubmit() {
        if (this.checkData()) {
          this.listLoading = true
          this.initSubmitSomeData()
          addMerchantAttendanceGroup(this.merchantAttendanceGroupForm).then(response => {
            if (response.data.error_no === 0) {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: response.data.error_info,
                type: 'success',
                duration: 2000
              })
              this.closeDialog()
              this.searchMerchantAttendanceGroup()
            } else {
              this.$message(response.data.error_info)
            }
            this.listLoading = false
          })
        }
      },
      updateSubmit() {
        if (this.checkData()) {
          this.listLoading = true
          this.initSubmitSomeData()
          editMerchantAttendanceGroup(this.merchantAttendanceGroupForm).then(response => {
            if (response.data.error_no === 0) {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: response.data.error_info,
                type: 'success',
                duration: 2000
              })
              this.closeDialog()
              this.searchMerchantAttendanceGroup()
            } else {
              this.$message(response.data.error_info)
            }
            this.listLoading = false
          })
        }
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
      selectWorkDayCheckBox(selection, row) {
        if (selection.length === 0) {
          this.isBatchWorkDay = true
        } else {
          this.isBatchWorkDay = false
        }
      },
      selectAllWorkDayCheckBox(selection) {
        if (selection.length === 0) {
          this.isBatchWorkDay = true
        } else {
          this.isBatchWorkDay = false
        }
      },
      resetForm() {
        this.merchantAttendanceGroupForm = {
          id: '',
          merchantId: '',
          projectCode: '',
          attendanceGroupName: '',
          attendanceType: this.attendanceTypeEnum.CONSTANT
        }

        this.employeeIdList = []
        this.curActionWeeks = []
        this.curSeletedShiftBySetWorkDay = null
        this.curSeletedShiftBySetEspecialDate = null
        this.especialDateList = []
        this.curCtrlEspecialDateObj.date = ''
        this.curCtrlEspecialDateObj.index = -1
        this.curCtrlEspecialDateObj.shift = null

        this.workDayList = [
          { weekCName: 'monday', weekName: '周一', shiftTimes: '', shiftId: null },
          { weekCName: 'tuesday', weekName: '周二', shiftTimes: '', shiftId: null },
          { weekCName: 'wednesday', weekName: '周三', shiftTimes: '', shiftId: null },
          { weekCName: 'thursday', weekName: '周四', shiftTimes: '', shiftId: null },
          { weekCName: 'friday', weekName: '周五', shiftTimes: '', shiftId: null },
          { weekCName: 'saturday', weekName: '周六', shiftTimes: '', shiftId: null },
          { weekCName: 'sunday', weekName: '周日', shiftTimes: '', shiftId: null }
        ]

        if (this.$refs['merchantAttendanceGroupForm'] !== undefined) {
          this.$refs['merchantAttendanceGroupForm'].resetFields()
        }
      },
      handleDownload() {
        this.downloadLoading = true
        require.ensure([], () => {
          const { export_json_to_excel } = require('vendor/Export2Excel')
          const tHeader = [
            '主键ID',
            '商户id',
            '项目内码',
            '考勤组名称',
            '考勤类型',
            '创建人',
            '创建时间',
            '修改人',
            '修改时间'
          ]
          const filterVal = [
            'id',
            'merchantId',
            'projectCode',
            'attendanceGroupName',
            'attendanceType',
            'createBy',
            'createDate',
            'updateBy',
            'updateDate'
          ]
          const list = this.list
          const data = this.formatJson(filterVal, list)
          export_json_to_excel(tHeader, data, '考勤组主表')
          this.downloadLoading = false
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      closeDialog() {
        this.dialogFormVisible = false
        this.resetForm()
      },
      callbackSeletedShiftBySetWorkDay(shiftObj) {
        this.curSeletedShiftBySetWorkDay = shiftObj
      },
      submitSeletedShiftBySetWorkDay(isWork) {
        if (isWork) {
          if (this.curSeletedShiftBySetWorkDay) {
            this.curActionWeeks.map(week => {
              week.shiftId = this.curSeletedShiftBySetWorkDay.id
              week.shiftTimes = this.renderShiftTimes(this.curSeletedShiftBySetWorkDay, true)
            })
            this.restWorkDaySelection()
            this.shiftListConstantDialogVisible = false
          } else {
            this.$message.error('请选择一个班次')
          }
        } else {
          this.curActionWeeks.map(week => {
            week.shiftId = null
            week.shiftTimes = '休息'
          })
          this.restWorkDaySelection()
          this.shiftListConstantDialogVisible = false
        }
      },
      // 设置特殊日期
      setEspecialDate(row, index) {
        this.curCtrlEspecialDateObj.date = row ? row.date : ''
        this.curCtrlEspecialDateObj.index = row ? index : -1
        this.curCtrlEspecialDateObj.shift = row ? row.shift : null
        this.setEspecialDateDialogVisible = true
        if (row) {
          if (this.$refs[this.selectShiftComponentRefNameForConstantEspecialDate]) {
            this.informSelectShiftComponentSetDefaultSelected(this.selectShiftComponentRefNameForConstantEspecialDate, row.shift ? row.shift.id : 0)
          } else {
            window.setTimeout(() => {
              this.informSelectShiftComponentSetDefaultSelected(this.selectShiftComponentRefNameForConstantEspecialDate, row.shift ? row.shift.id : 0)
            }, 500)
          }
        }
      },
      callbackSeletedShiftBySetEspecialDate(shiftObj) {
        this.curCtrlEspecialDateObj.shift = shiftObj
      },
      submitSeletedShiftBySetEspecialDate(isWork) {
        const date = this.curCtrlEspecialDateObj.date
        if (!date) {
          this.$message.error('请选择一个日期')
          return
        }

        const shift = this.curCtrlEspecialDateObj.shift
        if (isWork && shift == null) {
          this.$message.error('请选择一个班次')
          return
        }

        const exitsDate = this.findBy(this.especialDateList, 'date', date)
        const index = this.curCtrlEspecialDateObj.index
        if (index !== -1) {
          // 编辑
          const obj = this.especialDateList[index]
          if (exitsDate && exitsDate.date !== obj.date) {
            this.$message.error('日期已重复')
            return
          }
          obj.date = date
          obj.shift = isWork ? shift : null
          obj.shiftTimes = isWork ? this.renderShiftTimes(shift, true) : '休息'
          this.especialDateList.splice(index, 1, obj)
        } else {
          if (exitsDate) {
            this.$message.error('日期已重复')
            return
          }
          this.especialDateList.push({ date: date, shift: isWork ? shift : null, shiftTimes: isWork ? this.renderShiftTimes(shift, true) : '休息' })
        }
        this.setEspecialDateDialogVisible = false
      },
      deleteEspecialDate(row, index) {
        if (row.id) {
          this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.especialDateList.splice(index, 1)
          })
        } else {
          this.especialDateList.splice(index, 1)
        }
      },
      selectShiftBySchedule() {
        this.shiftListScheduleDialogVisible = true
        if (this.$refs[this.selectShiftComponentRefNameForSchedule]) {
          this.informSelectShiftComponentSetDefaultSelected(this.selectShiftComponentRefNameForSchedule, this.scheduleCycle.everdayAttendanceList)
        } else {
          window.setTimeout(() => {
            this.informSelectShiftComponentSetDefaultSelected(this.selectShiftComponentRefNameForSchedule, this.scheduleCycle.everdayAttendanceList)
          }, 500)
        }
      },
      callbackSeletedShiftBySchedule(shiftObjList) {
        this.scheduleCycle.shiftList = shiftObjList
      },
      cancelSeletedShiftBySchedule() {
        this.shiftListScheduleDialogVisible = false
      },
      submitSeletedShiftBySchedule() {
        this.shiftListScheduleDialogVisible = false
      },
      setScheduleCycle() {
        this.setScheduleCycleDialogVisible = true
      },
      checkScheduleCycleData(isShowMessage) {
        if (this.scheduleCycle.shiftList.length === 0) {
          if (isShowMessage) {
            this.$message.error('请选择班次。')
          }
          return false
        }

        const cycleName = this.scheduleCycle.cycleName.trim()
        if (!cycleName) {
          if (isShowMessage) {
            this.$message.error('请输入周期名称。')
          }
          return false
        }

        if (!this.scheduleCycle.cycleStartDate) {
          if (isShowMessage) {
            this.$message.error('请设定周期起始日期')
          }
          return false
        }

        if (this.scheduleCycle.cycleDayCount < 2 || this.scheduleCycle.cycleDayCount > 31) {
          if (isShowMessage) {
            this.$message.error('周期天数最小为2最大为31。')
          }
          return false
        }

        if (this.scheduleCycle.everdayAttendanceList.length < this.scheduleCycle.cycleDayCount) {
          if (isShowMessage) {
            this.$message.error('请选择每天的班次。')
          }
          return false
        }
        return true
      },
      cancelScheduleCycle() {
        this.setScheduleCycleDialogVisible = false
      },
      submitScheduleCycle() {
        if (this.checkScheduleCycleData(true)) {
          this.setScheduleCycleDialogVisible = false
        }
      },
      editEmployeeSchedule(row) {
        this.curCtrlAttendanceGroupId = row.id

        this.getScheduleCycleConfig(this.curCtrlAttendanceGroupId, (scheduleCycleConfig) => {
          this.scheduleCycle = {
            id: scheduleCycleConfig.id,
            cycleName: scheduleCycleConfig.cycleName,
            cycleDayCount: scheduleCycleConfig.cycleDayCount,
            cycleStartDate: this.formatDate(new Date(scheduleCycleConfig.cycleStartDate), 'yyyy-MM-dd'),
            everdayAttendance: scheduleCycleConfig.everdayAttendance,
            everdayAttendanceList: JSON.parse(scheduleCycleConfig.everdayAttendance),
            shiftList: scheduleCycleConfig.shiftList
          }
        })

        this.employeeIdList = []
        this.getAttendanceEmployeeList(row.id, (list) => {
          this.employeeList = list
        })

        if (row.attendanceType === this.attendanceTypeEnum.SCHEDULE) {
          this.getScheduleCycleConfig(row.id, (scheduleCycleConfig) => {
            this.shiftList = scheduleCycleConfig.shiftList
          })
        }
        this.getAttendanceGroupEmployeeScheduleList()
        this.editEmployeeScheduleDialogVisible = true
      },
      initDaysForMonth() {
        this.daysForMonth = []
        const date = new Date(this.employeeScheduleFilterForm.date.getFullYear(), this.employeeScheduleFilterForm.date.getMonth() + 1, 0)
        const dayCount = date.getDate()
        let temp
        for (let i = 1; i <= dayCount; i++) {
          temp = new Date(date.getFullYear(), date.getMonth() + 1, i)
          this.daysForMonth.push({ day: i, week: '日一二三四五六'.charAt(temp.getDay()) })
        }
      },
      getAttendanceGroupEmployeeScheduleList() {
        this.listLoading = true
        this.employeeScheduleFilterForm.curApplicationCode = this.curApplicationCode
        this.employeeScheduleFilterForm.curProjectCode = this.curProjectCode
        this.employeeScheduleFilterForm.attendanceGroupId = this.curCtrlAttendanceGroupId
        this.employeeScheduleFilterForm.year = this.employeeScheduleFilterForm.date.getFullYear()
        this.employeeScheduleFilterForm.month = this.employeeScheduleFilterForm.date.getMonth() + 1
        this.initDaysForMonth()
        getAttendanceGroupEmployeeScheduleList(this.employeeScheduleFilterForm).then(response => {
          if (response.data.error_no === 0) {
            this.employeeScheduleList = response.data.result.records
            this.employeeScheduleTotal = response.data.result.total
          } else {
            this.$message(response.data.error_info)
          }
          this.listLoading = false
        })
      },
      currentPageChangeByEmployeeSchedule(val) {
        this.employeeScheduleFilterForm.current = val
        this.getAttendanceGroupEmployeeScheduleList()
      },
      fromEditEmployeeScheduleDialogToSetScheduleCycleDialog() {
        const attendanceGroup = this.findBy(this.list, 'id', this.curCtrlAttendanceGroupId)
        this.editEmployeeScheduleDialogVisible = false
        this.modifyMerchantAttendanceGroup(attendanceGroup)
      },
      handleChangeEmployeeSchedule(obj) {
        this.$confirm('您确定要修改该班次吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const param = {
            employeeScheduleId: obj.employeeScheduleId,
            employeeId: obj.employeeId,
            attendanceGroupId: this.curCtrlAttendanceGroupId,
            year: this.employeeScheduleFilterForm.date.getFullYear(),
            month: this.employeeScheduleFilterForm.date.getMonth() + 1,
            day: obj.day,
            shiftId: obj.shiftId,
            curApplicationCode: this.curApplicationCode,
            curProjectCode: this.curProjectCode
          }
          changeEmployeeSchedule(param).then(response => {
            if (response.data.error_no === 0) {
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })

              // 刷新数据
              const everdaySchedule = JSON.parse(this.employeeScheduleList[obj.employeeScheduleIndex].everdaySchedule)
              everdaySchedule[obj.day - 1] = obj.shiftId
              this.employeeScheduleList[obj.employeeScheduleIndex].everdaySchedule = JSON.stringify(everdaySchedule)
            } else {
              this.$message(response.data.error_info)
            }
          })
        }).catch(() => {})
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .border-table {
    border-collapse: collapse;
    border: none;

    .name-colmn-width {
      width: 80px;
    }

    th, td {
      border: solid #999999 1px;
      text-align: center;
    }
  }


  .colorRed {
    color: red;
  }
  .disabled-text {
    color: #999999!important;
  }
  .disabled-color {
    background-color: #f8fafc !important;
  }

  .cursor-pointer {
    cursor: pointer;
  }

  .cursor-disabled {
    cursor: not-allowed
  }

  .el-date-editor.el-input {
    width: 100%;
    min-width: inherit;
  }

  .scheduleCycleForm, .merchantAttendanceGroupForm {
    .margin-bottom-0 {
      margin-bottom: 0;
    }

    .el-form-item {
      margin-bottom: 0px;
    }

    .tip-text {
      font-size: 80%;
      color: #999999;
      margin-left: 15px;
    }

    .el-select {
      display: inline-block;
    }


  }

  .scheduleCycleForm {
    max-height: 450px;
    overflow: auto;
  }

  .merchantAttendanceGroupForm {
    max-height: 550px;
    overflow: auto;

    .el-table {
      margin: 0 auto!important;
     /* margin: 20px auto 0 auto!important;*/
      th,td {
        padding: 5px 0!important;
      }
    }

  }
</style>
