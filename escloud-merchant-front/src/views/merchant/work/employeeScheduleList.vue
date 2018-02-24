<template>
  <div>
    <!-- 操作栏 （添加、搜索按钮 根据需要写入）-->
    <div class="option-bar">
      <el-form :model="filterForm" label-width="80px">
        <el-row :gutter="16">
          <el-col :span="5">
            <el-form-item label="年月" label-width="40px">
              <el-date-picker v-model="filterForm.date" type="month" :clearable="false" :editable="false"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item prop="employeeName" label="人员名称">
              <el-input v-model="filterForm.employeeName" :maxlength="25"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item prop="employeeName" label="考勤组名称">
              <el-input v-model="filterForm.attendanceGroupName" :maxlength="25"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" icon="el-icon-search" @click="getEmployeeScheduleList">搜索</el-button>
          </el-col>
        </el-row>

      </el-form>
    </div>

    <div class="app-container calendar-list-container">
      <el-row style="margin: 30px 0;">
        <el-col :span="2">
          <span>班次说明：</span>
        </el-col>
        <el-col :span="22">
          <el-tag v-for="(item, i) in filterShiftList()" :key="i" style="margin-right: 15px;">
            <span v-html="renderShiftTimes(item, true)"></span>
          </el-tag>
        </el-col>
      </el-row>

      <table class="border-table">
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
        <tr v-if="list.length == 0"><td :colspan="daysForMonth.length + 1" class="disabled-text">暂无数据</td></tr>
        <tr v-for="(employeeSchedule, employeeScheduleIndex) in list">
          <td style="max-width: 45px;word-break: break-all;">{{employeeSchedule.employeeName}}</td>
          <td v-for="(daySchedule, i) in JSON.parse(employeeSchedule.everdaySchedule)">
              <span v-if="daySchedule && shiftList.length > 0">{{findBy(shiftList, 'id', daySchedule).shiftName}}</span>
              <span v-else-if="daySchedule === 0">休息</span>
          </td>
        </tr>
        </tbody>
      </table>

      <!-- 分页工具栏-->
      <div v-show="!listLoading" class="pagination-container">
        <el-row>
          <el-col :span="24">
            <el-pagination v-show="!listLoading" @current-change="currentPageChange" :current-page.sync="filterForm.current"
                           :page-size="filterForm.pageSize"
                           layout="total, prev, next"
                           :total="total">
            </el-pagination>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
  import { getEmployeeScheduleList } from '@/api/merchant/work/merchantAttendanceGroup'
  import { getMerchantShiftList } from '@/api/merchant/work/merchantShift'
  import { globalConfig } from '@/globalConfig'
  import { getApplicationCode, getCurProjectCode } from '@/api/common'

  export default {
    name: 'tableEmployeeSchedule',
    data() {
      return {
        curDate: new Date(),
        curApplicationCode: getApplicationCode(this),
        curProjectCode: getCurProjectCode(),
        list: [],
        total: 0,
        listLoading: true,
        filterForm: {
          attendanceGroupName: '',
          employeeName: '',
          date: new Date(),
          current: globalConfig.startPage,
          pageSize: globalConfig.initPageSize
        },
        shiftList: [],
        timeTypeEnum: {
          COMMONLY: 0, // 通用
          DST: 1, // 夏令时
          WT: 2 // 冬令时
        },
        daysForMonth: []
      }
    },
    computed: {
      minimenu2ndStatus() {
        return this.$store.state.app.minimenu2ndStatus
      }
    },
    created() {
      this.getMerchantShiftList()
      this.getEmployeeScheduleList()
    },
    methods: {
      filterShiftList() {
        const shiftIds = []
        let everdaySchedule
        this.list.map(schedule => {
          everdaySchedule = JSON.parse(schedule.everdaySchedule)
          everdaySchedule.map(shiftId => {
            if (shiftId && shiftIds.indexOf(shiftId) === -1) {
              shiftIds.push(shiftId)
            }
          })
        })
        return this.shiftList.filter(shift => {
          return shiftIds.indexOf(shift.id) !== -1
        })
      },
      findBy(array, attrName, attrVal) {
        for (let i = 0; i < array.length; i++) {
          if (array[i][attrName] === attrVal) {
            return array[i]
          }
        }

        return null
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
      getMerchantShiftList() {
        const param = {
          curApplicationCode: this.curApplicationCode,
          curProjectCode: this.curProjectCode,
          current: 1,
          pageSize: 9999
        }
        getMerchantShiftList(param).then(response => {
          if (response.data.error_no === 0) {
            this.shiftList = response.data.result.records
          } else {
            this.$message(response.data.error_info)
          }
        })
      },
      getEmployeeScheduleList() {
        this.listLoading = true
        this.filterForm.curApplicationCode = this.curApplicationCode
        this.filterForm.curProjectCode = this.curProjectCode
        this.filterForm.year = this.filterForm.date.getFullYear()
        this.filterForm.month = this.filterForm.date.getMonth() + 1
        this.initDaysForMonth()
        getEmployeeScheduleList(this.filterForm).then(response => {
          if (response.data.error_no === 0) {
            this.list = response.data.result.records
            this.total = response.data.result.total
          } else {
            this.$message(response.data.error_info)
          }
          this.listLoading = false
        })
      },
      currentPageChange(val) {
        this.filterForm.current = val
        this.getEmployeeScheduleList()
      },
      initDaysForMonth() {
        this.daysForMonth = []
        const date = new Date(this.filterForm.date.getFullYear(), this.filterForm.date.getMonth() + 1, 0)
        const dayCount = date.getDate()
        let temp
        for (let i = 1; i <= dayCount; i++) {
          temp = new Date(date.getFullYear(), date.getMonth() + 1, i)
          this.daysForMonth.push({ day: i, week: '日一二三四五六'.charAt(temp.getDay()) })
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .border-table {
    border-collapse: collapse;
    border: none;
    background-color: white;
    width: 100%;

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
</style>
