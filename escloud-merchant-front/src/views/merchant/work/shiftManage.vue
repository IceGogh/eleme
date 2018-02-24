<template>
  <div>
    <!-- 操作栏 （添加、搜索按钮 根据需要写入）-->
    <div class="option-bar">
      <el-button type="edenep-blue-btn" icon="el-icon-circle-plus-outline" class="add-btn" @click="addMerchantShift">添加班次</el-button>
      <div class="searchBox">
        <input type="text" class="search" placeholder="请输入关键词查询" v-model="filterForm.searchWord" @keyup.enter="searchMerchantShift"/>
        <i class="el-icon-search" @click="searchMerchantShift"></i>
      </div>
    </div>
    <template>
      <div>
        <div class="app-container calendar-list-container">
          <section>
            <el-row>
              <el-col :span="6">
                <p>夏-冬时令切换时间：
                  <span v-if="projectBean && projectBean.dst2WtMonth && projectBean.dst2WtDay">{{projectBean.dst2WtMonth}} 月 {{projectBean.dst2WtDay}} 日</span>
                  <span v-else>未设置</span>
                </p>
                <p>冬-夏时令切换时间：
                  <span v-if="projectBean && projectBean.wt2DstMonth && projectBean.wt2DstDay">{{projectBean.wt2DstMonth}} 月 {{projectBean.wt2DstDay}} 日</span>
                  <span v-else>未设置</span>
                </p>
              </el-col>
              <el-col :span="6">
                <el-button @click="settingDSTWT">设置夏冬时令切换时间</el-button>
              </el-col>
            </el-row>
          </section>

          <!-- 表格-->
          <el-table ref="multipleTable" :data-key='tableKey' :data="list" fit highlight-current-row size='mini'
                    :default-sort="{prop: 'id', order: 'aescending'}" @select="selectCheckBox" @select-all="selectAllCheckBox" v-loading="listLoading"
                    element-loading-text="给我一点时间" style="width: 100%">
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column header-align="center" width="50" align="center" label="序号" prop='id'>
              <template slot-scope="scope">
                <span>{{scope.row.id}}</span>
              </template>
            </el-table-column>
            <el-table-column header-align="center" width="150" align="center" label="班次名称" prop='shiftName'>
              <template slot-scope="scope">
                <span>{{scope.row.shiftName}}</span>
              </template>
            </el-table-column>
            <el-table-column header-align="center" align="center" label="考勤时间" prop='shiftName'>
              <template slot-scope="scope">
                <span v-for="item in renderShiftTimes(scope.row.merchantShiftTimeList)" v-if="item && item.length > 0">
                  <span v-if="item[0].timeType == timeTypeEnum.DST">夏令时 </span>
                  <span v-else-if="item[0].timeType == timeTypeEnum.WT">冬令时 </span>
                  <span v-for="(time, i) in item">
                    {{time.inWorkTime.substr(0, 5)}} - {{time.offWorkTime.substr(0, 5)}} <span v-if="i < item.length-1">&nbsp;&nbsp;</span>
                  </span>
                  <br/>
                </span>
              </template>
            </el-table-column>
            <el-table-column header-align="center" width="100" align="center" label="创建人" prop='createByName'>
              <template slot-scope="scope">
                <span>{{scope.row.createByName}}</span>
              </template>
            </el-table-column>
            <el-table-column header-align="center" width="150" show-overflow-tooltip align="center" label="备注" prop='description'>
              <template slot-scope="scope">
                <span>{{scope.row.description}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="200">
              <template slot-scope="scope">
                <el-button size="small" type="text" @click="modifyMerchantShift(scope.row,'update')">修改
                </el-button>
                |
                <el-button size="small" type="text" @click="deleteMerchantShift(scope.row,'delete')">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页工具栏-->
          <div v-show="!listLoading" class="pagination-container">
            <el-row>
              <el-col :span="24">
                <el-pagination @size-change="pageSizeChange" @current-change="currentPageChange" :current-page.sync="filterForm.current"
                               :page-sizes="pageSize" :page-size="filterForm.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="total">
                </el-pagination>
              </el-col>
            </el-row>
          </div>

          <!-- 新增/编辑模态框-->
          <el-dialog class="create_dialog" :title="textMap[dialogStatus]" :width="isCommonlyTimeType ? '' : '60%'" top="5vh" :visible.sync="dialogFormVisible" :close-on-click-modal="false"
            :before-close="closeDialog">
            <el-form :model="merchantShiftForm" ref="merchantShiftForm" size="small" class="merchantShiftForm">
              <el-row>
                <el-col :span="24">
                  <el-form-item label="班次名称" prop="shiftName" labelWidth="60px">
                    <el-input size="small" v-model="merchantShiftForm.shiftName" :maxlength="50" style="width: 200px"></el-input>
                    <span class="tip-text">最多50个字符（中英文或者数字）</span>
                  </el-form-item>
                </el-col>
              </el-row>

              <section>
                <el-row>
                  <el-col :span="24">
                    <p>
                      考勤时间段
                      <el-button size="mini" type="primary" plain style="margin-left: 20px" icon="el-icon-plus" @click="addTime">新增</el-button>
                      <el-radio-group v-model="isCommonlyTimeType" style="float: right">
                        <el-radio :label="true">通用</el-radio>
                        <el-radio :label="false">夏冬令时</el-radio>
                      </el-radio-group>
                      <!--<el-checkbox v-model="isCommonlyTimeType" style="float: right" @change="commonlyTimeTypeCheckboxChange">夏冬令时</el-checkbox>-->
                    </p>
                  </el-col>
                </el-row>

                <section>
                  <el-row v-if="!isCommonlyTimeType" style="margin-bottom: 10px">
                    <el-col :span="1"></el-col>
                    <el-col :span="11" style="text-align: center">
                      夏令时
                    </el-col>
                    <el-col :span="10" style="text-align: center">
                      冬令时
                    </el-col>
                    <el-col :span="2"></el-col>
                  </el-row>
                  <el-row v-for="(item, i) in timeList" :key="'abc-'+i" style="margin-bottom: 10px">
                    <el-col :span="1">{{i+1}}</el-col>
                    <el-col v-show="isCommonlyTimeType" :span="12">
                      <span class="inWorkTime-span">
                        上班：
                        <el-time-select :editable="false" size="mini" v-model="item.commonly.inWorkTime" :picker-options="{format: 'HH:mm:ss',start: '03:00',step: '00:15',end: '23:30', maxTime: item.commonly.offWorkTime}"></el-time-select>
                      </span>
                      <span class="offWorkTime-span">
                        下班：
                        <el-time-select :editable="false" size="mini" v-model="item.commonly.offWorkTime" :picker-options="{format: 'HH:mm:ss',start: '03:00',step: '00:15',end: '23:30', minTime: item.commonly.inWorkTime}"></el-time-select>
                      </span>
                    </el-col>
                    <el-col v-show="!isCommonlyTimeType" :span="11">
                      <span class="inWorkTime-span">
                        上班：
                        <el-time-select :editable="false" value-format="HH:mm:ss" size="mini" v-model="item.dst.inWorkTime" :picker-options="{start: '03:00',step: '00:15',end: '23:30', maxTime: item.dst.offWorkTime}"></el-time-select>
                      </span>
                      <span class="offWorkTime-span">
                        下班：
                        <el-time-select :editable="false" value-format="HH:mm:ss" size="mini" v-model="item.dst.offWorkTime" :picker-options="{start: '03:00',step: '00:15',end: '23:30', minTime: item.dst.inWorkTime}"></el-time-select>
                      </span>
                    </el-col>
                    <el-col v-show="!isCommonlyTimeType" :span="10">
                      <span class="inWorkTime-span">
                      上班：
                      <el-time-select :editable="false" value-format="HH:mm:ss" size="mini" v-model="item.wt.inWorkTime" :picker-options="{start: '03:00',step: '00:15',end: '23:30', maxTime: item.wt.offWorkTime}"></el-time-select>
                    </span>
                      <span class="offWorkTime-span">
                      下班：
                      <el-time-select :editable="false" value-format="HH:mm:ss" size="mini" v-model="item.wt.offWorkTime" :picker-options="{start: '03:00',step: '00:15',end: '23:30', minTime: item.wt.inWorkTime}"></el-time-select>
                    </span>
                    </el-col>
                    <el-col :span="2" style="text-align: center">
                      <el-button v-if="timeList.length > 1" size="mini" type="text" @click="removeTime(i)">删除</el-button>
                    </el-col>
                  </el-row>
                </section>
              </section>

              <section>
                <el-row>
                  <el-col :span="24"><p>人性化设置</p></el-col>
                </el-row>
                <el-row>
                  <el-col :span="11">
                    <el-checkbox-group v-model="lateMinCheckboxValues" @change="lateMinCheckboxsChange">
                      <p v-for="p in lateMinCheckbox">
                        <el-checkbox :label="p.name" name="lateMinCheckbox">
                          <span :class="!p.enabled ? 'disabled-text' : ''">{{p.label}}</span>
                          <el-input-number :controls="false" v-model="p.value" :disabled="!p.enabled"  size="mini" :maxlength="5" :min="0" :max="99999" :class="p.name == lateMinCheckbox.clockInValidMinutes.name ? 'minutes-input-clock' : 'minutes-input'"></el-input-number>
                        </el-checkbox>
                      </p>
                    </el-checkbox-group>
                  </el-col>
                  <el-col :span="11">
                    <el-checkbox-group v-model="leaveEarlyMinCheckboxValues" @change="leaveEarlyMinCheckboxsChange">
                      <p v-for="p in leaveEarlyMinCheckbox">
                        <el-checkbox :label="p.name" name="leaveEarlyMinCheckbox">
                          <span :class="!p.enabled ? 'disabled-text' : ''">{{p.label}}</span>
                          <el-input-number :controls="false" v-model="p.value" :disabled="!p.enabled" size="mini" :maxlength="5" :min="0" :max="99999" :class="p.name == leaveEarlyMinCheckbox.clockOutValidMinutes.name ? 'minutes-input-clock' : 'minutes-input'"></el-input-number>
                        </el-checkbox>
                      </p>
                    </el-checkbox-group>
                  </el-col>
                </el-row>
              </section>

              <section>
                <el-row>
                  <el-col :span="24"><p>备注</p></el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-input type="textarea"  resize="none" v-model="merchantShiftForm.description" :maxlength="50"></el-input>
                  </el-col>
                </el-row>
              </section>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button round @click="closeDialog">取 消</el-button>
              <el-button round v-if="dialogStatus=='create'" type="primary" @click="addSubmit">确 定</el-button>
              <el-button round v-else type="primary" @click="updateSubmit">确 定</el-button>
            </div>
          </el-dialog>

          <!-- 设置夏冬时令切换时间模态框-->
          <el-dialog title="设置夏冬时令切换时间" :visible.sync="settingDSTWTDialogVisible" :close-on-click-modal="false"
                     :before-close="closeSettingDSTWTDialog">
            <el-form :model="settingDSTWTForm" size="small" class="settingDSTWTForm">
              <el-form-item label="夏-冬时令切换日期：">
                <el-select v-model="settingDSTWTForm.dst2WtMonth" placeholder="请选择" @change="generateDaysForMonthDST">
                  <el-option v-for="month in 12" :key="month" :label="month" :value="month">
                  </el-option>
                </el-select>
                月
                <el-select v-model="settingDSTWTForm.dst2WtDay" placeholder="请选择">
                  <el-option v-for="day in daysForMonthDST" :key="day" :label="day" :value="day">
                  </el-option>
                </el-select>
                日
              </el-form-item>

              <el-form-item label="冬-夏时令切换日期：">
                <el-select v-model="settingDSTWTForm.wt2DstMonth" placeholder="请选择" @change="generateDaysForMonthWT">
                  <el-option v-for="month in 12" :key="month" :label="month" :value="month">
                  </el-option>
                </el-select>
                月
                <el-select v-model="settingDSTWTForm.wt2DstDay" placeholder="请选择">
                  <el-option v-for="day in daysForMonthWT" :key="day" :label="day" :value="day">
                  </el-option>
                </el-select>
                日
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="closeSettingDSTWTDialog">取 消</el-button>
              <el-button type="primary" @click="submitSettingDSTWT">确 定</el-button>
            </div>
          </el-dialog>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
  import { getMerchantShiftList, addMerchantShift, editMerchantShift, delMerchantShift } from '@/api/merchant/work/merchantShift'
  import { getProjectByCode, settingDSTWT } from '@/api/merchant/project/projectManager'
  import { globalConfig } from '@/globalConfig'
  import waves from '@/directive/waves/index.js'
  import { getApplicationCode, getCurProjectCode } from '@/api/common'
  import SidebarMenu from '@/views/plat/layout/SidebarMenu'

  export default {
    name: 'shiftManage',
    directives: {
      waves
    },
    components: {
      'sidebar-menu': SidebarMenu
    },
    data() {
      return {
        curDate: new Date(),
        curApplicationCode: getApplicationCode(this),
        curProjectCode: getCurProjectCode(),
        list: [],
        total: 0,
        listLoading: true,
        downloadLoading: false,
        isBatch: true,
        pageSize: globalConfig.pageSize,
        filterFormLabelWidth: '100px',
        filterFormLabelWidth2: '12px',
        filterForm: {
          searchWord: '',
          curProjectCode: getCurProjectCode(),
          current: globalConfig.startPage,
          pageSize: globalConfig.initPageSize
        },
        dialogStatus: '',
        tableKey: 0,
        dialogFormVisible: false,
        dialogEditFormVisible: false,
        settingDSTWTDialogVisible: false,
        formLabelWidth: '120px',
        merchantShiftForm: {
          merchantId: '',
          projectCode: getCurProjectCode(),
          shiftName: '',
          allowLateMinutes: 0,
          seriousLateMinutes: 0,
          absenteeismLateMinutes: 0,
          allowLeaveEarlyMinutes: 0,
          seriousLeaveEarlyMinutes: 0,
          absenteeismLeaveEarlyMinutes: 0,
          clockInValidMinutes: 0,
          clockOutValidMinutes: 0,
          description: ''
        },
        textMap: {
          update: '编辑班次',
          create: '新增班次'
        },
        lateMinCheckboxValues: [],
        lateMinCheckbox: {
          allowLateMinutes: { label: '允许迟到分钟数', value: 0, name: 'allowLateMinutes', enabled: false },
          seriousLateMinutes: { label: '严重迟到分钟数', value: 0, name: 'seriousLateMinutes', enabled: false },
          absenteeismLateMinutes: { label: '旷工迟到分钟数', value: 0, name: 'absenteeismLateMinutes', enabled: false },
          clockInValidMinutes: { label: '上班打卡有效分钟', value: 0, name: 'clockInValidMinutes', enabled: false }
        },
        leaveEarlyMinCheckboxValues: [],
        leaveEarlyMinCheckbox: {
          allowLeaveEarlyMinutes: { label: '允许早退分钟数', value: 0, name: 'allowLeaveEarlyMinutes', enabled: false },
          seriousLeaveEarlyMinutes: { label: '严重早退分钟数', value: 0, name: 'seriousLeaveEarlyMinutes', enabled: false },
          absenteeismLeaveEarlyMinutes: { label: '旷工早退分钟数', value: 0, name: 'absenteeismLeaveEarlyMinutes', enabled: false },
          clockOutValidMinutes: { label: '下班打卡有效分钟', value: 0, name: 'clockOutValidMinutes', enabled: false }
        },
        isCommonlyTimeType: true,
        timeTypeEnum: {
          COMMONLY: 0, // 通用
          DST: 1, // 夏令时
          WT: 2 // 冬令时
        },
        timeList: [
          { commonly: { inWorkTime: '', offWorkTime: '', timeType: 0 }, dst: { inWorkTime: '', offWorkTime: '', timeType: 1 }, wt: { inWorkTime: '', offWorkTime: '', timeType: 2 }}
        ],
        projectBean: null,
        settingDSTWTForm: {
          dst2WtMonth: null,
          dst2WtDay: null,
          wt2DstMonth: null,
          wt2DstDay: null
        },
        daysForMonthDST: [],
        daysForMonthWT: []
      }
    },
    computed: {
      minimenu2ndStatus() {
        return this.$store.state.app.minimenu2ndStatus
      }
    },
    created() {
      this.getMerchantShiftList()
      this.getCurProjectInfo()
    },
    methods: {
      generateDaysForMonth(month) {
        const arr = [1, 3, 5, 7, 8, 10, 12]
        let dayCount = 30
        if (month === 2) {
          dayCount = 29
        } else if (arr.indexOf(month) !== -1) {
          dayCount = 31
        }

        const dayArr = []
        for (let i = 1; i <= dayCount; i++) {
          dayArr.push(i)
        }
        return dayArr
      },
      generateDaysForMonthDST(month) {
        this.daysForMonthDST = this.generateDaysForMonth(month)
      },
      generateDaysForMonthWT(month) {
        this.daysForMonthWT = this.generateDaysForMonth(month)
      },
      checkProjectHaveSetDSTWT() {
        return this.projectBean && this.projectBean.dst2WtMonth && this.projectBean.dst2WtDay && this.projectBean.wt2DstMonth && this.projectBean.wt2DstDay
      },
      getCurProjectInfo() {
        getProjectByCode({ curProjectCode: this.curProjectCode }).then(response => {
          if (response.data.error_no === 0) {
            this.projectBean = response.data.result
          } else {
            this.$message(response.data.error_info)
          }
        }).catch()
      },
      renderShiftTimes(merchantShiftTimeList) {
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

        return shiftTimeData
      },
      findBy(array, attrName, attrVal) {
        const result = array.filter((item) => {
          return item[attrName] === attrVal
        })
        if (result) {
          return result.length === 1 ? result[0] : result
        }

        return null
      },
      checkShiftName() {
        const shiftName = this.merchantShiftForm.shiftName.trim()
        if (shiftName.length === 0) {
          this.$message.error('班次名称不能为空。')
          return false
        }

        const pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
        if (pattern.test(shiftName)) {
          this.$message.error('班次名称不能包含特殊符号。')
          return false
        }

        return true
      },
      checkAttendanceTimes() {
        if (this.timeList.length === 0) {
          this.$message.error('请至少设定一个考勤时间段。')
          return false
        }

        const date = '2018-01-01'
        let previousItemObj, curItemObj

        let previousCommonlyTimeObj, curCommonlyTimeObj
        let previousDstTimeObj, curDstTimeObj
        let previousWtTimeObj, curWtTimeObj

        let previousCommonlyOffWorkTime, curCommonlyInWorkTime
        let previousDstOffWorkTime, curDstInWorkTime
        let previousWtOffWorkTime, curWtInWorkTime

        for (let i = 0; i < this.timeList.length; i++) {
          curItemObj = this.timeList[i]
          curCommonlyTimeObj = curItemObj.commonly
          curDstTimeObj = curItemObj.dst
          curWtTimeObj = curItemObj.wt

          if (
            (this.isCommonlyTimeType && (!curCommonlyTimeObj.inWorkTime || !curCommonlyTimeObj.offWorkTime)) ||
            (!this.isCommonlyTimeType && (!curDstTimeObj.inWorkTime || !curDstTimeObj.offWorkTime || !curWtTimeObj.inWorkTime || !curWtTimeObj.offWorkTime))
          ) {
            this.$message.error('考勤时间不完整。')
            return false
          }

          if (i > 0) {
            previousItemObj = this.timeList[i - 1]
            previousCommonlyTimeObj = previousItemObj.commonly
            previousDstTimeObj = previousItemObj.dst
            previousWtTimeObj = previousItemObj.wt
            previousCommonlyOffWorkTime = new Date(`${date} ${previousCommonlyTimeObj.offWorkTime}`)
            curCommonlyInWorkTime = new Date(`${date} ${curCommonlyTimeObj.inWorkTime}`)

            if (this.isCommonlyTimeType && previousCommonlyOffWorkTime > curCommonlyInWorkTime) {
              this.$message.error('上班时间不能低于上一个考勤时间的下班时间。')
              return false
            } else {
              previousDstOffWorkTime = new Date(`${date} ${previousDstTimeObj.offWorkTime}`)
              curDstInWorkTime = new Date(`${date} ${curDstTimeObj.inWorkTime}`)
              previousWtOffWorkTime = new Date(`${date} ${previousWtTimeObj.offWorkTime}`)
              curWtInWorkTime = new Date(`${date} ${curWtTimeObj.inWorkTime}`)
              if (previousDstOffWorkTime > curDstInWorkTime || previousWtOffWorkTime > curWtInWorkTime) {
                this.$message.error('同类型下，上班时间不能低于上一个考勤时间的下班时间。')
                return false
              }
            }
          }
        }
        return true
      },
      checkLateAndLeaveEarlyMins() {
        let tempLateMin
        for (const p in this.lateMinCheckbox) {
          tempLateMin = this.lateMinCheckbox[p]
          if (tempLateMin.enabled && tempLateMin.value <= 0) {
            this.$message.error(`人性化设置中已开启的各项配置值必须大于0`)
            return false
          }
        }

        const allowLateMinutes = this.lateMinCheckbox.allowLateMinutes.value
        const seriousLateMinutes = this.lateMinCheckbox.seriousLateMinutes.value
        const absenteeismLateMinutes = this.lateMinCheckbox.absenteeismLateMinutes.value
        if (
          (seriousLateMinutes && allowLateMinutes && seriousLateMinutes <= allowLateMinutes) ||
          (absenteeismLateMinutes && seriousLateMinutes && absenteeismLateMinutes <= seriousLateMinutes) ||
          (allowLateMinutes && absenteeismLateMinutes && absenteeismLateMinutes <= allowLateMinutes)
        ) {
          this.$message.error('迟到分钟数设定有误，分钟数应随程度等级变高而变大')
          return false
        }

        let tempLeaveEarlyMin
        for (const p in this.leaveEarlyMinCheckbox) {
          tempLeaveEarlyMin = this.leaveEarlyMinCheckbox[p]
          if (tempLeaveEarlyMin.enabled && tempLeaveEarlyMin.value <= 0) {
            this.$message.error(`人性化设置中已开启的各项配置值必须大于0`)
            return false
          }
        }

        const allowLeaveEarlyMinutes = this.leaveEarlyMinCheckbox.allowLeaveEarlyMinutes.value
        const seriousLeaveEarlyMinutes = this.leaveEarlyMinCheckbox.seriousLeaveEarlyMinutes.value
        const absenteeismLeaveEarlyMinutes = this.leaveEarlyMinCheckbox.absenteeismLeaveEarlyMinutes.value
        if (
          (seriousLeaveEarlyMinutes && allowLeaveEarlyMinutes && seriousLeaveEarlyMinutes <= allowLeaveEarlyMinutes) ||
          (absenteeismLeaveEarlyMinutes && seriousLeaveEarlyMinutes && absenteeismLeaveEarlyMinutes <= seriousLeaveEarlyMinutes) ||
          (allowLeaveEarlyMinutes && absenteeismLeaveEarlyMinutes && absenteeismLeaveEarlyMinutes <= allowLeaveEarlyMinutes)
        ) {
          this.$message.error('早退分钟数设定有误，分钟数应随程度等级变高而变大')
          return false
        }

        return true
      },
      checkData() {
        if (!this.checkShiftName() || !this.checkAttendanceTimes() || !this.checkLateAndLeaveEarlyMins()) {
          return false
        }
        return true
      },
      sortTimeListBeforeSubmitForm() {
        for (let i = 0; i < this.timeList.length; i++) {
          if (this.isCommonlyTimeType) {
            // delete this.timeList[i].dst
            // delete this.timeList[i].wt
            this.timeList[i].commonly.orderNo = i + 1
          } else {
            // delete this.timeList[i].commonly
            this.timeList[i].dst.orderNo = i + 1
            this.timeList[i].wt.orderNo = i + 1
          }
        }
      },
      lateMinCheckboxsChange() {
        for (const p in this.lateMinCheckbox) {
          this.lateMinCheckbox[p].enabled = this.lateMinCheckboxValues.indexOf(p) !== -1
          if (!this.lateMinCheckbox[p].enabled) {
            this.lateMinCheckbox[p].value = 0
          }
        }
      },
      leaveEarlyMinCheckboxsChange() {
        for (const p in this.leaveEarlyMinCheckbox) {
          this.leaveEarlyMinCheckbox[p].enabled = this.leaveEarlyMinCheckboxValues.indexOf(p) !== -1
          if (!this.leaveEarlyMinCheckbox[p].enabled) {
            this.leaveEarlyMinCheckbox[p].value = 0
          }
        }
      },
      addTime() {
        this.timeList.push({ commonly: { inWorkTime: '', offWorkTime: '', timeType: this.timeTypeEnum.COMMONLY }, dst: { inWorkTime: '', offWorkTime: '', timeType: this.timeTypeEnum.DST }, wt: { inWorkTime: '', offWorkTime: '', timeType: this.timeTypeEnum.WT }})
      },
      removeTime(index) {
        const obj = this.timeList[index]
        if (this.isCommonlyTimeType && obj.commonly.id || (!this.isCommonlyTimeType && (obj.dst.id || obj.wt.id))) {
          this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.timeList.splice(index, 1)
          })
        } else {
          this.timeList.splice(index, 1)
        }
      },
      getMerchantShiftList() {
        this.listLoading = true
        this.filterForm.curApplicationCode = this.curApplicationCode
        this.filterForm.curProjectCode = this.curProjectCode
        getMerchantShiftList(this.filterForm).then(response => {
          if (response.data.error_no === 0) {
            this.list = response.data.result.records
            this.total = response.data.result.total
          } else {
            this.$message(response.data.error_info)
          }
          this.listLoading = false
        })
      },
      searchMerchantShift() {
        this.filterForm.current = globalConfig.startPage
        this.getMerchantShiftList()
      },
      addMerchantShift() {
        if (this.checkProjectHaveSetDSTWT()) {
          this.dialogStatus = 'create'
          this.dialogFormVisible = true
        } else {
          this.$message.warning('请先设置夏冬时令切换时间。')
        }
      },
      loadLateMinsInfo2EditForm() {
        this.lateMinCheckbox.allowLateMinutes.value = this.merchantShiftForm.allowLateMinutes
        this.lateMinCheckbox.allowLateMinutes.enabled = this.merchantShiftForm.allowLateMinutes > 0
        this.lateMinCheckbox.seriousLateMinutes.value = this.merchantShiftForm.seriousLateMinutes
        this.lateMinCheckbox.seriousLateMinutes.enabled = this.merchantShiftForm.seriousLateMinutes > 0
        this.lateMinCheckbox.absenteeismLateMinutes.value = this.merchantShiftForm.absenteeismLateMinutes
        this.lateMinCheckbox.absenteeismLateMinutes.enabled = this.merchantShiftForm.absenteeismLateMinutes > 0
        this.lateMinCheckbox.clockInValidMinutes.value = this.merchantShiftForm.clockInValidMinutes
        this.lateMinCheckbox.clockInValidMinutes.enabled = this.merchantShiftForm.clockInValidMinutes > 0
        this.lateMinCheckboxValues = []
        if (this.lateMinCheckbox.allowLateMinutes.enabled) {
          this.lateMinCheckboxValues.push('allowLateMinutes')
        }
        if (this.lateMinCheckbox.seriousLateMinutes.enabled) {
          this.lateMinCheckboxValues.push('seriousLateMinutes')
        }
        if (this.lateMinCheckbox.absenteeismLateMinutes.enabled) {
          this.lateMinCheckboxValues.push('absenteeismLateMinutes')
        }
        if (this.lateMinCheckbox.clockInValidMinutes.enabled) {
          this.lateMinCheckboxValues.push('clockInValidMinutes')
        }
      },
      loadLeaveEarlyMinsInfo2EditForm() {
        this.leaveEarlyMinCheckbox.allowLeaveEarlyMinutes.value = this.merchantShiftForm.allowLeaveEarlyMinutes
        this.leaveEarlyMinCheckbox.allowLeaveEarlyMinutes.enabled = this.merchantShiftForm.allowLeaveEarlyMinutes > 0
        this.leaveEarlyMinCheckbox.seriousLeaveEarlyMinutes.value = this.merchantShiftForm.seriousLeaveEarlyMinutes
        this.leaveEarlyMinCheckbox.seriousLeaveEarlyMinutes.enabled = this.merchantShiftForm.seriousLeaveEarlyMinutes > 0
        this.leaveEarlyMinCheckbox.absenteeismLeaveEarlyMinutes.value = this.merchantShiftForm.absenteeismLeaveEarlyMinutes
        this.leaveEarlyMinCheckbox.absenteeismLeaveEarlyMinutes.enabled = this.merchantShiftForm.absenteeismLeaveEarlyMinutes > 0
        this.leaveEarlyMinCheckbox.clockOutValidMinutes.value = this.merchantShiftForm.clockOutValidMinutes
        this.leaveEarlyMinCheckbox.clockOutValidMinutes.enabled = this.merchantShiftForm.clockOutValidMinutes > 0
        this.leaveEarlyMinCheckboxValues = []
        if (this.leaveEarlyMinCheckbox.allowLeaveEarlyMinutes.enabled) {
          this.leaveEarlyMinCheckboxValues.push('allowLeaveEarlyMinutes')
        }
        if (this.leaveEarlyMinCheckbox.seriousLeaveEarlyMinutes.enabled) {
          this.leaveEarlyMinCheckboxValues.push('seriousLeaveEarlyMinutes')
        }
        if (this.leaveEarlyMinCheckbox.absenteeismLeaveEarlyMinutes.enabled) {
          this.leaveEarlyMinCheckboxValues.push('absenteeismLeaveEarlyMinutes')
        }
        if (this.leaveEarlyMinCheckbox.clockOutValidMinutes.enabled) {
          this.leaveEarlyMinCheckboxValues.push('clockOutValidMinutes')
        }
      },
      loadIsCommonlyTimeType2EditForm(row) {
        this.isCommonlyTimeType = true
        const merchantShiftTimeList = row.merchantShiftTimeList

        for (let i = 0; i < merchantShiftTimeList.length; i++) {
          if (merchantShiftTimeList[i].timeType !== this.timeTypeEnum.COMMONLY) {
            this.isCommonlyTimeType = false
            break
          }
        }
      },
      loadTimeList2EditForm(row) {
        const merchantShiftTimeList = row.merchantShiftTimeList
        this.timeList = []
        if (this.isCommonlyTimeType) {
          merchantShiftTimeList.map((item) => {
            this.timeList.push({ commonly: { id: item.id, inWorkTime: item.inWorkTime, offWorkTime: item.offWorkTime, timeType: 0 }, dst: { inWorkTime: '', offWorkTime: '', timeType: 1 }, wt: { inWorkTime: '', offWorkTime: '', timeType: 2 }})
          })
        } else {
          const tempObj = {}

          merchantShiftTimeList.map((item) => {
            if (!tempObj[item.orderNo]) {
              tempObj[item.orderNo] = { dst: null, wt: null }
            }
            tempObj[item.orderNo][item.timeType === this.timeTypeEnum.DST ? 'dst' : 'wt'] = { id: item.id, inWorkTime: item.inWorkTime, offWorkTime: item.offWorkTime, timeType: item.timeType }
          })

          for (const p in tempObj) {
            this.timeList.push({ commonly: { inWorkTime: '', offWorkTime: '', timeType: 0 }, dst: tempObj[p].dst, wt: tempObj[p].wt })
          }
        }
      },
      modifyMerchantShift(row) {
        this.merchantShiftForm = Object.assign({}, row)
        delete this.merchantShiftForm.merchantShiftTimeList

        this.loadLateMinsInfo2EditForm()
        this.loadLeaveEarlyMinsInfo2EditForm()
        this.loadIsCommonlyTimeType2EditForm(row)
        this.loadTimeList2EditForm(row)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },
      deleteMerchantShift(row) {
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
          delMerchantShift(param).then(response => {
            if (response.data.error_no === 0) {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
              this.searchMerchantShift()
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
        this.getMerchantShiftList()
      },
      currentPageChange(val) {
        this.filterForm.current = val
        this.getMerchantShiftList()
      },
      setLateOrLeaveEarlyMinsInfoBeforeSubmitForm() {
        this.merchantShiftForm.allowLateMinutes = this.lateMinCheckbox.allowLateMinutes.value
        this.merchantShiftForm.seriousLateMinutes = this.lateMinCheckbox.seriousLateMinutes.value
        this.merchantShiftForm.absenteeismLateMinutes = this.lateMinCheckbox.absenteeismLateMinutes.value
        this.merchantShiftForm.clockInValidMinutes = this.lateMinCheckbox.clockInValidMinutes.value

        this.merchantShiftForm.allowLeaveEarlyMinutes = this.leaveEarlyMinCheckbox.allowLeaveEarlyMinutes.value
        this.merchantShiftForm.seriousLeaveEarlyMinutes = this.leaveEarlyMinCheckbox.seriousLeaveEarlyMinutes.value
        this.merchantShiftForm.absenteeismLeaveEarlyMinutes = this.leaveEarlyMinCheckbox.absenteeismLeaveEarlyMinutes.value
        this.merchantShiftForm.clockOutValidMinutes = this.leaveEarlyMinCheckbox.clockOutValidMinutes.value
      },
      addSubmit() {
        if (this.checkData()) {
          this.listLoading = true
          this.merchantShiftForm.curApplicationCode = this.curApplicationCode
          this.merchantShiftForm.curProjectCode = this.curProjectCode
          this.setLateOrLeaveEarlyMinsInfoBeforeSubmitForm()
          this.sortTimeListBeforeSubmitForm()
          this.merchantShiftForm.isCommonlyTimeType = this.isCommonlyTimeType
          this.merchantShiftForm.merchantShiftTimeListJson = JSON.stringify(this.timeList)

          addMerchantShift(this.merchantShiftForm).then(response => {
            if (response.data.error_no === 0) {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: response.data.error_info,
                type: 'success',
                duration: 2000
              })
              this.closeDialog()
              this.searchMerchantShift()
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
          this.merchantShiftForm.curApplicationCode = this.curApplicationCode
          this.merchantShiftForm.curProjectCode = this.curProjectCode
          this.setLateOrLeaveEarlyMinsInfoBeforeSubmitForm()
          this.sortTimeListBeforeSubmitForm()
          this.merchantShiftForm.isCommonlyTimeType = this.isCommonlyTimeType
          this.merchantShiftForm.merchantShiftTimeListJson = JSON.stringify(this.timeList)

          editMerchantShift(this.merchantShiftForm).then(response => {
            if (response.data.error_no === 0) {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: response.data.error_info,
                type: 'success',
                duration: 2000
              })
              this.closeDialog()
              this.searchMerchantShift()
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
      resetForm() {
        this.merchantShiftForm = {
          projectCode: this.curProjectCode,
          shiftName: '',
          allowLateMinutes: '',
          seriousLateMinutes: '',
          absenteeismLateMinutes: '',
          allowLeaveEarlyMinutes: '',
          seriousLeaveEarlyMinutes: '',
          absenteeismLeaveEarlyMinutes: '',
          clockInValidMinutes: '',
          clockOutValidMinutes: '',
          description: ''
        }
        this.timeList = [
          { commonly: { inWorkTime: '', offWorkTime: '', timeType: 0 }, dst: { inWorkTime: '', offWorkTime: '', timeType: 1 }, wt: { inWorkTime: '', offWorkTime: '', timeType: 2 }}
        ]
        if (this.$refs['merchantShiftForm'] !== undefined) {
          this.$refs['merchantShiftForm'].resetFields()
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
            '班次名称(唯一)',
            '允许迟到分钟数',
            '严重迟到分钟数',
            '旷工迟到分钟数',
            '允许早退分钟数',
            '严重早退分钟数',
            '旷工早退分钟数',
            '上班打卡有效分钟',
            '下班打卡有效分钟',
            '创建者',
            '创建时间',
            '修改者',
            '修改时间',
            '备注'
          ]
          const filterVal = [
            'id',
            'merchantId',
            'projectCode',
            'shiftName',
            'allowLateMinutes',
            'seriousLateMinutes',
            'absenteeismLateMinutes',
            'allowLeaveEarlyMinutes',
            'seriousLeaveEarlyMinutes',
            'absenteeismLeaveEarlyMinutes',
            'clockInValidMinutes',
            'clockOutValidMinutes',
            'createBy',
            'createDate',
            'updateBy',
            'updateDate',
            'description'
          ]
          const list = this.list
          const data = this.formatJson(filterVal, list)
          export_json_to_excel(tHeader, data, '商户平台班次表')
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
      closeSettingDSTWTDialog() {
        this.settingDSTWTDialogVisible = false
        this.settingDSTWTForm = {
          dst2WtMonth: null,
          dst2WtDay: null,
          wt2DstMonth: null,
          wt2DstDay: null
        }

        this.daysForMonthDST = []
        this.daysForMonthWT = []
      },
      settingDSTWT() {
        if (this.checkProjectHaveSetDSTWT()) {
          this.settingDSTWTForm.dst2WtMonth = this.projectBean.dst2WtMonth
          this.settingDSTWTForm.dst2WtDay = this.projectBean.dst2WtDay
          this.settingDSTWTForm.wt2DstMonth = this.projectBean.wt2DstMonth
          this.settingDSTWTForm.wt2DstDay = this.projectBean.wt2DstDay
        }
        this.settingDSTWTDialogVisible = true
      },
      submitSettingDSTWT() {
        if (this.settingDSTWTForm.dst2WtMonth && this.settingDSTWTForm.dst2WtDay && this.settingDSTWTForm.wt2DstMonth && this.settingDSTWTForm.wt2DstDay) {
          const param = {
            curApplicationCode: this.curApplicationCode,
            curProjectCode: this.curProjectCode,
            dst2WtMonth: this.settingDSTWTForm.dst2WtMonth,
            dst2WtDay: this.settingDSTWTForm.dst2WtDay,
            wt2DstMonth: this.settingDSTWTForm.wt2DstMonth,
            wt2DstDay: this.settingDSTWTForm.wt2DstDay
          }
          settingDSTWT(param).then(response => {
            if (response.data.error_no === 0) {
              this.$notify({
                title: '成功',
                message: response.data.error_info,
                type: 'success',
                duration: 2000
              })
              this.getCurProjectInfo()
              this.closeSettingDSTWTDialog()
            } else {
              this.$message(response.data.error_info)
            }
          })
        } else {
          this.$message.error('请填写完整。')
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "../../../styles/merchant.scss";
  .settingDSTWTForm {
    .el-select {
      width: 100px;
      display: inline-block;
    }
  }

  .create_dialog {
    .tip-text {
      font-size: 80%;
      color: #999999;
      margin-left: 15px;
    }

    .disabled-text {
      color: #999999;
    }

    .minutes-input {
      width: 80px;
      margin-left: 20px;
    }

    .minutes-input-clock {
      width: 80px;
      margin-left: 6px;
    }

    .el-date-editor.el-input, .el-date-editor.el-input__inner {
      width: 120px;
      min-width: 120px!important;
    }

    .merchantShiftForm {
      max-height: 550px;
      overflow: auto;
    }
    .time-ol {
      li {
        list-style: decimal;
        margin-bottom: 10px;
      }
    }

    .el-select {
      display: inline-block;
    }

    .inWorkTime-span {
      margin: 0 20px 0 0;
    }
    .offWorkTime-span {
     /* margin-right: 25px;*/
    }
  }
</style>
